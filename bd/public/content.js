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
    // var sorter = document.querySelector("#customselect__list-0 > li:nth-child(7)") as HTMLElement
    // log(sorter)
    // if (sorter)
    // 	sorter.click();
    // sorter = document.querySelector("#customselect__list-0 > li:nth-child(7)") as HTMLElement
    // document.querySelector("#customselect__list-0 > li:nth-child(7)")
    // if (sorter)
    // 	sorter.click();
    if (!document.location.href.endsWith("pricePerUnit%3Aasc") &&
        !document.location.href.endsWith("pricePerUnit:asc") &&
        document.location.pathname.startsWith("/Categories")) {
        document.location.href = document.location.origin + document.location.pathname + "?sort=pricePerUnit:asc";
        log("Sort done");
    }
    else {
        log("Already sorted");
    }
}
