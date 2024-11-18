"use strict";
var EXT_ID = "LN - 2024.10.14-1";
var MAP_NAME = "rg-linkedin-map";
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
    var _a;
    var button = li.querySelector("button");
    if (!button) {
        return;
    }
    var id = li.dataset.occludableJobId;
    if (!id) {
        throw new Error("occludableJobId not found");
    }
    var _b = getJobInfo(li), url = _b.url, title = _b.title, company = _b.company;
    li.setAttribute("data-rg-enriched", 'true');
    hideBySelector(li, "div.job-card-list__insight");
    hideBySelector(li, "ul.job-card-list__footer-wrapper");
    var newButton = document.createElement("button");
    newButton.id = "rg-button-X-" + id;
    newButton.textContent = "->";
    newButton.addEventListener("click", function () {
        log("opening", url);
        openTab(url);
    });
    (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newButton, button);
    var oldJob = oldJOb(title, company);
    if (oldJob) {
        log("Found already seen job");
        var _c = getJobButton(li), button_1 = _c.button, role = _c.role;
        if (!button_1) {
            return;
        }
        button_1.click();
    }
}
function getJobInfo(li) {
    var _a, _b;
    var link = li.querySelector("a.job-card-list__title");
    var url = link === null || link === void 0 ? void 0 : link.href;
    var title = (link === null || link === void 0 ? void 0 : link.ariaLabel) || "";
    var company = ((_b = (_a = li.querySelector(".job-card-container__primary-description")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
    return { url: url, title: title, company: company };
}
function getRow(title, company) {
    return "".concat(title, ";").concat(company);
}
function hideBySelector(li, selector) {
    var insight = li.querySelector(selector);
    if (insight) {
        insight.remove();
    }
}
function addUI() {
    var element = document.querySelector("div.jobs-search-results-list");
    if (element === null || element.parentNode === null) {
        log("element.parentNode is null");
        return;
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
        var _a = getJobButton(li), button = _a.button, role = _a.role;
        if (!button) {
            return;
        }
        if (role === "undo-small") {
            return;
        }
        audit(li);
        // log("rimuoviTutti", button)
        button.click();
    });
    log("rimuoviTutti done");
    window.location.reload();
}
function getJobButton(li) {
    var _a;
    var button = li.querySelector("button.job-card-container__action");
    var role = (_a = button === null || button === void 0 ? void 0 : button.querySelector("svg")) === null || _a === void 0 ? void 0 : _a.getAttribute('data-test-icon');
    return { button: button, role: role };
}
function audit(li) {
    var _a = getJobInfo(li), url = _a.url, title = _a.title, company = _a.company;
    auditValue(getRow(title, company));
}
function auditValue(row) {
    var map = getMap();
    map[row] = Date.now();
    setLocalStorage(MAP_NAME, map);
}
function getMap() {
    initLocalStorage(MAP_NAME, {});
    var map = getLocalStorage(MAP_NAME);
    return map;
}
function oldJOb(title, company) {
    var row = getRow(title, company);
    var map = getMap();
    var oldJob = row in map;
    return oldJob;
}
