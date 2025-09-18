from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/ai_optimize', methods=['POST'])
def ai_optimize():
    data = request.get_json(force=True, silent=True) or {}
    # Mock timings and suggested route
    return jsonify({
        'mode': 'VAC',
        'signal_timings': { 'green': 15, 'yellow': 3, 'red': 20 },
        'route': ['J1','J5','J9','H1'],
        'input': data
    })

if __name__ == '__main__':
    app.run(port=5002, debug=True)