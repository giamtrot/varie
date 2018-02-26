console.log("chrome.runtime.onMessageExternal.addListener");
chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        console.log("received", request, sender, sendResponse);
        chrome.tabs.create({ url: request.url, windowId: sender.tab.windowId, active: false });
        sendResponse({ done: true });
    });    