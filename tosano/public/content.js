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
    setInterval(function () {
        checkSort();
    }, 1000);
}
function checkSort() {
    var _a, _b, _c;
    log("Checking Sort");
    // Load sort menu
    var sortArea = Array.from(document.querySelectorAll("span")).findLast(function (it) { return it.textContent === "Ordina per"; });
    log("Found sort area:", sortArea);
    if (!sortArea)
        return;
    var sortInput = (_b = (_a = sortArea === null || sortArea === void 0 ? void 0 : sortArea.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector("input[type='text']")) === null || _b === void 0 ? void 0 : _b.previousSibling;
    log("Found sort input:", sortInput);
    if ((sortInput === null || sortInput === void 0 ? void 0 : sortInput.textContent) === "Prezzo al kg crescente") {
        log("Already sorted");
        return;
    }
    var sortButton = (_c = sortArea === null || sortArea === void 0 ? void 0 : sortArea.parentNode) === null || _c === void 0 ? void 0 : _c.querySelector("div[role='button']");
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
