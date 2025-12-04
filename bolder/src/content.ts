import { charMaps, convertText } from './utils.js';

let dialogContainer: HTMLElement | null = null;
let lastActiveElement: Element | null = null;
let lastSelectionRange: Range | null = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_dialog") {
        const text = request.selectionText || window.getSelection()?.toString();
        if (text) {
            saveSelection();
            showDialog(text);
        }
    }
});

function saveSelection() {
    lastActiveElement = document.activeElement;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        lastSelectionRange = selection.getRangeAt(0).cloneRange();
    } else {
        lastSelectionRange = null;
    }
}

function restoreSelection() {
    if (lastActiveElement && (lastActiveElement as HTMLElement).focus) {
        (lastActiveElement as HTMLElement).focus();
    }

    if (lastSelectionRange) {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(lastSelectionRange);
        }
    }
}

function showDialog(text: string) {
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
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 5px;
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
        .list {
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .item {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            flex-direction: column;
        }
        .item:hover {
            background: #f5f5f5;
        }
        .item-label {
            font-size: 12px;
            color: #888;
            margin-bottom: 4px;
        }
        .item-text {
            font-size: 16px;
            color: #000;
        }
    `;
    shadow.appendChild(style);

    // Dialog Content
    const dialog = document.createElement('div');
    dialog.className = 'dialog';

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

    const list = document.createElement('div');
    list.className = 'list';

    // Generate items
    const styles = [
        { id: "bold", label: "Bold" },
        { id: "italic", label: "Italic" },
        { id: "boldItalic", label: "Bold Italic" },
        { id: "serifBold", label: "Serif Bold" },
        { id: "serifItalic", label: "Serif Italic" },
        { id: "serifBoldItalic", label: "Serif Bold Italic" }
    ];

    styles.forEach(styleInfo => {
        const converted = convertText(text, charMaps[styleInfo.id]);

        const item = document.createElement('div');
        item.className = 'item';
        item.title = "Click to apply/copy";

        const label = document.createElement('span');
        label.className = 'item-label';
        label.textContent = styleInfo.label;

        const textContent = document.createElement('span');
        textContent.className = 'item-text';
        textContent.textContent = converted;

        item.appendChild(label);
        item.appendChild(textContent);

        item.addEventListener('click', () => {
            applyText(converted);
        });

        list.appendChild(item);
    });

    dialog.appendChild(list);
    shadow.appendChild(dialog);

    // Close on click outside
    dialogContainer.addEventListener('click', (e) => {
        if (e.target === dialogContainer) {
            closeDialog();
        }
    });

    document.body.appendChild(dialogContainer);
}

function closeDialog() {
    if (dialogContainer) {
        document.body.removeChild(dialogContainer);
        dialogContainer = null;
        restoreSelection();
    }
}

function applyText(text: string) {
    // Try to replace text if editable
    restoreSelection();

    const success = document.execCommand('insertText', false, text);

    if (success) {
        console.log("Text replaced successfully");
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            console.log("Text copied to clipboard");
            // Maybe show a toast? For now, just close.
            alert("Text copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy", err);
        });
    }

    closeDialog();
}
