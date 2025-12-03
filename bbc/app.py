from flask import Flask, jsonify, send_from_directory, Response, request
from flask_cors import CORS
import os
import json
from bbc_parser import run_parser
import webbrowser
from threading import Timer

import sys

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

DATA_FILE = "bbc_programs.json"

@app.route('/api/programs')
def get_programs():
    """
    API endpoint to get all programs from the JSON file.
    """
    print("Fetching data from file:", os.path.abspath(DATA_FILE))
    
    if not os.path.exists(DATA_FILE):
        return jsonify({"error": "Data file not found."}), 404
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except (IOError, json.JSONDecodeError) as e:
        return jsonify({"error": f"Failed to read or parse data file: {e}"}), 500


@app.route('/api/disabled-programs', methods=['GET', 'POST'])
def manage_disabled_programs():
    """
    GET: Retrieve the list of disabled program links.
    POST: Save the list of disabled program links.
    """
    disabled_file = "disabled_programs.json"
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            disabled_links = data.get('disabled', [])
            with open(disabled_file, 'w', encoding='utf-8', newline='\n') as f:
                json.dump({"disabled": disabled_links}, f, indent=2)
            return jsonify({"message": "Disabled programs saved."}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    # GET request
    try:
        if os.path.exists(disabled_file):
            with open(disabled_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data), 200
        else:
            return jsonify({"disabled": []}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reload-programs-stream')
def reload_programs_stream():
    """
    Stream the output of the bbc_parser logic as Server-Sent Events (SSE).
    """
    def generate():
        print("Starting parser stream...")
        try:
            # The parser yields lines of output
            for line in run_parser():
                yield f"data: {json.dumps(line)}\n\n"
            
            # Signal completion
            yield "event: done\ndata: 0\n\n"

        except GeneratorExit:
            # Client disconnected
            print("Client disconnected from stream.")
        except Exception as e:
            print(f"An error occurred during parsing: {e}")
            yield f"event: error\ndata: {json.dumps(str(e))}\n\n"

    return Response(generate(), mimetype='text/event-stream')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the React application.
    This will serve the 'index.html' for any path not matched by the API.
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


def open_browser():
    """
    Open the default web browser to the application's URL.
    """
    print("Opening web browser to http://localhost:5000")
    webbrowser.open_new("http://localhost:5000")


if __name__ == '__main__':
    # The bbc_parser.py script should be run first to generate the bbc_programs.json file.
    if not os.path.exists(DATA_FILE):
        print(f"Warning: {DATA_FILE} not found.")
        print("Please run the `bbc_parser.py` script first to generate the data file.")
        
    print("Received parameters:")
    for i, arg in enumerate(sys.argv):
        print(f"Argument {i}: {arg}")
    
    # Disable reloader when running from a PyInstaller bundle
    use_reloader = not getattr(sys, 'frozen', False)
    port = 5000
    # Open the browser in a new thread after a short delay
    if not use_reloader or os.environ.get("RUN_MAIN") == "true":
        Timer(1, open_browser).start()

    app.run(use_reloader=use_reloader, port=port)
