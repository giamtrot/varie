"use strict";
var extId = "LN - 2024.10.14-1";
var mapName = "rg-linkedin-map";
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
    console.clear();
    log("start");
    enrichJobPost();
}
function list(li) {
    var _a, _b, _c;
    var id = li.dataset.occludableJobId;
    if (!id) {
        throw new Error("occludableJobId not found");
    }
    var title = (_a = li.querySelector(".job-card-list__title")) === null || _a === void 0 ? void 0 : _a.ariaLabel;
    var company = (_c = (_b = li.querySelector(".job-card-container__primary-description")) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.trim();
    log(id, title, company);
}
function enrichJobPost() {
    waitForList(function (li) { enrich(li); });
}
function waitForList(callback) {
    var baseSelector = "div.scaffold-layout__list > div > ul";
    var baseObserver = new MutationObserver(function () {
        var targetNode = document.querySelector(baseSelector);
        if (targetNode) {
            baseObserver.disconnect();
            addUI();
        }
    });
    baseObserver.observe(document, {
        childList: true,
        subtree: true
    });
    var targetSelector = "li.ember-view.jobs-search-results__list-item.occludable-update.p0.relative.scaffold-layout__list-item:not([data-rg-enriched=true])";
    var observer = new MutationObserver(function () {
        var targetNodes = document.querySelectorAll(targetSelector);
        Array.from(targetNodes).forEach(function (li) { callback(li); });
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
}
function enrich(li) {
    var _a, _b, _c;
    var button = li.querySelector("button");
    if (!button) {
        return;
    }
    var id = li.dataset.occludableJobId;
    if (!id) {
        throw new Error("occludableJobId not found");
    }
    var link = li.querySelector("a.job-card-list__title");
    var title = link === null || link === void 0 ? void 0 : link.ariaLabel;
    var url = link === null || link === void 0 ? void 0 : link.href;
    var company = (_b = (_a = li.querySelector(".job-card-container__primary-description")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
    li.setAttribute("data-rg-enriched", 'true');
    log(id, title, company, url);
    hideBySelector(li, "div.job-card-list__insight");
    hideBySelector(li, "ul.job-card-list__footer-wrapper");
    var newButton = document.createElement("button");
    newButton.id = "rg-button-X-" + id;
    newButton.textContent = "->";
    newButton.addEventListener("click", function () {
        log("opening", url);
        openTab(url);
    });
    (_c = button.parentNode) === null || _c === void 0 ? void 0 : _c.insertBefore(newButton, button);
}
function hideBySelector(li, selector) {
    var insight = li.querySelector(selector);
    if (insight) {
        insight.remove();
    }
}
function addUI() {
    // openTab("https://www.example.com")
    var element = document.querySelector("div.jobs-search-results-list");
    if (element === null || element.parentNode === null) {
        return;
        // throw new Error("element.parentNode is null")
    }
    var removeAllButton = document.createElement("INPUT");
    removeAllButton.type = "button";
    removeAllButton.id = "rg-ln-removeAll";
    removeAllButton.value = "Rimuovi Tutti";
    removeAllButton.addEventListener("click", rimuoviTutti);
    element.parentNode.insertBefore(removeAllButton, element);
    element.parentNode.insertBefore(document.createTextNode(" "), element);
    log("addUI done");
}
function rimuoviTutti() {
    var targetSelector = "li.ember-view.jobs-search-results__list-item.occludable-update.p0.relative.scaffold-layout__list-item";
    var targetNodes = document.querySelectorAll(targetSelector);
    // log("rimuoviTutti", targetNodes)
    Array.from(targetNodes).forEach(function (li) {
        var button = li.querySelector("button.job-card-container__action");
        if (!button) {
            return;
        }
        // log("rimuoviTutti", button)
        button.click();
    });
}
