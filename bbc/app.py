from flask import Flask, jsonify, send_from_directory, Response, request
from flask_cors import CORS
import os
import json
import subprocess
import sys

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
            with open(disabled_file, 'w', encoding='utf-8') as f:
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

@app.route('/api/reload-programs', methods=['POST'])
def reload_programs():
    """
    API endpoint to re-run the bbc_parser.py script.
    """
    try:
        # Ensure we're using the same python interpreter that's running the app
        python_executable = sys.executable

        # Run the parser in unbuffered mode so the child process flushes output
        cmd = [python_executable, '-u', 'bbc_parser.py']

        # Use Popen and capture stdout/stderr; avoid printing to the Flask app's stdout
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Capture output
        stdout, stderr = process.communicate()
        print("Parser stdout:", stdout)
        combined = "".join(filter(None, [stdout, stderr]))

        if process.returncode != 0:
            raise subprocess.CalledProcessError(process.returncode, cmd, stdout, stderr)

        return jsonify({
            "message": "Reload completed successfully.",
            "output": combined
        })
    except subprocess.CalledProcessError as e:
        return jsonify({
            "error": "Failed to execute parser script.",
            "output": str(e.stdout) + str(e.stderr)
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/reload-programs-stream')
def reload_programs_stream():
    """
    Stream the output of `bbc_parser.py` as Server-Sent Events (SSE).

    Connect with a browser `EventSource('/api/reload-programs-stream')` to receive
    real-time lines. The parser is started on connect and runs in unbuffered mode.
    """
    def generate():
        python_executable = sys.executable
        cmd = [python_executable, '-u', 'bbc_parser.py']

        # Merge stderr into stdout so we stream everything in order
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )

        try:
            if process.stdout is None:
                return

            # Stream each line as an SSE `data:` event (JSON-encoded to be safe)
            for line in iter(process.stdout.readline, ''):
                if line == '':
                    break
                yield f"data: {json.dumps(line.rstrip())}\n\n"

            # Ensure process has finished
            process.wait()
            rc = process.returncode
            yield f"event: done\ndata: {rc}\n\n"

        except GeneratorExit:
            # Client disconnected; try to terminate the child process
            try:
                if process.poll() is None:
                    process.terminate()
            except Exception:
                pass
        finally:
            try:
                if process.poll() is None:
                    process.terminate()
            except Exception:
                pass

    return Response(generate(), mimetype='text/event-stream')

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
