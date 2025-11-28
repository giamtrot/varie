from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

DATA_FILE = "bbc_programs.json"

@app.route('/api/programs')
def get_programs():
    """
    API endpoint to get all programs from the JSON file.
    """
    if not os.path.exists(DATA_FILE):
        return jsonify({"error": "Data file not found."}), 404
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except (IOError, json.JSONDecodeError) as e:
        return jsonify({"error": f"Failed to read or parse data file: {e}"}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the React application.
    This will serve the 'index.html' for any path not matched by the API.
    """
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # The bbc_parser.py script should be run first to generate the bbc_programs.json file.
    if not os.path.exists(DATA_FILE):
        print(f"Warning: {DATA_FILE} not found.")
        print("Please run the `bbc_parser.py` script first to generate the data file.")
    
    app.run(use_reloader=True, port=5000)
