import { charMaps, convertText } from './utils.js';

let dialogContainer: HTMLElement | null = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "convert") {
        const style = request.style;
        const map = charMaps[style];
        if (map) {
            const selection = window.getSelection();
            if (selection && selection.toString()) {
                const text = selection.toString();
                const converted = convertText(text, map);
                showDialog(converted);
            }
        }
    }
});

function showDialog(convertedText: string) {
    if (dialogContainer) {
        document.body.removeChild(dialogContainer);
        dialogContainer = null;
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '2147483647'; // Max z-index
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    const shadow = container.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.style.backgroundColor = '#fff';
    wrapper.style.padding = '20px';
    wrapper.style.borderRadius = '8px';
    wrapper.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    wrapper.style.maxWidth = '500px';
    wrapper.style.width = '90%';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '10px';
    wrapper.style.fontFamily = 'sans-serif';

    const title = document.createElement('h2');
    title.textContent = 'Converted Text';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '18px';
    title.style.color = '#333';

    const textarea = document.createElement('textarea');
    textarea.value = convertedText;
    textarea.style.width = '100%';
    textarea.style.height = '150px';
    textarea.style.padding = '10px';
    textarea.style.border = '1px solid #ccc';
    textarea.style.borderRadius = '4px';
    textarea.style.resize = 'vertical';
    textarea.style.fontSize = '14px';
    textarea.style.boxSizing = 'border-box'; // Ensure padding doesn't overflow

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.style.padding = '8px 16px';
    copyBtn.style.backgroundColor = '#007bff';
    copyBtn.style.color = '#fff';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '4px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(convertedText).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.backgroundColor = '#6c757d';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        if (dialogContainer) {
            document.body.removeChild(dialogContainer);
            dialogContainer = null;
        }
    };

    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(closeBtn);

    wrapper.appendChild(title);
    wrapper.appendChild(textarea);
    wrapper.appendChild(buttonContainer);

    shadow.appendChild(wrapper);

    // Close on click outside
    container.onclick = (e) => {
        if (e.target === container) {
            if (dialogContainer) {
                document.body.removeChild(dialogContainer);
                dialogContainer = null;
            }
        }
    };

    document.body.appendChild(container);
    dialogContainer = container;
}
