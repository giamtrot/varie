"use strict";
var EXT_ID = "BD - 2024.10.31-1";
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
    log("Starting Sort");
    var sorter = document.querySelector("#customselect__list-0 > li:nth-child(7)");
    log(sorter);
    if (sorter)
        sorter.click();
    sorter = document.querySelector("#customselect__list-0 > li:nth-child(7)");
    document.querySelector("#customselect__list-0 > li:nth-child(7)");
    if (sorter)
        sorter.click();
    log("Sort done");
}
