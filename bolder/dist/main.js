"use strict";
const charMaps = {
    bold: {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    },
    italic: {
        'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
        'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
    },
    boldItalic: {
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯',
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕'
    },
    serifBold: {
        'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    },
    serifItalic: {
        'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
        'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
    },
    serifBoldItalic: {
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
    }
};
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const toggleSerifBtn = document.getElementById('toggle-serif-btn');
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
function isSelectionSerif() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return false;
    let container = selection.getRangeAt(0).commonAncestorContainer;
    while (container && container !== editor) {
        if (container.nodeName === 'SPAN' && container.classList.contains('serif')) {
            return true;
        }
        container = container.parentNode;
    }
    return false;
}
function wrapSelection(className) {
    document.execCommand('fontName', false, '__TEMP_FONT_NAME__');
    const tempSpans = editor.querySelectorAll('font[face="__TEMP_FONT_NAME__"]');
    tempSpans.forEach(tempSpan => {
        var _a;
        const newSpan = document.createElement('span');
        newSpan.className = className;
        newSpan.innerHTML = tempSpan.innerHTML;
        (_a = tempSpan.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newSpan, tempSpan);
    });
    updatePreview();
}
function unwrapSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return;
    document.execCommand('fontName', false, 'inherit');
    // La parte sopra potrebbe lasciare degli span vuoti, li puliamo
    const serifSpans = editor.querySelectorAll('span.serif');
    serifSpans.forEach(span => {
        var _a;
        if (span.innerHTML.trim() === '&nbsp;' || span.innerHTML.trim() === '') {
            (_a = span.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(span);
        }
    });
    updatePreview();
}
function toggleSerifStyle() {
    if (isSelectionSerif()) {
        unwrapSelection();
    }
    else {
        wrapSelection('serif');
    }
}
toggleSerifBtn.addEventListener('click', toggleSerifStyle);
function convertText(text, map) {
    return text.split('').map(char => map[char] || char).join('');
}
function processNode(node) {
    let result = '';
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent || '';
        let parent = node.parentNode;
        let isBold = false;
        let isItalic = false;
        let isSerif = false;
        while (parent && parent !== editor) {
            const tagName = parent.tagName.toLowerCase();
            if (tagName === 'b' || tagName === 'strong')
                isBold = true;
            if (tagName === 'i' || tagName === 'em')
                isItalic = true;
            if (tagName === 'span' && parent.classList.contains('serif'))
                isSerif = true;
            parent = parent.parentNode;
        }
        if (isSerif) {
            if (isBold && isItalic)
                text = convertText(text, charMaps.serifBoldItalic);
            else if (isBold)
                text = convertText(text, charMaps.serifBold);
            else if (isItalic)
                text = convertText(text, charMaps.serifItalic);
        }
        else {
            if (isBold && isItalic)
                text = convertText(text, charMaps.boldItalic);
            else if (isBold)
                text = convertText(text, charMaps.bold);
            else if (isItalic)
                text = convertText(text, charMaps.italic);
        }
        return text;
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'br' || (getComputedStyle(element).display === 'block' && element.childNodes.length > 0)) {
            if (result.length > 0)
                result += '\n';
        }
        node.childNodes.forEach(child => {
            result += processNode(child);
        });
    }
    else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
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
