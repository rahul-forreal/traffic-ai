from flask import Flask, request, jsonify, send_file
import time
import os
import tempfile
import threading
from datetime import datetime, timedelta

traci = None
SUMO_REMOTE_PORT = int(os.environ.get('SUMO_REMOTE_PORT', '8873'))
SUMO_VIEW_ID = None

app = Flask(_name_)

# Global CORS for frontend at different origin
@app.after_request
def add_cors_headers(resp):
	resp.headers['Access-Control-Allow-Origin'] = '*'
	resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
	resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
	return resp

# ---------------- Traffic Signal Control (independent of visual) -----------------
class TrafficController:
    def _init_(self):
        self.mode = "MNL"  # MNL fixed-time, VAC adaptive
        self.junctions = { f"J{i}": {"id": f"J{i}", "state": "RED", "queue": 0, "last_change": datetime.now()} for i in range(1,7) }
        self.green_time_mnl = 25
        self.yellow_time = 3
        self.red_time = 5
        self.running = True
        self._vac_thread = None
        self._ctl_thread = threading.Thread(target=self._simulate_status_loop, daemon=True)
        self._ctl_thread.start()

    def _simulate_status_loop(self):
        # Only for website status visuals; does not control SUMO
        while self.running:
            now = datetime.now()
            for j in self.junctions.values():
                elapsed = (now - j["last_change"]).total_seconds()
                if elapsed > (self.green_time_mnl + self.yellow_time + self.red_time):
                    j["last_change"] = now
            time.sleep(1)

    def set_mode(self, mode: str):
        if mode not in ("MNL","VAC"):
            return False
        self.mode = mode
        if mode == "VAC":
            self._start_vac()
        else:
            self._stop_vac()
        return True

    def _start_vac(self):
        if self._vac_thread and self._vac_thread.is_alive():
            return
        self._vac_thread = threading.Thread(target=self._vac_loop, daemon=True)
        self._vac_thread.start()

    def _stop_vac(self):
        # VAC loop checks mode flag and exits
        pass

    def _vac_loop(self):
        while self.mode == "VAC":
            try:
                conn = get_traci_connection()
                for tls_id in conn.trafficlight.getIDList():
                    prog = conn.trafficlight.getCompleteRedYellowGreenDefinition(tls_id)
                    if not prog:
                        continue
                    phases = prog[0].phases
                    controlled_links = conn.trafficlight.getControlledLinks(tls_id)
                    best_phase = conn.trafficlight.getPhase(tls_id)
                    best_score = -1
                    for p_idx, ph in enumerate(phases):
                        state = ph.state
                        score = 0
                        for sig_idx, ch in enumerate(state):
                            if ch in ('G','g') and sig_idx < len(controlled_links):
                                links = controlled_links[sig_idx] or []
                                for link in links:
                                    in_lane = link[0]
                                    in_edge = in_lane.split('_')[0]
                                    try:
                                        score += conn.edge.getLastStepHaltingNumber(in_edge)
                                    except Exception:
                                        pass
                        if score > best_score:
                            best_score = score
                            best_phase = p_idx
                    try:
                        conn.trafficlight.setPhase(tls_id, best_phase)
                        conn.trafficlight.setPhaseDuration(tls_id, 8)
                    except Exception:
                        pass
                time.sleep(2)
            except Exception:
                time.sleep(1)

traffic_controller = TrafficController()
# -------------------------------------------------------------------------------

def load_traci_module():
    global traci
    if traci is not None:
        return
    sumo_home = os.environ.get('SUMO_HOME')
    if sumo_home:
        tools = os.path.join(sumo_home, 'tools')
        if os.path.isdir(tools) and tools not in os.sys.path:
            os.sys.path.append(tools)
    try:
        import traci as _traci  # type: ignore
        globals()['traci'] = _traci
    except Exception as e:
        raise RuntimeError(f"Could not import traci. Set SUMO_HOME. Details: {e}")


def get_traci_connection():
    load_traci_module()
    try:
        conn = traci.getConnection('default')
        _ = conn.simulation.getTime()
        return conn
    except Exception:
        pass
    last = None
    for _ in range(20):
        try:
            conn = traci.connect(port=SUMO_REMOTE_PORT)
            return conn
        except Exception as e:
            last = e
            time.sleep(0.5)
    if last:
        raise last
    raise RuntimeError('Unable to connect to TraCI')

# Background simulation stepper so SUMO advances even in server mode
_def_stepper_started = False

def _start_stepper():
    global _def_stepper_started
    if _def_stepper_started:
        return
    _def_stepper_started = True

    def loop():
        conn = None
        while True:
            try:
                if conn is None:
                    conn = get_traci_connection()
                    print(f"[Stepper] Connected to SUMO on port {SUMO_REMOTE_PORT}")
                conn.simulationStep()
                time.sleep(0.1)
            except Exception as e:
                print(f"[Stepper] Error: {e}")
                conn = None
                time.sleep(1)
    threading.Thread(target=loop, daemon=True).start()

_start_stepper()

@app.route('/signal_control', methods=['POST','OPTIONS'])
def signal_control():
    if request.method == 'OPTIONS':
        return ('', 204)
	data = request.get_json(force=True, silent=True) or {}
    if 'mode' in data:
        ok = traffic_controller.set_mode(data['mode'])
        if ok:
            return jsonify({ 'ok': True, 'mode': traffic_controller.mode })
        return jsonify({ 'error': 'Invalid mode' }), 400
    if 'override' in data:
        return jsonify({ 'ok': True, 'note': 'override endpoint reserved' })
    return jsonify({ 'ok': True })

@app.get('/status')
def status():
    # Try live queues and TLS state from SUMO; fall back to cached values
    try:
        conn = get_traci_connection()
        tl_ids = conn.trafficlight.getIDList()
        results = []
        for tls_id in tl_ids:
            try:
                controlled_links = conn.trafficlight.getControlledLinks(tls_id)
                incoming_edges = set()
                for links in controlled_links:
                    for link in (links or []):
                        in_lane = link[0]
                        incoming_edges.add(in_lane.split('_')[0])
                q = 0
                for e in incoming_edges:
                    try:
                        q += conn.edge.getLastStepHaltingNumber(e)
                    except Exception:
                        pass
                state_str = conn.trafficlight.getRedYellowGreenState(tls_id)
                results.append({ 'id': tls_id, 'queue': int(q), 'state': state_str })
            except Exception:
                results.append({ 'id': tls_id, 'queue': 0, 'state': 'UNKNOWN' })
        return jsonify({ 'mode': traffic_controller.mode, 'junctions': results, 'source': 'SUMO' })
    except Exception:
        return jsonify({ 'mode': traffic_controller.mode, 'junctions': list(traffic_controller.junctions.values()), 'source': 'FALLBACK' })

@app.get('/test')
def test():
    return jsonify({ 'ok': True, 'message': 'Controller is running', 'time': time.time() })

@app.get('/frame')
def frame():
    global SUMO_VIEW_ID
    try:
        conn = get_traci_connection()
        if SUMO_VIEW_ID is None:
            views = conn.gui.getIDList()
            SUMO_VIEW_ID = views[0] if views else "View #0"
        tmp_dir = tempfile.gettempdir()
        png_path = os.path.join(tmp_dir, 'sumo_frame.png')
        conn.gui.screenshot(SUMO_VIEW_ID, png_path)
        return send_file(png_path, mimetype='image/png', cache_timeout=0)
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

if _name_ == '_main_':
	app.run(port=5001, debug=True)