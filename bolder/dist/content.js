import { charMaps, convertText } from './utils.js';
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "convert") {
        const style = request.style;
        const map = charMaps[style];
        if (map) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const text = selection.toString();
                const converted = convertText(text, map);
                if (document.execCommand('insertText', false, converted)) {
                    // Success
                }
                else {
                    // Fallback for non-editable: Maybe copy to clipboard?
                    // But 'insertText' failing usually means not editable.
                    // Let's try to copy it to clipboard so user can paste it.
                    navigator.clipboard.writeText(converted).then(() => {
                        console.log("Converted text copied to clipboard");
                    }).catch(err => {
                        console.error("Failed to copy converted text", err);
                    });
                }
            }
        }
    }
});
