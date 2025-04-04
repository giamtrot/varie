"use strict";
var EXT_ID = "LN - 2024.10.14-1";
var MAP_NAME = "rg-linkedin-map";
var CARDS = "li.ember-view.scaffold-layout__list-item";
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
    var targetSelector = CARDS + ":not([data-rg-enriched=true])";
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
        log("button not found", li);
        return;
    }
    var id = li.dataset.occludableJobId;
    if (!id) {
        throw new Error("occludableJobId not found");
    }
    var _b = getJobInfo(li), url = _b.url, title = _b.title, company = _b.company;
    log(url, title, company);
    li.setAttribute("data-rg-enriched", 'true');
    // hideBySelector(li, "div.job-card-list__insight")
    // hideBySelector(li, "ul.job-card-list__footer-wrapper")
    var newButton = document.createElement("button");
    newButton.id = "rg-button-X-" + id;
    newButton.textContent = "->";
    newButton.addEventListener("click", function () {
        log("opening", url);
        openTab(url);
    });
    log(button.parentNode);
    (_a = button.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newButton, button);
    var oldJob = oldJOb(title, company);
    if (oldJob) {
        log("Found already seen job");
        var _c = getJobButton(li), button_1 = _c.button, role = _c.role;
        if (!button_1) {
            return;
        }
        button_1.click();
        emptyLi(li);
    }
}
function getJobInfo(li) {
    var _a, _b;
    var link = li.querySelector("a.job-card-container__link");
    var url = link === null || link === void 0 ? void 0 : link.href;
    var title = (link === null || link === void 0 ? void 0 : link.ariaLabel) || "";
    var company = ((_b = (_a = li.querySelector(".artdeco-entity-lockup__subtitle")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
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
    var parent = document.querySelector("div.scaffold-layout__list");
    if (parent === null) {
        log("parent node is null");
        return;
    }
    var element = document.querySelector("header.scaffold-layout__list-header");
    if (element === null) {
        log("element node is null");
        return;
    }
    var removeAllButton = document.createElement("INPUT");
    removeAllButton.type = "button";
    removeAllButton.id = "rg-ln-removeAll";
    removeAllButton.value = "Rimuovi Tutti";
    removeAllButton.addEventListener("click", rimuoviTutti);
    parent.insertBefore(removeAllButton, element);
    parent.insertBefore(document.createTextNode(" "), element);
    log("addUI done");
}
function rimuoviTutti() {
    // const targetSelector = "li.ember-view.jobs-search-results__list-item.occludable-update.p0.relative.scaffold-layout__list-item"
    var targetNodes = document.querySelectorAll(CARDS);
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
    // const oneWeekAgo = Date.now() - 1 * 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    // const newMap = Object.fromEntries(Object.entries(map).filter(([key, timestamp]) => typeof timestamp === 'number' && timestamp >= oneWeekAgo))
    var newMap = map;
    setLocalStorage(MAP_NAME, newMap);
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
function emptyLi(li) {
    var _a, _b, _c;
    log("emptyLi", li);
    (_a = li.querySelector("div.job-card-list__logo")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = li.querySelector("div.artdeco-entity-lockup__subtitle")) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = li.querySelector("div.artdeco-entity-lockup__caption")) === null || _c === void 0 ? void 0 : _c.remove();
}
