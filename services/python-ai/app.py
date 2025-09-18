from flask import Flask, request, jsonify

app = Flask(_name_)

@app.post('/ai_optimize')
def ai_optimize():
	data = request.get_json(force=True, silent=True) or {}
	# Mock timings and suggested route
	return jsonify({
		'mode': 'VAC',
		'signal_timings': { 'green': 15, 'yellow': 3, 'red': 20 },
		'route': ['J1','J5','J9','H1'],
		'input': data
	})

if _name_ == '_main_':
	app.run(port=5002, debug=True)