"use strict";
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("onMessage", message, sender);
    // if (message.action === "openTab") {
    // 	console.log("openTab", message)
    // 	chrome.tabs.create({
    // 		url: message.data.url,
    // 		active: false  // Questo apre il tab in background
    // 	});
    // } else 
    if (message.action === "loadScripts" && sender.tab && sender.tab.id !== undefined) {
        console.log("loadScripts", message.files, sender.tab.id);
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: message.files,
            world: message.world
        });
    }
    else {
        console.error('Sender is not a tab');
    }
    sendResponse("done: " + message.action);
});
chrome.contextMenus.onClicked.addListener(genericOnClick);
chrome.commands.onCommand.addListener(function (command) {
    console.log("onCommand", command);
    if (command === "execute-generic-on-click") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log(tabs);
            if (tabs[0] && tabs[0].id) {
                console.log(tabs[0].id);
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: function () {
                        var _a;
                        return (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString();
                    },
                }, function (results) {
                    if (results && results[0]) {
                        genericOnClick({
                            menuItemId: "WordReference",
                            selectionText: results[0].result,
                        });
                    }
                });
            }
        });
        return true;
    }
});
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "WordReference",
        title: "Word Reference",
        contexts: ["all"],
    });
});
function genericOnClick(info) {
    console.log('Standard context menu item clicked.', info);
    if (info.menuItemId != "WordReference" || !info.selectionText) {
        return;
    }
    var url = "https://www.wordreference.com/iten/".concat(info.selectionText);
    console.log('Opening from context menu -> ', url);
    chrome.windows.create({
        url: url,
        type: 'popup',
        width: 1200,
        height: 800
    });
}
function genericOnClickOld(info) {
    console.log('Standard context menu item clicked.', info);
    if (info.menuItemId != "WordReference" || !info.selectionText) {
        return;
    }
    var url = "https://www.wordreference.com/iten/".concat(info.selectionText);
    console.log('Opening from context menu -> ', url);
    chrome.tabs.create({
        url: url,
        active: false // Questo apre il tab in background
    });
}
