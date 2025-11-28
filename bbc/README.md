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
npm run build
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

---

Feel free to explore the code and extend its functionality!
