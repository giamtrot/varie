# Bolder - Unicode Text Converter Chrome Extension

Bolder is a Chrome Extension that allows you to convert text into various unicode bold and italic styles directly from your browser toolbar.

## Prerequisites

- Node.js and npm installed.

## Build Instructions

1.  Navigate to the `bolder` directory:
    ```bash
    cd bolder
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Build the project:
    ```bash
    npm run build
    ```
    This will compile the TypeScript code in `src/` to `dist/` (`main.js` for the popup, `background.js`, `content_loader.js`, `content.js` and `utils.js` for the extension).

## Usage

- **Popup**: click the toolbar icon, type in the editor and format with Ctrl+B (bold), Ctrl+I (italic) and Ctrl+Alt+X (serif). The preview shows the Unicode result; use "Copy to Clipboard".
- **Context menu**: select text on any web page, right-click and choose **Bolder**. Bold/italic parts of the selection are converted to Unicode styles in a dialog, where you can choose Sans-Serif or Serif and copy the result.

Note: Unicode has no italic digits, so digits are only converted in bold styles.

## How to Install in Chrome

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** in the top right corner.
3.  Click **Load unpacked**.
4.  Select the `bolder` folder (the folder containing `manifest.json`).
5.  The extension should now appear in your toolbar.
