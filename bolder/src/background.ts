chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bolder-dialog",
        title: "Bolder...",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "bolder-dialog" && tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "open_dialog", selectionText: info.selectionText });
    }
});
