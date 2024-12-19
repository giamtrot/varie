"use strict";
var EXT_ID = "WR - 2024.12.19-1";
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
    // console.clear()
    log("start");
}
