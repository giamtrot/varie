"use strict";
var EXT_ID = "TOSANO - 2024.10.31-1";
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
    var sortItem = Array.from(document.querySelectorAll(".v-list-item__title")).findLast(function (it) { return it.textContent === "Prezzo al kg crescente"; });
    log("Found sort item:", sortItem);
    sortItem === null || sortItem === void 0 ? void 0 : sortItem.click();
    log("Sort done");
}
