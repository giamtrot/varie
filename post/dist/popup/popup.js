"use strict";
// This file contains the logic for the popup window of the extension. 
// It handles user interactions and communicates with the background script.
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('myButton');
    if (button) {
        button.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'buttonClicked' }, (response) => {
                console.log('Response from background:', response);
            });
        });
    }
});
