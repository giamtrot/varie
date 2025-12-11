chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bolder-root",
        title: "Bolder",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "bolder-root" && tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "open_dialog" });
    }
});
