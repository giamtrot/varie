import { charMaps, convertText } from './utils.js';
let dialogContainer = null;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_dialog") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const segments = getSmartSegments(selection);
            showDialog(segments);
        }
    }
});
function getSmartSegments(selection) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const segments = [];
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
                const text = (node.textContent || '').substring(start, end);
                if (text) {
                    const style = getStyle(node);
                    segments.push({ text, style });
                }
            }
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            const tagName = element.tagName.toUpperCase();
            if (tagName === 'BR') {
                // If the BR is part of the selection (intersects), add a newline
                if (range.intersectsNode(node)) {
                    segments.push({ text: '\n', style: 'plain' });
                }
                return;
            }
            // Check if block (simple check)
            const isBlock = tagName === 'P' || tagName === 'DIV' || tagName === 'LI' ||
                tagName === 'TR' || tagName === 'H1' || tagName === 'H2' ||
                tagName === 'H3' || tagName === 'H4' || tagName === 'H5' || tagName === 'H6';
            // Recurse
            node.childNodes.forEach(child => processNode(child));
            // If block, ensure newline at end (if not already there and we have content)
            if (isBlock) {
                const last = segments[segments.length - 1];
                if (last && !last.text.endsWith('\n')) {
                    segments.push({ text: '\n', style: 'plain' });
                }
            }
        }
    };
    // Optimisation: if container is text node
    if (container.nodeType === Node.TEXT_NODE) {
        let text = (container.textContent || '').substring(range.startOffset, range.endOffset);
        const style = getStyle(container);
        segments.push({ text, style });
        return segments;
    }
    processNode(container);
    return segments;
}
function showDialog(segments) {
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
    styleContainer.style.gap = '8px';
    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '150px';
    textarea.style.padding = '10px';
    textarea.style.border = '1px solid #ccc';
    textarea.style.borderRadius = '4px';
    textarea.style.resize = 'vertical';
    textarea.style.fontSize = '14px';
    textarea.style.boxSizing = 'border-box';
    textarea.style.marginBottom = '10px';
    const renderText = (useSerif) => {
        let result = '';
        segments.forEach(seg => {
            if (seg.style === 'plain') {
                result += seg.text;
                return;
            }
            let mapKey = seg.style; // bold, italic, boldItalic
            if (useSerif) {
                // Map 'bold' -> 'serifBold', etc.
                if (mapKey === 'bold')
                    mapKey = 'serifBold';
                else if (mapKey === 'italic')
                    mapKey = 'serifItalic';
                else if (mapKey === 'boldItalic')
                    mapKey = 'serifBoldItalic';
            }
            const map = charMaps[mapKey];
            if (map) {
                result += convertText(seg.text, map);
            }
            else {
                result += seg.text;
            }
        });
        textarea.value = result;
    };
    // Initial Render: Sans-Serif
    renderText(false);
    // Buttons
    const btnSans = document.createElement('button');
    btnSans.textContent = "Sans-Serif";
    btnSans.style.padding = '6px 12px';
    btnSans.style.border = '1px solid #ddd';
    btnSans.style.borderRadius = '4px';
    btnSans.style.backgroundColor = '#e2e6ea'; // Selected state initial
    btnSans.style.cursor = 'pointer';
    btnSans.style.fontWeight = 'bold';
    const btnSerif = document.createElement('button');
    btnSerif.textContent = "Serif";
    btnSerif.style.padding = '6px 12px';
    btnSerif.style.border = '1px solid #ddd';
    btnSerif.style.borderRadius = '4px';
    btnSerif.style.backgroundColor = '#f8f9fa';
    btnSerif.style.cursor = 'pointer';
    btnSerif.style.fontFamily = 'serif';
    const updateActiveBtn = (isSerif) => {
        if (isSerif) {
            btnSerif.style.backgroundColor = '#e2e6ea';
            btnSerif.style.fontWeight = 'bold';
            btnSans.style.backgroundColor = '#f8f9fa';
            btnSans.style.fontWeight = 'normal';
        }
        else {
            btnSans.style.backgroundColor = '#e2e6ea';
            btnSans.style.fontWeight = 'bold';
            btnSerif.style.backgroundColor = '#f8f9fa';
            btnSerif.style.fontWeight = 'normal';
        }
        renderText(isSerif);
    };
    btnSans.onclick = () => updateActiveBtn(false);
    btnSerif.onclick = () => updateActiveBtn(true);
    styleContainer.appendChild(btnSans);
    styleContainer.appendChild(btnSerif);
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
        // Since we are using Shadow DOM, e.target will report the container (host) 
        // even if the click originated from inside the Shadow DOM (unless stopPropagation is used).
        // However, we can check the composed path.
        const path = e.composedPath();
        // If the path contains the wrapper, the click was INSIDE the dialog.
        if (path.indexOf(wrapper) >= 0) {
            return;
        }
        // Otherwise, it was on the container background.
        if (dialogContainer) {
            document.body.removeChild(dialogContainer);
            dialogContainer = null;
        }
    };
    document.body.appendChild(container);
    dialogContainer = container;
}
