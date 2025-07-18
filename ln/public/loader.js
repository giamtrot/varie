"use strict";
document.onreadystatechange = document.onload = function () {
    console.log("loader.js");
    if ((!this.readyState || this.readyState == 'complete')) {
        initAPI("GET_STORAGE_API");
        initAPI("SAVE_STORAGE_API");
        loadScripts(['background.js', 'utils.js', 'content.js'], "MAIN");
        window.addEventListener("message", forwardOpenTab);
    }
    ;
};
function initAPI(api) {
    console.log("loader - initAPI", api);
    var returnMessage = api + "Response";
    window.addEventListener("message", function (event) {
        if (event.source !== window || !event.data.action || event.data.action !== api)
            return;
        console.log("loader", api, event);
        chrome.runtime.sendMessage(event.data, function (response) {
            console.log("loader", returnMessage, response);
            // Send the response back to the page context
            window.postMessage({ action: returnMessage, data: response }, "*");
        });
    });
}
function forwardOpenTab(event) {
    if (event.source !== window || !event.data.action || event.data.action !== "openTab")
        return;
    console.log("loader.js", event);
    // forward to background script
    chrome.runtime.sendMessage(event.data, function (response) {
        console.log(response);
    });
}
function loadScripts(files, world) {
    chrome.runtime.sendMessage({ action: "loadScripts", files: files, world: world }, function (response) {
        console.log(response);
    });
}
