from flask import Flask, jsonify, send_from_directory, Response, request
from flask_cors import CORS
import os
import json
from bbc_parser import run_parser
import webbrowser
from threading import Timer

import sys

# Get the directory where the executable/script was launched (argument 0)
SCRIPT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(sys.argv[0])))

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

# Parse command-line arguments for optional data file parameter
import argparse

# Create parser but don't use parse_args() yet to avoid conflicts with other args
parser = argparse.ArgumentParser(add_help=False)
parser.add_argument('--data-file', type=str, help='Path to the data file (bbc_programs.json)')
parser.add_argument('--port', type=int, default=4000, help='Port to run the server on (default: 4000)')

# Parse known args to extract --data-file if present
known_args, _ = parser.parse_known_args()

# Determine data file path
if known_args.data_file:
    # Use the provided data file path
    DATA_FILE = os.path.abspath(known_args.data_file)
    SCRIPT_DIR = os.path.dirname(DATA_FILE)
else:
    # Get the parent folder from sys.argv[0] and construct path to dist/bbc_programs.json
    # When running as .exe: sys.argv[0] = .../dist/BBCNews/BBCNews.exe
    # We need to go up 2 levels: BBCNews.exe -> BBCNews -> dist
    SCRIPT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(sys.argv[0])))
    DATA_FILE = os.path.join(SCRIPT_DIR, "bbc_programs.json")

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
    disabled_file = os.path.join(SCRIPT_DIR, "disabled_programs.json")
    print(f"Disabled programs file path: {os.path.abspath(disabled_file)}")
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            disabled_links = data.get('disabled', [])
            print(f"Saving {len(disabled_links)} disabled programs to {disabled_file}")
            with open(disabled_file, 'w', encoding='utf-8', newline='\n') as f:
                json.dump({"disabled": disabled_links}, f, indent=2)
            print("Successfully saved disabled programs")
            return jsonify({"message": "Disabled programs saved."}), 200
        except Exception as e:
            print(f"Error saving disabled programs: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500
    
    # GET request
    try:
        if os.path.exists(disabled_file):
            with open(disabled_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"Loaded {len(data.get('disabled', []))} disabled programs")
            return jsonify(data), 200
        else:
            print(f"Disabled programs file does not exist, returning empty list")
            return jsonify({"disabled": []}), 200
    except Exception as e:
        print(f"Error loading disabled programs: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/review-keywords')
def get_review_keywords():
    """
    API endpoint to get 3 random keywords from disabled programs.
    Returns keyword text, explanation, and example.
    """
    import re
    import random
    
    disabled_file = os.path.join(SCRIPT_DIR, "disabled_programs.json")
    
    try:
        # Load disabled programs list
        disabled_links = []
        if os.path.exists(disabled_file):
            with open(disabled_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                disabled_links = data.get('disabled', [])
        
        if not disabled_links:
            return jsonify({"keywords": [], "message": "No disabled programs found"}), 200
        
        # Load all programs
        if not os.path.exists(DATA_FILE):
            return jsonify({"error": "Data file not found."}), 404
        
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            all_programs = json.load(f)
        
        # Filter only disabled programs
        disabled_programs = [p for p in all_programs if p.get('link') in disabled_links]
        
        # Extract all keywords from disabled programs
        all_keywords = []
        for program in disabled_programs:
            keywords_html = program.get('keywords', '')
            if keywords_html and keywords_html != 'N/A':
                # Split by keyword entries (each starts with \t<strong>)
                keyword_entries = re.split(r'\n\t(?=<strong>)', keywords_html)
                
                for entry in keyword_entries:
                    if not entry.strip():
                        continue
                    
                    # Extract keyword text
                    keyword_match = re.search(r'<strong>(.*?)</strong>', entry)
                    if not keyword_match:
                        continue
                    
                    keyword_text = re.sub(r'<br\s*/?>', '', keyword_match.group(1)).strip()
                    
                    # Extract explanation (text between first </strong> and <li>)
                    explanation_match = re.search(r'</strong>\s*\n\s*\t*(.*?)\s*(?:<li>|$)', entry, re.DOTALL)
                    explanation = explanation_match.group(1).strip() if explanation_match else ''
                    
                    # Extract example (text inside <li> tags)
                    example_match = re.search(r'<li>(.*?)</li>', entry, re.DOTALL)
                    if example_match:
                        example = example_match.group(1).strip()
                        # Remove <strong> tags from example but keep the text
                        example = re.sub(r'</?strong>', '', example)
                        example = re.sub(r'<br\s*/?>', '', example)
                    else:
                        example = ''
                    
                    if keyword_text:
                        all_keywords.append({
                            'text': keyword_text,
                            'explanation': explanation,
                            'example': example,
                            'programTitle': program.get('title', ''),
                            'programLink': program.get('link', '')
                        })
        
        # Remove duplicates based on keyword text
        unique_keywords = []
        seen_texts = set()
        for kw in all_keywords:
            if kw['text'] not in seen_texts:
                unique_keywords.append(kw)
                seen_texts.add(kw['text'])
        
        # Select 3 random keywords
        if len(unique_keywords) >= 3:
            selected_keywords = random.sample(unique_keywords, 3)
        else:
            selected_keywords = unique_keywords
        
        return jsonify({"keywords": selected_keywords}), 200
        
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
            for line in run_parser(data_dir=os.path.dirname(DATA_FILE)):
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

@app.route("/program/<path:dummy>")
def serve_path_dummy(dummy):
    print(f"Serving SPA for /program/{dummy}")
    return send_from_directory(app.static_folder, "index.html")

@app.route("/", defaults={"path": ""})
def serve(path):
    print("Serving SPA for /")
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_path(path):
    print("Serving SPA for /<path:path>")
    return send_from_directory(app.static_folder, "index.html")

@app.route("/review", defaults={"path": ""})
def serve_review(path):
    print("Serving SPA for /review")
    return send_from_directory(app.static_folder, "index.html") 


def is_port_in_use(port):
    """
    Check if a port is already in use.
    """
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('localhost', port))
            return False
        except OSError as e:
            print(f"Port {port} bind error. Error: {e}")    
            return True


def open_browser(port, path=""):
    """
    Open the default web browser to the application's URL.
    """
    url = f"http://localhost:{port}{path}"
    print(f"Opening web browser to {url}")
    webbrowser.open_new(url)


if __name__ == '__main__':
    # Print running path on startup
    print("="*60)
    print("BBC Programs Application Starting...")
    print(f"Running from: {SCRIPT_DIR}")
    print(f"Data file path: {DATA_FILE}")
    print("="*60)
    
    # The bbc_parser.py script should be run first to generate the bbc_programs.json file.
    if not os.path.exists(DATA_FILE):
        print(f"Warning: {DATA_FILE} not found.")
        print("Please run the `bbc_parser.py` script first to generate the data file.")
        
    print("Received parameters:")
    for i, arg in enumerate(sys.argv):
        print(f"Argument {i}: {arg}")
    
    # Check if arg 1 ends with "review"
    browser_path = ""
    if len(sys.argv) > 1 and ( sys.argv[1].endswith("review") or sys.argv[1].endswith("review/")):
        browser_path = "/review"
    
    # Disable reloader when running from a PyInstaller bundle
    use_reloader = not getattr(sys, 'frozen', False)
    # use_reloader = False
    port = known_args.port
    
    
    # Check if the port is already in use
    if not use_reloader and is_port_in_use(port):
        print(f"Port {port} is already in use. Another Flask server is likely running.")
        print("Opening browser to existing server instead of starting a new one.")
        open_browser(port, browser_path)
    else:
        print(f"Starting Flask app on port {port} with reloader={'enabled' if use_reloader else 'disabled'}")
        
        # Open the browser in a new thread after a short delay
        # The 'WERKZEUG_RUN_MAIN' environment variable is set by Werkzeug when the reloader is active,
        # but only for the main process, not the reloader's child process.
        if not use_reloader or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
            Timer(3, open_browser, args=[port, browser_path]).start()
    
        app.run(use_reloader=use_reloader, port=port)
