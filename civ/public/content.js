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
var EXT_ID = "CIV - 2024.10.31-1";
var WAIT = 2000;
var MOVE_AREA = "rg-civ-move";
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
    log("start");
    loadUI();
    document.addEventListener('keyup', doc_keyUp, false);
}
;
function loadUI() {
    log("loadUI");
    var targetNode = document.querySelector("div.menu-extras > ul");
    if (!targetNode || !targetNode.parentNode) {
        log("targetNode or parentNode not found", targetNode);
        return;
    }
    var moveArea = document.createElement("TEXTAREA");
    moveArea.id = MOVE_AREA;
    targetNode.parentNode.insertBefore(moveArea, targetNode.nextSibling);
    var downloadloadButton = document.createElement("INPUT");
    downloadloadButton.type = "button";
    downloadloadButton.id = "rg-civ-download";
    downloadloadButton.value = "Download All";
    downloadloadButton.addEventListener("click", downloadAll);
    //targetNode.parentNode.insertBefore(downloadloadButton, targetNode.nextSibling);
    var fetchButton = document.createElement("INPUT");
    fetchButton.type = "button";
    fetchButton.id = "rg-civ-fetch";
    fetchButton.value = "Fetch All";
    fetchButton.addEventListener("click", fetchAll);
    targetNode.parentNode.insertBefore(fetchButton, targetNode.nextSibling);
    // targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    var fetchConsiglioButton = document.createElement("INPUT");
    fetchConsiglioButton.type = "button";
    fetchConsiglioButton.id = "rg-civ-fetch-single";
    fetchConsiglioButton.value = "Fetch Consiglio";
    fetchConsiglioButton.addEventListener("click", fetchConsiglioSingolo);
    targetNode.parentNode.insertBefore(fetchConsiglioButton, targetNode.nextSibling);
    log("loadUI done");
}
function fetchAll() {
    return __awaiter(this, void 0, void 0, function () {
        var response, consigli, ultimo, quale, consiglio;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/CommissioniOnline/ODG/Ricerca', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        body: 'v=&IdOrgano=&NumeroDal=&NumeroAl=&DataConvocazione1Dal=&DataConvocazione1Al=&IdSedeConsiliare=&OggettoDelibera=&DataDelibera=&NumeroDelibera=&pageSize=50&FiltraPerAnnoEsercizio=true&page=1&SortNames=DescrizioneOrganoDeliberante&SortDirections=desc&SortNames=Numero&SortDirections=desc'
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    consigli = _a.sent();
                    ultimo = consigli.Data.Items.sort(function (a, b) { return b.Numero - a.Numero; })[0].Numero;
                    quale = prompt("Quale consiglio", ultimo);
                    if (quale == null) {
                        return [2 /*return*/];
                    }
                    log("Scelto ".concat(quale));
                    consiglio = consigli.Data.Items.filter(function (c) { return c.Numero == quale; });
                    return [4 /*yield*/, fetchConsiglio(consiglio[0])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchConsiglioSingolo() {
    return __awaiter(this, void 0, void 0, function () {
        var selected, element, date, response1, json1, consiglio;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    selected = document.querySelectorAll("tr.awe-row.awe-selected");
                    if (!selected || !(selected.length == 1)) {
                        log("Selected not found");
                        return [2 /*return*/];
                    }
                    element = selected[0];
                    date = (_a = element.children[2].textContent) === null || _a === void 0 ? void 0 : _a.substring(0, 10);
                    log("date", date);
                    return [4 /*yield*/, fetch('/CommissioniOnline/ODG/Ricerca', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            body: "v=&IdOrgano=&NumeroDal=&NumeroAl=&DataConvocazione1Dal=".concat(date, "&DataConvocazione1Al=").concat(date, "&IdSedeConsiliare=&OggettoDelibera=&DataDelibera=&NumeroDelibera=&pageSize=50&FiltraPerAnnoEsercizio=true&page=1&SortNames=DescrizioneOrganoDeliberante&SortDirections=desc&SortNames=Numero&SortDirections=desc")
                        })];
                case 1:
                    response1 = _b.sent();
                    return [4 /*yield*/, response1.json()];
                case 2:
                    json1 = _b.sent();
                    log("json1", json1);
                    if (json1.Data.Items.length != 1) {
                        log("Not found 1");
                        return [2 /*return*/];
                    }
                    consiglio = json1.Data.Items[0];
                    log("consiglio", consiglio);
                    return [4 /*yield*/, fetchConsiglio(consiglio)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchConsiglio(consiglio) {
    return __awaiter(this, void 0, void 0, function () {
        var response, json, odgs, _i, odgs_1, odg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log(consiglio);
                    return [4 /*yield*/, fetch('/CommissioniOnline/ODG/CercaPuntiODG', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            body: "v=&pageSize=50&Id=".concat(consiglio.Id, "&page=1&SortNames=DescrizioneSottotipo&SortDirections=desc&SortNames=Posizione&SortDirections=desc&SortNames=NumeroProposta&SortDirections=desc&SortNames=DataProposta&SortDirections=desc&SortNames=NumeroDelibera&SortDirections=desc&SortNames=DataDelibera&SortDirections=desc")
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _a.sent();
                    odgs = json.Data.Items.filter(function (o) { return o.Cancellato == false; });
                    _i = 0, odgs_1 = odgs;
                    _a.label = 3;
                case 3:
                    if (!(_i < odgs_1.length)) return [3 /*break*/, 7];
                    odg = odgs_1[_i];
                    return [4 /*yield*/, fetchOdg(odg, 'Documenti')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, fetchOdg(odg, 'Allegati')];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function fetchOdg(odg, tipo) {
    return __awaiter(this, void 0, void 0, function () {
        var response, json, docs, index, _i, docs_1, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log("ODG: ".concat(tipo, " - ").concat(odg.Posizione, " - ").concat(odg.Id, " - ").concat(odg.Oggetto));
                    return [4 /*yield*/, fetch("/CommissioniOnline/ODG/Cerca".concat(tipo, "Proposta"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            body: "v=&IdPunto=".concat(odg.IdPunto, "&pageSize=50&page=1")
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _a.sent();
                    docs = json.Data.Items;
                    index = 0;
                    _i = 0, docs_1 = docs;
                    _a.label = 3;
                case 3:
                    if (!(_i < docs_1.length)) return [3 /*break*/, 6];
                    doc = docs_1[_i];
                    index++;
                    return [4 /*yield*/, fetchFile(odg, tipo, doc, index)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function fetchFile(odg, tipo, doc, index) {
    return __awaiter(this, void 0, void 0, function () {
        var sub, nomefile, linkUrl, idField, queryString, allNomeFile;
        return __generator(this, function (_a) {
            sub = (tipo === 'Documenti' ? "" : "a.") + ("00" + index).slice(-2);
            nomefile = "".concat(odg.Posizione, ".").concat(sub, " - ").concat(odg.Oggetto.substring(0, 100), " - ").concat(doc.NomeFile);
            log("DOC: ".concat(doc.Id, " - ").concat(nomefile));
            linkUrl = tipo === 'Documenti' ?
                "/AttiAmministrativi/Common/DownloadDocumentoProdotto" :
                "/AttiAmministrativi/Common/DownloadAllegato";
            idField = tipo === 'Documenti' ? "IdDocumento" : "IdAllegato";
            queryString = "".concat(idField, "=") + doc.Id + '&IdAtto=' + doc.IdAtto + '&NomeFile=' + nomefile + '&MimeType=' + doc.Mime + '&st=' + doc.St;
            window.open(linkUrl + '?' + queryString);
            if (tipo == 'Allegati') {
                allNomeFile = nomefile.replace("/", "_");
                logMove("move \"".concat(doc.NomeFile, "\" \"").concat(allNomeFile, "\""));
            }
            return [2 /*return*/];
        });
    });
}
function doc_keyUp(e) {
    // log(e)
    if (e.ctrlKey && e.altKey && e.key === 'A') {
        downloadAll();
    }
}
function downloadAll() {
    return __awaiter(this, void 0, void 0, function () {
        var cerca, odgTable, odg, puntiODG, table, puntiODGRows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log("downloadAll()");
                    cerca = document.querySelector('button[aria-label="Cerca"');
                    if (!cerca) {
                        log("cerca not found");
                        return [2 /*return*/];
                    }
                    log(cerca);
                    cerca.click();
                    return [4 /*yield*/, sleep(WAIT)];
                case 1:
                    _a.sent();
                    odgTable = document.querySelectorAll("#GridOdg > div.awe-mcontent > div.awe-content.awe-tablc > div > table")[0];
                    log(odgTable);
                    odg = Array.from(odgTable.rows).find(function (r) { return r.cells[1].textContent === '6'; });
                    if (!odg) {
                        log("odg not found");
                        return [2 /*return*/];
                    }
                    odg.click();
                    return [4 /*yield*/, sleep(WAIT)];
                case 2:
                    _a.sent();
                    puntiODG = document.querySelector("a[href='#tab-puntiodg'");
                    if (!puntiODG) {
                        log("puntiODG not found");
                        return [2 /*return*/];
                    }
                    puntiODG.click();
                    return [4 /*yield*/, sleep(WAIT)];
                case 3:
                    _a.sent();
                    table = document.querySelector("#GridPuntiODG > div.awe-mcontent > div.awe-content.awe-tablc > div > table > tbody");
                    if (!table) {
                        log("table not found");
                        return [2 /*return*/];
                    }
                    puntiODGRows = Array.from(table.rows);
                    return [4 /*yield*/, clickNextPunto(puntiODGRows)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sleep(millis) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (r) { return setTimeout(r, millis); })];
        });
    });
}
function clickNextPunto(puntiODGRows) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, puntiODGRows_1, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log("clickNextPunto");
                    log(puntiODGRows);
                    if (puntiODGRows == undefined || puntiODGRows.length === 0) {
                        return [2 /*return*/];
                    }
                    _i = 0, puntiODGRows_1 = puntiODGRows;
                    _a.label = 1;
                case 1:
                    if (!(_i < puntiODGRows_1.length)) return [3 /*break*/, 6];
                    row = puntiODGRows_1[_i];
                    row.click();
                    return [4 /*yield*/, sleep(1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, downloadPunto('Allegati')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, downloadPunto('Documenti')];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function downloadPunto(tipo) {
    return __awaiter(this, void 0, void 0, function () {
        var documenti, rows, _i, _a, row, download, chiudi;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log("downloadPunto: " + tipo);
                    documenti = document.querySelectorAll("a[aria-label='" + tipo + "']")[0];
                    log(documenti);
                    if (!documenti) {
                        log("documenti not found");
                        return [2 /*return*/];
                    }
                    documenti.click();
                    return [4 /*yield*/, sleep(WAIT)];
                case 1:
                    _c.sent();
                    rows = (_b = document.querySelector("#GridDocumentiProposta > div.awe-mcontent > div.awe-content.awe-tablc > div > table > tbody")) === null || _b === void 0 ? void 0 : _b.rows;
                    log(rows);
                    if (!rows) return [3 /*break*/, 6];
                    _i = 0, _a = Array.from(rows);
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    row = _a[_i];
                    log("row click");
                    row.click();
                    return [4 /*yield*/, sleep(WAIT)];
                case 3:
                    _c.sent();
                    log("download click");
                    download = document.querySelector("#downloadBtn");
                    if (!download) {
                        log("download not found");
                        return [2 /*return*/];
                    }
                    download.click();
                    return [4 /*yield*/, sleep(WAIT)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    log("chiudi wait");
                    return [4 /*yield*/, sleep(WAIT)];
                case 7:
                    _c.sent();
                    chiudi = document.querySelectorAll("a[aria-label='Chiudi']")[0];
                    log(chiudi);
                    if (!chiudi) {
                        log("chiudi not found");
                        return [2 /*return*/];
                    }
                    chiudi.click();
                    return [4 /*yield*/, sleep(WAIT)];
                case 8:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function logMove(msg) {
    var moveArea = document.querySelector("#" + MOVE_AREA);
    moveArea.value += msg + "\n";
}
