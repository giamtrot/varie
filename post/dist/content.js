"use strict";
// This file contains the content script that interacts with web pages. 
// It can manipulate the DOM and respond to messages from other parts of the extension.
const changeBackgroundColor = (color) => {
    document.body.style.backgroundColor = color;
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "changeColor") {
        changeBackgroundColor(request.color);
        sendResponse({ status: "success" });
    }
});
