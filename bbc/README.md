# BBC Audio Program Explorer

This project consists of a Python scraper (`bbc_parser.py`), a Flask backend (`app.py`), and a React frontend (`frontend/`) to display collected BBC Audio program data.

## Features

*   **Scrape Program Data:** Collects program details (title, description, date, links, story, headlines, keywords) from specified BBC Audio brand pages.
*   **Data Persistence:** Saves collected data to `bbc_programs.json` and identifies new programs on subsequent runs.
*   **Web Interface:** Provides a user-friendly web application to browse programs, view full details, and trigger data reloads.

## Setup Instructions

Follow these steps to set up and run the application locally.

### Prerequisites

Make sure you have the following installed:

*   **Python 3.8+**
*   **Node.js (LTS version) & npm**

### 1. Backend Setup (Python)

Navigate to the root directory of the project (where `bbc_parser.py` and `app.py` are located).

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Generate Initial Data

Run the parser script once to generate the `bbc_programs.json` data file. This file will be used by the Flask backend.

```bash
python bbc_parser.py
```

### 2. Frontend Setup (React)

Navigate into the `frontend` directory.

```bash
cd frontend
```

#### Install Node.js Dependencies

```bash
npm install
```

#### Build the React Application

Build the React project for production. This will create a `build` folder in the `frontend` directory, which the Flask backend will serve.

```bash
npm run build:watch
```

### 3. Run the Application

Navigate back to the root directory of the project.

```bash
cd ..
```

#### Start the Flask Backend Server

Run the Flask application. This will serve both the API and the static React frontend files.

```bash
python app.py
```

### 4. Access the Web Application

Once the Flask server is running (you should see output similar to `* Running on http://127.0.0.1:5000`), open your web browser and navigate to:

[http://127.0.0.1:5000/](http://127.0.0.1:5000/)

### 5. Using the "Reload Programs" Button

On the home page of the web application, you will find a "Reload Programs" button. Clicking this button will:

*   Execute the `bbc_parser.py` script on the backend.
*   Display the output of the parser script in a dedicated log section on the page.
*   Refresh the list of programs with any newly found entries.

### 3. Build a Standalone Windows Executable

You can package the Flask backend (`app.py`) as a standalone Windows executable (`BBCNews.exe`) using PyInstaller. The executable will include the React frontend build, data files, and all dependencies.

#### Install PyInstaller

```cmd
pip install pyinstaller
```

#### Build the Executable (Recommended)

From the project root (where `app.py` and `BBCNews.spec` are located), run:

```cmd
pyinstaller --clean BBCNews.spec
```

This spec file automatically bundles:
- The compiled React frontend (`frontend/build` folder)
- `bbc_programs.json` and `disabled_programs.json` (if present)
- All Python dependencies

The resulting `BBCNews.exe` will be in the `dist` folder.

#### Alternative: Build Without Spec File

If you prefer not to use the spec file, you can build from scratch with this command:

```cmd
pyinstaller --onefile --add-data "bbc_programs.json;." --add-data "disabled_programs.json;." --add-data "frontend\\build;frontend\\build" --name BBCNews app.py
```

#### Running the Executable

- Navigate to the `dist` folder and run `BBCNews.exe`.
- Open your browser and go to `http://localhost:5000/`.
- The Flask server will serve both the React frontend and the API endpoints.

#### Notes
- The executable looks for data files in this order: bundled (`_MEIPASS`), exe folder, script folder, current working directory.
- If you update `bbc_programs.json` or `disabled_programs.json`, you can either:
  - Place them next to `BBCNews.exe` and they will be used (see debug log output).
  - Rebuild the executable with the updated files.
- If you add new Python dependencies, update `requirements.txt` and rebuild the executable.

#### Debug Output

When `BBCNews.exe` starts, it prints debug information showing which paths it checked to locate data files. This helps verify the executable is finding your files correctly.

---

Feel free to explore the code and extend its functionality!
