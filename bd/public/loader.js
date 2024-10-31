"use strict";
document.onreadystatechange = document.onload = function () {
    console.log("loader.js");
    if ((!this.readyState || this.readyState == 'complete')) {
        loadScripts(['utils.js', 'content.js'], "MAIN");
        window.addEventListener("message", forwardOpenTab);
    }
    ;
};
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
