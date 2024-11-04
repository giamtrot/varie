"use strict";
var extId = "TEST - 2024.11.04-1";
log("before start", document.readyState);
if (document.readyState != 'complete') {
    document.onload = document.onreadystatechange = start;
}
else {
    start();
}
log("after start");
//=====================================================================
function start() {
    log("start");
    openTab("about:blank");
    // const win = window.open("about:blank", "_blank") as Window
    // const doc = win.document
    // const target = doc.createElement("div")
    // doc.body.insertBefore(target, doc.body.childNodes[0]);
    // target.innerHTML = "<h1>TEST</h1>";
}
