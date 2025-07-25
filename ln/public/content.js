"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var EXT_ID = "LN - 2025.07.17-1";
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // console.clear()
            log("start");
            // log("getStorage")
            // const map1: StorageMap = await getStorage()
            // log("map - init: ", map1.fieldName, map1.value)
            // map1.value[EXT_ID] = Date.now()
            // log("map - middle: ", map1)
            // await saveStorage(map1)
            // const map2 = await getStorage()
            // log("map - after: ", map2)
            enrichJobPost();
            log("start completed");
            return [2 /*return*/];
        });
    });
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
    return __awaiter(this, void 0, void 0, function () {
        var button, id, _a, url, title, company, newButton, oldJob, _b, button_1, role;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    button = li.querySelector("button");
                    if (!button) {
                        // log("button not found", li)
                        return [2 /*return*/];
                    }
                    id = li.dataset.occludableJobId;
                    if (!id) {
                        throw new Error("occludableJobId not found");
                    }
                    _a = getJobInfo(li), url = _a.url, title = _a.title, company = _a.company;
                    log(url, title, company);
                    li.setAttribute("data-rg-enriched", 'true');
                    newButton = document.createElement("button");
                    newButton.id = "rg-button-X-" + id;
                    newButton.textContent = "->";
                    newButton.addEventListener("click", function () {
                        log("opening", url);
                        openTab(url);
                    });
                    log(button.parentNode);
                    (_c = button.parentNode) === null || _c === void 0 ? void 0 : _c.insertBefore(newButton, button);
                    return [4 /*yield*/, oldJOb(title, company)];
                case 1:
                    oldJob = _d.sent();
                    if (oldJob) {
                        log("Found already seen job");
                        _b = getJobButton(li), button_1 = _b.button, role = _b.role;
                        if (!button_1) {
                            return [2 /*return*/];
                        }
                        button_1.click();
                        emptyLi(li);
                    }
                    return [2 /*return*/];
            }
        });
    });
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
    return __awaiter(this, void 0, void 0, function () {
        var targetNodes, nodesArray, i, li, _a, button, role;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    targetNodes = document.querySelectorAll(CARDS);
                    nodesArray = Array.from(targetNodes);
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < nodesArray.length)) return [3 /*break*/, 4];
                    li = nodesArray[i];
                    _a = getJobButton(li), button = _a.button, role = _a.role;
                    if (!button) {
                        return [3 /*break*/, 3];
                    }
                    if (role === "undo-small") {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, audit(li)];
                case 2:
                    _b.sent();
                    log("rimuoviTutti", li);
                    button.click();
                    _b.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    // )
                    log("rimuoviTutti done");
                    window.location.reload();
                    return [2 /*return*/];
            }
        });
    });
}
function getJobButton(li) {
    var _a;
    var button = li.querySelector("button.job-card-container__action");
    var role = (_a = button === null || button === void 0 ? void 0 : button.querySelector("svg")) === null || _a === void 0 ? void 0 : _a.getAttribute('data-test-icon');
    return { button: button, role: role };
}
function audit(li) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, url, title, company;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getJobInfo(li), url = _a.url, title = _a.title, company = _a.company;
                    return [4 /*yield*/, auditValue(getRow(title, company))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function auditValue(row) {
    return __awaiter(this, void 0, void 0, function () {
        var map, oneWeekAgo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMap()];
                case 1:
                    map = _a.sent();
                    map.value[row] = Date.now();
                    oneWeekAgo = Date.now() - 1 * 7 * 24 * 60 * 60 * 1000;
                    map.value = Object.fromEntries(Object.entries(map.value).filter(function (_a) {
                        var key = _a[0], timestamp = _a[1];
                        return typeof timestamp === 'number' && timestamp >= oneWeekAgo;
                    }));
                    return [4 /*yield*/, saveStorage(map)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getMap() {
    return __awaiter(this, void 0, void 0, function () {
        var map;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getStorage()];
                case 1:
                    map = _a.sent();
                    return [2 /*return*/, map];
            }
        });
    });
}
function oldJOb(title, company) {
    return __awaiter(this, void 0, void 0, function () {
        var row, map, oldJob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    row = getRow(title, company);
                    return [4 /*yield*/, getMap()];
                case 1:
                    map = _a.sent();
                    oldJob = row in map.value;
                    return [2 /*return*/, oldJob];
            }
        });
    });
}
function emptyLi(li) {
    var _a, _b, _c;
    log("emptyLi", li);
    (_a = li.querySelector("div.job-card-list__logo")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = li.querySelector("div.artdeco-entity-lockup__subtitle")) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = li.querySelector("div.artdeco-entity-lockup__caption")) === null || _c === void 0 ? void 0 : _c.remove();
}
