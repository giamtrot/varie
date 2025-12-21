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
    var _a;
    log("Starting Sort");
    // Load sort menu
    var sortArea = Array.from(document.querySelectorAll("span")).findLast(function (it) { return it.textContent === "Ordina per"; });
    log("Found sort area:", sortArea);
    var sortButton = (_a = sortArea === null || sortArea === void 0 ? void 0 : sortArea.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector("div[role='button']");
    log("Found sort button:", sortButton);
    sortButton === null || sortButton === void 0 ? void 0 : sortButton.click();
    var sortItem = undefined;
    var loopCount = 0;
    var clicker = function () {
        if (sortItem) {
            sortItem === null || sortItem === void 0 ? void 0 : sortItem.click();
            log("Sort done");
            return;
        }
        if (loopCount > 10) {
            log("Sort item not found, giving up");
            return;
        }
        sortItem = Array.from(document.querySelectorAll(".v-list-item__title")).findLast(function (it) { return it.textContent === "Prezzo al kg crescente"; });
        log("Found sort item:", sortItem);
        loopCount++;
        setTimeout(clicker, 500);
    };
    setTimeout(clicker, 500);
}
