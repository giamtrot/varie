"use strict";
document.onreadystatechange = document.onload = function () {
    console.log("loader");
    if ((!this.readyState || this.readyState == 'complete')) {
        loadScripts(['utils.js', 'content.js'], "MAIN");
        window.addEventListener("message", forwardOpenTab);
        window.addEventListener("message", forwardCreateTabFromHtml);
    }
    ;
};
function forwardOpenTab(event) {
    if (event.source !== window || !event.data.action || event.data.action !== "openTab")
        return;
    console.log("loader forwardOpenTab", event);
    // forward to background script
    chrome.runtime.sendMessage(event.data, function (response) {
        console.log("loader forwardOpenTab response", response);
    });
}
function forwardCreateTabFromHtml(event) {
    if (event.source !== window || !event.data.action || event.data.action !== "createTabFromHtml")
        return;
    console.log("loader forwardCreateTabFromHtml", event);
    // forward to background script
    chrome.runtime.sendMessage(event.data, function (response) {
        console.log("loader forwardCreateTabFromHtml response", response);
    });
}
function loadScripts(files, world) {
    chrome.runtime.sendMessage({ action: "loadScripts", files: files, world: world }, function (response) {
        console.log("loader loadScripts response", response);
    });
}
