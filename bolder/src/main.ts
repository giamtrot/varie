import { charMaps, convertText } from './utils.js';

const editor = document.getElementById('editor')!; 
const preview = document.getElementById('preview')!; 
const toggleSerifBtn = document.getElementById('toggle-serif-btn')!; 
const copyBtn = document.getElementById('copy-btn');

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const text = preview.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
}

function isSelectionSerif(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    let container = selection.getRangeAt(0).commonAncestorContainer;

    while (container && container !== editor) {
        if (container.nodeName === 'SPAN' && (container as HTMLElement).classList.contains('serif')) {
            return true;
        }
        container = container.parentNode!;
    }
    return false;
}

function wrapSelection(className: string) {
    document.execCommand('fontName', false, '__TEMP_FONT_NAME__');
    const tempSpans = editor.querySelectorAll('font[face="__TEMP_FONT_NAME__"]');
    tempSpans.forEach(tempSpan => {
        const newSpan = document.createElement('span');
        newSpan.className = className;
        newSpan.innerHTML = tempSpan.innerHTML;
        tempSpan.parentNode?.replaceChild(newSpan, tempSpan);
    });
    updatePreview();
}

function unwrapSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    document.execCommand('fontName', false, 'inherit');
    
    // La parte sopra potrebbe lasciare degli span vuoti, li puliamo
    const serifSpans = editor.querySelectorAll('span.serif');
    serifSpans.forEach(span => {
        if (span.innerHTML.trim() === '&nbsp;' || span.innerHTML.trim() === '') {
            span.parentNode?.removeChild(span);
        }
    });

    updatePreview();
}

function toggleSerifStyle() {
    if (isSelectionSerif()) {
        unwrapSelection();
    } else {
        wrapSelection('serif');
    }
}

toggleSerifBtn.addEventListener('click', toggleSerifStyle);

function processNode(node: Node): string {
    let result = '';
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent || '';
        let parent = node.parentNode as HTMLElement;
        let isBold = false;
        let isItalic = false;
        let isSerif = false;

        while (parent && parent !== editor) {
            const tagName = parent.tagName.toLowerCase();
            if (tagName === 'b' || tagName === 'strong') isBold = true;
            if (tagName === 'i' || tagName === 'em') isItalic = true;
            if (tagName === 'span' && parent.classList.contains('serif')) isSerif = true;
            parent = parent.parentNode as HTMLElement;
        }

        if (isSerif) {
            if (isBold && isItalic) text = convertText(text, charMaps.serifBoldItalic);
            else if (isBold) text = convertText(text, charMaps.serifBold);
            else if (isItalic) text = convertText(text, charMaps.serifItalic);
        } else {
            if (isBold && isItalic) text = convertText(text, charMaps.boldItalic);
            else if (isBold) text = convertText(text, charMaps.bold);
            else if (isItalic) text = convertText(text, charMaps.italic);
        }
        return text;

    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'br' || (getComputedStyle(element).display === 'block' && element.childNodes.length > 0)) {
             if (result.length > 0) result += '\n';
        }

        node.childNodes.forEach(child => {
            result += processNode(child);
        });

    } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        node.childNodes.forEach(child => {
            result += processNode(child);
        });
    }
    return result;
}

function updatePreview() {
    let result = '';
    editor.childNodes.forEach(child => {
        result += processNode(child);
    });
    preview.innerText = result.replace(/\n{3,}/g, '\n\n'); // Limita i newline multipli
}

editor.addEventListener('input', updatePreview);

editor.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'x') {
        event.preventDefault();
        toggleSerifStyle();
    }
});

// Esegui un primo aggiornamento in caso ci sia contenuto iniziale
updatePreview();
