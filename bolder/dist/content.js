import { generateUnicodeTextFromRange } from './utils.js';
let dialogContainer = null;
let lastActiveElement = null;
let lastSelectionRange = null;
let currentRange = null;
let isSerifMode = false;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_dialog") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            saveSelection();
            currentRange = selection.getRangeAt(0).cloneRange();
            showDialog();
        }
    }
});
function saveSelection() {
    lastActiveElement = document.activeElement;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        lastSelectionRange = selection.getRangeAt(0).cloneRange();
    }
    else {
        lastSelectionRange = null;
    }
}
function restoreSelection() {
    if (lastActiveElement && lastActiveElement.focus) {
        lastActiveElement.focus();
    }
    if (lastSelectionRange) {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(lastSelectionRange);
        }
    }
}
function showDialog() {
    if (dialogContainer) {
        document.body.removeChild(dialogContainer);
        dialogContainer = null;
    }
    dialogContainer = document.createElement('div');
    dialogContainer.id = "bolder-dialog-container";
    const shadow = dialogContainer.attachShadow({ mode: 'open' });
    // Styles
    const style = document.createElement('style');
    style.textContent = `
        :host {
            all: initial;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            font-family: sans-serif;
        }
        .dialog {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 90%;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }
        .controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .preview-area {
            width: 100%;
            height: 150px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: inherit;
            font-size: 16px;
            resize: vertical;
            background: #fafafa;
            box-sizing: border-box;
        }
        .buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        button.action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }
        .btn-copy {
            background-color: #f0f0f0;
            color: #333;
        }
        .btn-copy:hover {
            background-color: #e0e0e0;
        }
        .btn-primary {
            background-color: #007bff;
            color: white;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }
        label {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 14px;
            cursor: pointer;
        }
    `;
    shadow.appendChild(style);
    // Dialog Content
    const dialog = document.createElement('div');
    dialog.className = 'dialog';
    // Header
    const header = document.createElement('div');
    header.className = 'header';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = 'Bolder';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeDialog;
    header.appendChild(title);
    header.appendChild(closeBtn);
    dialog.appendChild(header);
    // Controls
    const controls = document.createElement('div');
    controls.className = 'controls';
    const serifLabel = document.createElement('label');
    const serifCheckbox = document.createElement('input');
    serifCheckbox.type = 'checkbox';
    serifCheckbox.checked = isSerifMode;
    serifCheckbox.addEventListener('change', (e) => {
        isSerifMode = e.target.checked;
        updatePreview();
    });
    serifLabel.appendChild(serifCheckbox);
    serifLabel.appendChild(document.createTextNode('Use Serif Font'));
    controls.appendChild(serifLabel);
    dialog.appendChild(controls);
    // Preview
    const preview = document.createElement('textarea');
    preview.className = 'preview-area';
    preview.readOnly = true;
    dialog.appendChild(preview);
    // Buttons
    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn btn-copy';
    copyBtn.textContent = 'Copy to Clipboard';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(preview.value).then(() => {
            const original = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = original, 1000);
        });
    };
    const replaceBtn = document.createElement('button');
    replaceBtn.className = 'action-btn btn-primary';
    replaceBtn.textContent = 'Replace Selection';
    replaceBtn.onclick = () => {
        applyText(preview.value);
    };
    buttons.appendChild(copyBtn);
    buttons.appendChild(replaceBtn);
    dialog.appendChild(buttons);
    shadow.appendChild(dialog);
    // Close on click outside
    dialogContainer.addEventListener('click', (e) => {
        if (e.target === dialogContainer) {
            closeDialog();
        }
    });
    document.body.appendChild(dialogContainer);
    // Initial update
    updatePreview();
    function updatePreview() {
        if (currentRange) {
            const text = generateUnicodeTextFromRange(currentRange, isSerifMode);
            preview.value = text;
        }
    }
}
function closeDialog() {
    if (dialogContainer) {
        document.body.removeChild(dialogContainer);
        dialogContainer = null;
        restoreSelection();
    }
}
function applyText(text) {
    restoreSelection();
    const success = document.execCommand('insertText', false, text);
    if (!success) {
        alert("Could not replace text automatically. It's copied to clipboard!");
        navigator.clipboard.writeText(text);
    }
    closeDialog();
}
