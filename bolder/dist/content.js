import { charMaps, convertText } from './utils.js';
let dialogContainer = null;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_dialog") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const plainText = selection.toString();
            const smartText = getSmartSelectionText(selection);
            showDialog(smartText, plainText);
        }
    }
});
function getSmartSelectionText(selection) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    let result = '';
    function getStyle(node) {
        if (node.nodeType !== Node.TEXT_NODE)
            return 'plain';
        const parent = node.parentElement;
        if (!parent)
            return 'plain';
        const style = window.getComputedStyle(parent);
        const fontWeight = style.fontWeight;
        const isBold = fontWeight === 'bold' || parseInt(fontWeight) >= 600;
        const isItalic = style.fontStyle === 'italic' || style.fontStyle === 'oblique';
        if (isBold && isItalic)
            return 'boldItalic';
        if (isBold)
            return 'bold';
        if (isItalic)
            return 'italic';
        return 'plain';
    }
    const processNode = (node) => {
        if (!selection.containsNode(node, true))
            return;
        if (node.nodeType === Node.TEXT_NODE) {
            // Check intersection with range.
            if (range.intersectsNode(node)) {
                let start = 0;
                let end = (node.textContent || '').length;
                if (node === range.startContainer)
                    start = range.startOffset;
                if (node === range.endContainer)
                    end = range.endOffset;
                const chunk = (node.textContent || '').substring(start, end);
                if (chunk) {
                    const style = getStyle(node);
                    if (style !== 'plain' && charMaps[style]) {
                        result += convertText(chunk, charMaps[style]);
                    }
                    else {
                        result += chunk;
                    }
                }
            }
        }
        else {
            // Traverse children
            node.childNodes.forEach(child => processNode(child));
        }
    };
    // Optimisation: if container is text node
    if (container.nodeType === Node.TEXT_NODE) {
        let text = (container.textContent || '').substring(range.startOffset, range.endOffset);
        const style = getStyle(container);
        if (style !== 'plain' && charMaps[style]) {
            return convertText(text, charMaps[style]);
        }
        return text;
    }
    processNode(container);
    return result;
}
function showDialog(initialSmartText, plainText) {
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
    wrapper.style.maxWidth = '600px';
    wrapper.style.width = '90%';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '15px';
    wrapper.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    const title = document.createElement('h2');
    title.textContent = 'Bolder Text';
    title.style.margin = '0';
    title.style.fontSize = '18px';
    title.style.color = '#333';
    header.appendChild(title);
    const styleContainer = document.createElement('div');
    styleContainer.style.display = 'flex';
    styleContainer.style.flexWrap = 'wrap';
    styleContainer.style.gap = '8px';
    const styles = [
        { id: "bold", title: "Bold" },
        { id: "italic", title: "Italic" },
        { id: "boldItalic", title: "Bold Italic" },
        { id: "serifBold", title: "Serif Bold" },
        { id: "serifItalic", title: "Serif Italic" },
        { id: "serifBoldItalic", title: "Serif Bold Italic" }
    ];
    const textarea = document.createElement('textarea');
    textarea.value = initialSmartText;
    textarea.style.width = '100%';
    textarea.style.height = '150px';
    textarea.style.padding = '10px';
    textarea.style.border = '1px solid #ccc';
    textarea.style.borderRadius = '4px';
    textarea.style.resize = 'vertical';
    textarea.style.fontSize = '14px';
    textarea.style.boxSizing = 'border-box';
    textarea.style.marginBottom = '10px';
    const updateText = (styleId) => {
        const map = charMaps[styleId];
        if (map) {
            textarea.value = convertText(plainText, map);
        }
    };
    styles.forEach(style => {
        const btn = document.createElement('button');
        btn.textContent = style.title;
        btn.style.padding = '6px 12px';
        btn.style.border = '1px solid #ddd';
        btn.style.borderRadius = '4px';
        btn.style.backgroundColor = '#f8f9fa';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';
        btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#e2e6ea');
        btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#f8f9fa');
        btn.onclick = () => updateText(style.id);
        styleContainer.appendChild(btn);
    });
    const resetBtn = document.createElement('button');
    resetBtn.textContent = "Reset to Smart";
    resetBtn.style.padding = '6px 12px';
    resetBtn.style.border = '1px solid #ddd';
    resetBtn.style.borderRadius = '4px';
    resetBtn.style.backgroundColor = '#fff';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.fontSize = '13px';
    resetBtn.onclick = () => {
        textarea.value = initialSmartText;
    };
    styleContainer.appendChild(resetBtn);
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.borderTop = '1px solid #eee';
    buttonContainer.style.paddingTop = '15px';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy to Clipboard';
    copyBtn.style.padding = '8px 16px';
    copyBtn.style.backgroundColor = '#007bff';
    copyBtn.style.color = '#fff';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '4px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(textarea.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '#007bff';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
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
    buttonContainer.appendChild(closeBtn);
    buttonContainer.appendChild(copyBtn);
    wrapper.appendChild(header);
    wrapper.appendChild(styleContainer);
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
