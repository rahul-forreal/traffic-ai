import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketProvider.jsx";
import SumoEmbed from "../components/SumoEmbed.jsx";

export default function TrafficCentre() {
    const { socket } = useSocket();
    const [mode, setMode] = useState("MNL");
    const [emergency, setEmergency] = useState(null);
    const [trafficStatus, setTrafficStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!socket) return;
        socket.on("ambulanceAccepted", (d) => setEmergency(d));
        return () => socket.off("ambulanceAccepted");
    }, [socket]);

    // Fetch traffic status every 2 seconds
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5001/status');
                const data = await response.json();
                setTrafficStatus(data);
                setMode(data.mode || "MNL");
            } catch (error) {
                console.error('Failed to fetch traffic status:', error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const toggleMode = async () => {
        const next = mode === "MNL" ? "VAC" : "MNL";
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/signal_control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: next })
            });
            const result = await response.json();
            console.log('Mode change result:', result);
            if (result.ok) {
                setMode(result.mode || next);
                socket?.emit("signalModeChange", { mode: result.mode || next });
            } else {
                console.error('Mode change failed:', result.error);
            }
        } catch (error) {
            console.error('Failed to change mode:', error);
        }
        setLoading(false);
    };

    const forceOverride = async (junction, action) => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/signal_control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    override: {
                        junction: junction,
                        action: action,
                        duration: 15
                    }
                })
            });
            const result = await response.json();
            if (result.ok) {
                socket?.emit("override", { junction, action });
            }
        } catch (error) {
            console.error('Failed to override signal:', error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Traffic Control Centre</h2>
                <button
                    className={px - 4 py-2 rounded text-white ${mode === "MNL" ? "bg-green-600" : "bg-blue-600"} ${loading ? "opacity-50" : ""}}
                onClick={toggleMode}
                disabled={loading}
				>
                {loading ? "Switching..." : Mode: ${mode}}
            </button>
        </div>

			{/* Traffic Signal Status Grid */ }
			<div className="bg-white rounded shadow p-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold mb-4">Traffic Signal Status</h3>
					<a className="text-sm text-indigo-600 underline" href="/traffic/status" target="_blank" rel="noreferrer">Open full junction details</a>
				</div>
				<div className="text-gray-600 text-sm">Quick preview only. Click the link to view all junctions with details.</div>
			</div>

			<SumoEmbed
				rightPanel={
					emergency ? (
						<div>
							<h3 className="font-semibold mb-2">Emergency Route</h3>
							<pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(emergency, null, 2)}</pre>
						</div>
					) : (
						<div className="text-gray-600">No active emergency</div>
					)
				}
			/>
		</div >
	);
}