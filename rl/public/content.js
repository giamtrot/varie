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
var EXT_ID_RL = "RL - 2025.01.28-1";
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
    // document.addEventListener('keyup', doc_keyUp, false);
}
;
function loadUI() {
    log("loadUI");
    var baseObserver = new MutationObserver(function () {
        var targetNode = Array.from(document.querySelectorAll('span'))
            .find(function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === 'Visualizza ricetta'; });
        if (targetNode && targetNode.parentElement) {
            baseObserver.disconnect();
            log("targetNode found", targetNode);
            addRLUI(targetNode.parentElement);
        }
        else {
            log("targetNode not found");
        }
    });
    baseObserver.observe(document, {
        childList: true,
        subtree: true
    });
    log("loadUI done");
}
function addRLUI(targetNode) {
    var _a, _b;
    log("addRLUI");
    var moveArea = document.createElement("TEXTAREA");
    moveArea.id = "rg-rl-search-results";
    (_a = targetNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(moveArea, targetNode.nextSibling);
    var button = document.createElement("INPUT");
    button.type = "button";
    button.id = "rg-rl-search";
    button.value = "Search All";
    button.addEventListener("click", searchAll);
    (_b = targetNode.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(button, targetNode.nextSibling);
    log("button added");
}
function searchAll() {
    return __awaiter(this, void 0, void 0, function () {
        var select, options, _i, _a, option;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log("searchAll");
                    select = document.querySelector("select#provincia");
                    options = select === null || select === void 0 ? void 0 : select.options;
                    _i = 0, _a = Array.from(options);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    option = _a[_i];
                    console.log(option);
                    return [4 /*yield*/, fetchProvincia(option.value, option.label)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchProvincia(desc, codice) {
    return __awaiter(this, void 0, void 0, function () {
        var codiceProvincia, codiceComune, jsonBusinessArg0, encodedJsonBusinessArg0, body, ris, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    codiceProvincia = codice.substring(0, 3);
                    codiceComune = codice.substring(4);
                    log("fetchProvincia", desc, codice, codiceProvincia, codiceComune);
                    jsonBusinessArg0 = {
                        "codiceFiscale": "GMMRFL72M08Z305F",
                        "zona": {
                            "descrizione": desc,
                            "codiceProvincia": codiceProvincia,
                            "codiceComune": codiceComune,
                            "codice": codice,
                            "abilitazionePiuPiu": "S",
                            "abilitazioneNre": "N"
                        },
                        "ricetta": {
                            "iup": "00KOX6BTXC",
                            "iurp": null,
                            "cittadino": {
                                "codiceFiscale": "GMMRFL72M08Z305F"
                            },
                            "emessaIl": "20250124",
                            "scadenzaIl": null,
                            "tipo": "02",
                            "modulo": {
                                "id": "0300A4361329860",
                                "tipo": "09"
                            },
                            "flagRe": "E",
                            "priorita": "D",
                            "urgenza": "N",
                            "tipoPrestazione": null,
                            "stato": {
                                "codice": "03",
                                "descrizione": "PRENOTATA",
                                "data": null
                            },
                            "quesitoDiagnostico": {
                                "codice": null,
                                "descrizione": "SOSPETTO: MORBO PARKINSON PRIMARIO"
                            },
                            "note": null,
                            "esenzione": {
                                "codice": null,
                                "descrizione": null
                            },
                            "flagEsenzionePatologia": null,
                            "flagAltreEsenzioni": null,
                            "flagSuggerita": "S",
                            "brancaSpecialistica": null,
                            "prescrittore": {
                                "codiceFiscale": "MLTRFL71M67H264O",
                                "codiceRegionale": "47401",
                                "nome": "RAFFAELLA",
                                "cognome": "MOLTENI"
                            },
                            "nrPrestazioni": "1",
                            "prestazioni": [
                                {
                                    "id": null,
                                    "codice": "0192119",
                                    "descrizione": "TOMOSCINTIGRAFIA [SPET] CEREBRALE CON TRACCIANTI RECETTORIALI",
                                    "altreDescrizioni": null,
                                    "altreDescrizioniVis": null,
                                    "tipo": null,
                                    "stato": {
                                        "codice": "03",
                                        "descrizione": "PRENOTATA",
                                        "data": "20250125"
                                    },
                                    "nota": "(DATSCAN)",
                                    "flagCiclica": "N",
                                    "flagPrenotabile": "S",
                                    "flagPrenotabileCittadino": "S",
                                    "quantitaPrescritta": "1",
                                    "flagExAsl": "N",
                                    "flagEsameLaboratorio": "N",
                                    "flagAmbulatoriale": "N",
                                    "flagVaccinoAntinfluenzale": "N",
                                    "flagRadiologia": "S",
                                    "flagTamponeRapido": "N",
                                    "flagTamponeCovid": "N",
                                    "codiceNomenclatoreNazionale": null,
                                    "codiceNomenclatoreRegionale": null,
                                    "codCatalogoPrescr": null
                                }
                            ],
                            "prestazioniPrenotate": [
                                {
                                    "id": null,
                                    "codice": "0192119",
                                    "descrizione": "TOMOSCINTIGRAFIA [SPET] CEREBRALE CON TRACCIANTI RECETTORIALI",
                                    "altreDescrizioni": null,
                                    "altreDescrizioniVis": null,
                                    "tipo": null,
                                    "stato": {
                                        "codice": "03",
                                        "descrizione": "PRENOTATA",
                                        "data": "20250125"
                                    },
                                    "nota": "(DATSCAN)",
                                    "flagCiclica": "N",
                                    "flagPrenotabile": "S",
                                    "flagPrenotabileCittadino": "S",
                                    "quantitaPrescritta": "1",
                                    "flagExAsl": "N",
                                    "flagEsameLaboratorio": "N",
                                    "flagAmbulatoriale": "N",
                                    "flagVaccinoAntinfluenzale": "N",
                                    "flagRadiologia": "S",
                                    "flagTamponeRapido": "N",
                                    "flagTamponeCovid": "N",
                                    "codiceNomenclatoreNazionale": null,
                                    "codiceNomenclatoreRegionale": null,
                                    "codCatalogoPrescr": null
                                }
                            ],
                            "datiRispostaMEF": null,
                            "appuntamenti": {
                                "singoli": [
                                    {
                                        "uuid": "6bd67018-2dc5-4b5d-a517-0f312f747fa8",
                                        "idAppuntamento": "1634787919",
                                        "iup": "00KOX6BTXC",
                                        "iurp": null,
                                        "modulo": "0300A4361329860",
                                        "associazione": null,
                                        "ipCup": "20250030329001",
                                        "data": "20250527083000",
                                        "cittadino": {
                                            "codiceFiscale": "GMMRFL72M08Z305F",
                                            "codiceSanitario": "164YH373",
                                            "nome": "RAFFAELE",
                                            "cognome": "GIAMMARIO",
                                            "sesso": "M",
                                            "nascita": "19720808000000",
                                            "localita": "999410",
                                            "residenza": "015176",
                                            "indirizzo": "V. RONCHETTI, 17",
                                            "tel": "3667044374",
                                            "sms": "3667044374",
                                            "email": "RAFFAELE.GIAMMARIO@GMAIL.COM"
                                        },
                                        "prenotatoIl": "20250125111638",
                                        "registratoIl": "20250125111640",
                                        "modificatoIl": null,
                                        "annullatoIl": null,
                                        "noteAnnullamento": null,
                                        "stato": "0",
                                        "tipo": "0",
                                        "prestazione": {
                                            "codice": "0192119",
                                            "descrizione": "TOMOSCINTIGRAFIA [SPET] CEREBRALE CON TRACCIANTI RECETTORIALI",
                                            "codiceDistretto": null,
                                            "codiceMetodica": null,
                                            "flagExAsl": "N",
                                            "flagEsameLaboratorio": "N",
                                            "flagAmbulatoriale": "N",
                                            "flagVaccinoAntinfluenzale": "N",
                                            "flagTamponeRapido": "N",
                                            "flagTamponeCovid": "N",
                                            "codiceNomenclatoreNazionale": null,
                                            "codiceNomenclatoreRegionale": null,
                                            "codCatalogoPrescr": null
                                        },
                                        "azienda": {
                                            "id": null,
                                            "codice": "030706",
                                            "descrizione": "ASST RHODENSE",
                                            "area": null,
                                            "email": null,
                                            "sito": null,
                                            "flag": {
                                                "prioritaB": null,
                                                "differita": null,
                                                "unitaPrenotante": null,
                                                "differitaVisibile": null,
                                                "abilitataPagamento": null
                                            },
                                            "infoPrenotazione": {
                                                "telefono": null,
                                                "orari": []
                                            }
                                        },
                                        "unitaErogante": {
                                            "codice": "15480201S",
                                            "descrizione": null,
                                            "telefono": null,
                                            "puntoIndirizzo": {
                                                "localita": {
                                                    "codice": null,
                                                    "descrizione": null,
                                                    "cap": null,
                                                    "siglaProvincia": null
                                                },
                                                "indirizzo": {
                                                    "toponimo": null,
                                                    "descrizione": null,
                                                    "civico": null,
                                                    "frazione": null,
                                                    "coordinate": {}
                                                }
                                            },
                                            "unitaPrenotante": {
                                                "codice": "61",
                                                "descrizione": null,
                                                "azienda": {
                                                    "id": null,
                                                    "codice": "030706",
                                                    "descrizione": "ASST RHODENSE",
                                                    "area": null,
                                                    "email": null,
                                                    "sito": null,
                                                    "flag": {
                                                        "prioritaB": null,
                                                        "differita": null,
                                                        "unitaPrenotante": null,
                                                        "differitaVisibile": null,
                                                        "abilitataPagamento": null
                                                    },
                                                    "infoPrenotazione": {
                                                        "telefono": null,
                                                        "orari": []
                                                    }
                                                },
                                                "flag": {
                                                    "inibizioneNre": null
                                                }
                                            },
                                            "presidio": {
                                                "id": "885",
                                                "codice": "002403",
                                                "descrizione": "POLIAMB.OSPEDALE BOLLATE",
                                                "descrizioneEstesa": "POLIAMB.OSPEDALE BOLLATE",
                                                "email": null,
                                                "puntoIndirizzo": {
                                                    "localita": {
                                                        "codice": "015027",
                                                        "descrizione": "BOLLATE",
                                                        "cap": "20021",
                                                        "siglaProvincia": "MI"
                                                    },
                                                    "indirizzo": {
                                                        "toponimo": null,
                                                        "descrizione": "VIA PIAVE 20",
                                                        "civico": null,
                                                        "frazione": null,
                                                        "coordinate": {}
                                                    }
                                                },
                                                "azienda": {
                                                    "id": null,
                                                    "codice": "030706",
                                                    "descrizione": "ASST RHODENSE",
                                                    "area": "PIU_PIU",
                                                    "email": null,
                                                    "sito": null,
                                                    "flag": {
                                                        "prioritaB": null,
                                                        "differita": null,
                                                        "unitaPrenotante": null,
                                                        "differitaVisibile": null,
                                                        "abilitataPagamento": "S"
                                                    },
                                                    "infoPrenotazione": {
                                                        "telefono": null,
                                                        "orari": []
                                                    }
                                                },
                                                "telefono": "02994301",
                                                "orariApertura": null,
                                                "periodoChiusura": null,
                                                "distanza": null
                                            }
                                        },
                                        "unitaErogatrice": null,
                                        "agenda": {
                                            "codice": "15823",
                                            "descrizione": "MED.NUCL:SCINT. CEREBRALE BOLLATE CLASSE DI PRIORITA' D",
                                            "note": null,
                                            "noteAggiuntive": null
                                        },
                                        "infoNote": {
                                            "testo": null,
                                            "link": null
                                        },
                                        "infoNotePreparazione": {
                                            "testo": null,
                                            "link": null
                                        },
                                        "infoLuogoPresentazione": {
                                            "testo": "C/O MEDICINA NUCLEARE",
                                            "link": null
                                        },
                                        "infoMemorandum": {
                                            "testo": null,
                                            "link": null
                                        },
                                        "infoNoteDisdettaPrenotazione": {
                                            "testo": "Le modalita' di disdetta di un appuntamento possono essere le seguenti:\n- mail al seguente indirizzo di posta elettronica: annullamentoprenotazioni@asst-rhodense.it\n- fax al numero 02 99430.5518\n- personalmente presso i CUP aziendali nelle sedi e orari visionabili al seguente link: http://www.asst-rhodense.it/inew/ASST/cittadino/orari-sportelli.html",
                                            "link": null
                                        },
                                        "infoConsensoInformato": {
                                            "testo": null,
                                            "link": null
                                        },
                                        "infoMezzi": {
                                            "testo": null,
                                            "link": null
                                        },
                                        "cicli": [],
                                        "quesitoDiagnostico": {
                                            "codice": null,
                                            "descrizione": "SOSPETTO: MORBO PARKINSON PRIMARIO"
                                        },
                                        "regimeErogazione": "1",
                                        "differita": null,
                                        "ricetta": {
                                            "iup": "00KOX6BTXC",
                                            "iurp": null,
                                            "cittadino": null,
                                            "emessaIl": null,
                                            "scadenzaIl": null,
                                            "tipo": null,
                                            "modulo": {
                                                "id": "0300A4361329860",
                                                "tipo": null
                                            },
                                            "flagRe": null,
                                            "priorita": null,
                                            "urgenza": null,
                                            "tipoPrestazione": null,
                                            "stato": null,
                                            "quesitoDiagnostico": null,
                                            "note": null,
                                            "esenzione": null,
                                            "flagEsenzionePatologia": null,
                                            "flagAltreEsenzioni": null,
                                            "flagSuggerita": null,
                                            "brancaSpecialistica": null,
                                            "prescrittore": null,
                                            "nrPrestazioni": null,
                                            "prestazioni": [],
                                            "prestazioniPrenotate": [],
                                            "datiRispostaMEF": null,
                                            "appuntamenti": null,
                                            "appuntamentiUnificati": [],
                                            "daSbloccare": false
                                        }
                                    }
                                ],
                                "combinati": [],
                                "associati": [],
                                "rpDifferite": []
                            },
                            "appuntamentiUnificati": null,
                            "daSbloccare": false
                        },
                        "tipoPrestazione": "O",
                        "presidi": [],
                        "recapiti": {
                            "telefono": "3667044374",
                            "cellulare": null,
                            "email": "raffaele.giammario@gmail.com"
                        },
                        "vincoliTemporali": {
                            "dal": "20250128000000",
                            "al": null,
                            "lunedi": "S",
                            "martedi": "S",
                            "mercoledi": "S",
                            "giovedi": "S",
                            "venerdi": "S",
                            "sabato": "S",
                            "domenica": "S",
                            "mattina": "S",
                            "pomeriggio": "S"
                        },
                        "caricaRequestRicercaAgende": "S",
                        "minDal": null,
                        "ats": null,
                        "tipoNegoziazione": null
                    };
                    encodedJsonBusinessArg0 = encodeURIComponent(JSON.stringify(jsonBusinessArg0));
                    body = "metadata={\"destination\":\"pgpcitt_ricerca_disponibilita\",\"method\":\"handle\",\"argumentTypes\":[\"java.lang.String\"]}&&jsonBusinessArg0=" + encodedJsonBusinessArg0;
                    log("body", body);
                    return [4 /*yield*/, fetch("https://www.fascicolosanitario.regione.lombardia.it/prenotaonline/jsonBroker", {
                            // "headers": {
                            //   "accept": "application/json, text/plain, */*",
                            //   "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,fr;q=0.6",
                            //   "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                            //   "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                            //   "sec-ch-ua-mobile": "?0",
                            //   "sec-ch-ua-platform": "\"Windows\"",
                            //   "sec-fetch-dest": "empty",
                            //   "sec-fetch-mode": "cors",
                            //   "sec-fetch-site": "same-origin",
                            //   "sec-gpc": "1",
                            //   "x-prenota-online-channel": "WEB",
                            //   "x-prenota-online-info": "04.19.19.05|windows|windows-10|chrome 131.0.0.0",
                            //   "x-prenota-online-token": "cb2418ec-1be2-439e-a43d-b60428d2f5a6 | GMMRFL72M08Z305F | 0000000000000000"
                            // },
                            "referrer": "https://www.fascicolosanitario.regione.lombardia.it/prenotaonline/riservata",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": "metadata={\"destination\":\"pgpcitt_ricerca_disponibilita\",\"method\":\"handle\",\"argumentTypes\":[\"java.lang.String\"]}&&jsonBusinessArg0=%7B%22codiceFiscale%22%3A%22GMMRFL72M08Z305F%22%2C%22zona%22%3A%7B%22descrizione%22%3A%22MILANO%20PROVINCIA%22%2C%22codiceProvincia%22%3A%22015%22%2C%22codiceComune%22%3A%22%25%22%2C%22codice%22%3A%22015%25%22%2C%22abilitazionePiuPiu%22%3A%22S%22%2C%22abilitazioneNre%22%3A%22N%22%7D%2C%22ricetta%22%3A%7B%22iup%22%3A%2200KOX6BTXC%22%2C%22iurp%22%3Anull%2C%22cittadino%22%3A%7B%22codiceFiscale%22%3A%22GMMRFL72M08Z305F%22%7D%2C%22emessaIl%22%3A%2220250124%22%2C%22scadenzaIl%22%3Anull%2C%22tipo%22%3A%2202%22%2C%22modulo%22%3A%7B%22id%22%3A%220300A4361329860%22%2C%22tipo%22%3A%2209%22%7D%2C%22flagRe%22%3A%22E%22%2C%22priorita%22%3A%22D%22%2C%22urgenza%22%3A%22N%22%2C%22tipoPrestazione%22%3Anull%2C%22stato%22%3A%7B%22codice%22%3A%2203%22%2C%22descrizione%22%3A%22PRENOTATA%22%2C%22data%22%3Anull%7D%2C%22quesitoDiagnostico%22%3A%7B%22codice%22%3Anull%2C%22descrizione%22%3A%22SOSPETTO%3A%20MORBO%20PARKINSON%20PRIMARIO%22%7D%2C%22note%22%3Anull%2C%22esenzione%22%3A%7B%22codice%22%3Anull%2C%22descrizione%22%3Anull%7D%2C%22flagEsenzionePatologia%22%3Anull%2C%22flagAltreEsenzioni%22%3Anull%2C%22flagSuggerita%22%3A%22S%22%2C%22brancaSpecialistica%22%3Anull%2C%22prescrittore%22%3A%7B%22codiceFiscale%22%3A%22MLTRFL71M67H264O%22%2C%22codiceRegionale%22%3A%2247401%22%2C%22nome%22%3A%22RAFFAELLA%22%2C%22cognome%22%3A%22MOLTENI%22%7D%2C%22nrPrestazioni%22%3A%221%22%2C%22prestazioni%22%3A%5B%7B%22id%22%3Anull%2C%22codice%22%3A%220192119%22%2C%22descrizione%22%3A%22TOMOSCINTIGRAFIA%20%5BSPET%5D%20CEREBRALE%20CON%20TRACCIANTI%20RECETTORIALI%22%2C%22altreDescrizioni%22%3Anull%2C%22altreDescrizioniVis%22%3Anull%2C%22tipo%22%3Anull%2C%22stato%22%3A%7B%22codice%22%3A%2203%22%2C%22descrizione%22%3A%22PRENOTATA%22%2C%22data%22%3A%2220250125%22%7D%2C%22nota%22%3A%22(DATSCAN)%22%2C%22flagCiclica%22%3A%22N%22%2C%22flagPrenotabile%22%3A%22S%22%2C%22flagPrenotabileCittadino%22%3A%22S%22%2C%22quantitaPrescritta%22%3A%221%22%2C%22flagExAsl%22%3A%22N%22%2C%22flagEsameLaboratorio%22%3A%22N%22%2C%22flagAmbulatoriale%22%3A%22N%22%2C%22flagVaccinoAntinfluenzale%22%3A%22N%22%2C%22flagRadiologia%22%3A%22S%22%2C%22flagTamponeRapido%22%3A%22N%22%2C%22flagTamponeCovid%22%3A%22N%22%2C%22codiceNomenclatoreNazionale%22%3Anull%2C%22codiceNomenclatoreRegionale%22%3Anull%2C%22codCatalogoPrescr%22%3Anull%7D%5D%2C%22prestazioniPrenotate%22%3A%5B%7B%22id%22%3Anull%2C%22codice%22%3A%220192119%22%2C%22descrizione%22%3A%22TOMOSCINTIGRAFIA%20%5BSPET%5D%20CEREBRALE%20CON%20TRACCIANTI%20RECETTORIALI%22%2C%22altreDescrizioni%22%3Anull%2C%22altreDescrizioniVis%22%3Anull%2C%22tipo%22%3Anull%2C%22stato%22%3A%7B%22codice%22%3A%2203%22%2C%22descrizione%22%3A%22PRENOTATA%22%2C%22data%22%3A%2220250125%22%7D%2C%22nota%22%3A%22(DATSCAN)%22%2C%22flagCiclica%22%3A%22N%22%2C%22flagPrenotabile%22%3A%22S%22%2C%22flagPrenotabileCittadino%22%3A%22S%22%2C%22quantitaPrescritta%22%3A%221%22%2C%22flagExAsl%22%3A%22N%22%2C%22flagEsameLaboratorio%22%3A%22N%22%2C%22flagAmbulatoriale%22%3A%22N%22%2C%22flagVaccinoAntinfluenzale%22%3A%22N%22%2C%22flagRadiologia%22%3A%22S%22%2C%22flagTamponeRapido%22%3A%22N%22%2C%22flagTamponeCovid%22%3A%22N%22%2C%22codiceNomenclatoreNazionale%22%3Anull%2C%22codiceNomenclatoreRegionale%22%3Anull%2C%22codCatalogoPrescr%22%3Anull%7D%5D%2C%22datiRispostaMEF%22%3Anull%2C%22appuntamenti%22%3A%7B%22singoli%22%3A%5B%7B%22uuid%22%3A%226bd67018-2dc5-4b5d-a517-0f312f747fa8%22%2C%22idAppuntamento%22%3A%221634787919%22%2C%22iup%22%3A%2200KOX6BTXC%22%2C%22iurp%22%3Anull%2C%22modulo%22%3A%220300A4361329860%22%2C%22associazione%22%3Anull%2C%22ipCup%22%3A%2220250030329001%22%2C%22data%22%3A%2220250527083000%22%2C%22cittadino%22%3A%7B%22codiceFiscale%22%3A%22GMMRFL72M08Z305F%22%2C%22codiceSanitario%22%3A%22164YH373%22%2C%22nome%22%3A%22RAFFAELE%22%2C%22cognome%22%3A%22GIAMMARIO%22%2C%22sesso%22%3A%22M%22%2C%22nascita%22%3A%2219720808000000%22%2C%22localita%22%3A%22999410%22%2C%22residenza%22%3A%22015176%22%2C%22indirizzo%22%3A%22V.%20RONCHETTI%2C%2017%22%2C%22tel%22%3A%223667044374%22%2C%22sms%22%3A%223667044374%22%2C%22email%22%3A%22RAFFAELE.GIAMMARIO%40GMAIL.COM%22%7D%2C%22prenotatoIl%22%3A%2220250125111638%22%2C%22registratoIl%22%3A%2220250125111640%22%2C%22modificatoIl%22%3Anull%2C%22annullatoIl%22%3Anull%2C%22noteAnnullamento%22%3Anull%2C%22stato%22%3A%220%22%2C%22tipo%22%3A%220%22%2C%22prestazione%22%3A%7B%22codice%22%3A%220192119%22%2C%22descrizione%22%3A%22TOMOSCINTIGRAFIA%20%5BSPET%5D%20CEREBRALE%20CON%20TRACCIANTI%20RECETTORIALI%22%2C%22codiceDistretto%22%3Anull%2C%22codiceMetodica%22%3Anull%2C%22flagExAsl%22%3A%22N%22%2C%22flagEsameLaboratorio%22%3A%22N%22%2C%22flagAmbulatoriale%22%3A%22N%22%2C%22flagVaccinoAntinfluenzale%22%3A%22N%22%2C%22flagTamponeRapido%22%3A%22N%22%2C%22flagTamponeCovid%22%3A%22N%22%2C%22codiceNomenclatoreNazionale%22%3Anull%2C%22codiceNomenclatoreRegionale%22%3Anull%2C%22codCatalogoPrescr%22%3Anull%7D%2C%22azienda%22%3A%7B%22id%22%3Anull%2C%22codice%22%3A%22030706%22%2C%22descrizione%22%3A%22ASST%20RHODENSE%22%2C%22area%22%3Anull%2C%22email%22%3Anull%2C%22sito%22%3Anull%2C%22flag%22%3A%7B%22prioritaB%22%3Anull%2C%22differita%22%3Anull%2C%22unitaPrenotante%22%3Anull%2C%22differitaVisibile%22%3Anull%2C%22abilitataPagamento%22%3Anull%7D%2C%22infoPrenotazione%22%3A%7B%22telefono%22%3Anull%2C%22orari%22%3A%5B%5D%7D%7D%2C%22unitaErogante%22%3A%7B%22codice%22%3A%2215480201S%22%2C%22descrizione%22%3Anull%2C%22telefono%22%3Anull%2C%22puntoIndirizzo%22%3A%7B%22localita%22%3A%7B%22codice%22%3Anull%2C%22descrizione%22%3Anull%2C%22cap%22%3Anull%2C%22siglaProvincia%22%3Anull%7D%2C%22indirizzo%22%3A%7B%22toponimo%22%3Anull%2C%22descrizione%22%3Anull%2C%22civico%22%3Anull%2C%22frazione%22%3Anull%2C%22coordinate%22%3A%7B%7D%7D%7D%2C%22unitaPrenotante%22%3A%7B%22codice%22%3A%2261%22%2C%22descrizione%22%3Anull%2C%22azienda%22%3A%7B%22id%22%3Anull%2C%22codice%22%3A%22030706%22%2C%22descrizione%22%3A%22ASST%20RHODENSE%22%2C%22area%22%3Anull%2C%22email%22%3Anull%2C%22sito%22%3Anull%2C%22flag%22%3A%7B%22prioritaB%22%3Anull%2C%22differita%22%3Anull%2C%22unitaPrenotante%22%3Anull%2C%22differitaVisibile%22%3Anull%2C%22abilitataPagamento%22%3Anull%7D%2C%22infoPrenotazione%22%3A%7B%22telefono%22%3Anull%2C%22orari%22%3A%5B%5D%7D%7D%2C%22flag%22%3A%7B%22inibizioneNre%22%3Anull%7D%7D%2C%22presidio%22%3A%7B%22id%22%3A%22885%22%2C%22codice%22%3A%22002403%22%2C%22descrizione%22%3A%22POLIAMB.OSPEDALE%20BOLLATE%22%2C%22descrizioneEstesa%22%3A%22POLIAMB.OSPEDALE%20BOLLATE%22%2C%22email%22%3Anull%2C%22puntoIndirizzo%22%3A%7B%22localita%22%3A%7B%22codice%22%3A%22015027%22%2C%22descrizione%22%3A%22BOLLATE%22%2C%22cap%22%3A%2220021%22%2C%22siglaProvincia%22%3A%22MI%22%7D%2C%22indirizzo%22%3A%7B%22toponimo%22%3Anull%2C%22descrizione%22%3A%22VIA%20PIAVE%2020%22%2C%22civico%22%3Anull%2C%22frazione%22%3Anull%2C%22coordinate%22%3A%7B%7D%7D%7D%2C%22azienda%22%3A%7B%22id%22%3Anull%2C%22codice%22%3A%22030706%22%2C%22descrizione%22%3A%22ASST%20RHODENSE%22%2C%22area%22%3A%22PIU_PIU%22%2C%22email%22%3Anull%2C%22sito%22%3Anull%2C%22flag%22%3A%7B%22prioritaB%22%3Anull%2C%22differita%22%3Anull%2C%22unitaPrenotante%22%3Anull%2C%22differitaVisibile%22%3Anull%2C%22abilitataPagamento%22%3A%22S%22%7D%2C%22infoPrenotazione%22%3A%7B%22telefono%22%3Anull%2C%22orari%22%3A%5B%5D%7D%7D%2C%22telefono%22%3A%2202994301%22%2C%22orariApertura%22%3Anull%2C%22periodoChiusura%22%3Anull%2C%22distanza%22%3Anull%7D%7D%2C%22unitaErogatrice%22%3Anull%2C%22agenda%22%3A%7B%22codice%22%3A%2215823%22%2C%22descrizione%22%3A%22MED.NUCL%3ASCINT.%20CEREBRALE%20BOLLATE%20CLASSE%20DI%20PRIORITA'%20D%22%2C%22note%22%3Anull%2C%22noteAggiuntive%22%3Anull%7D%2C%22infoNote%22%3A%7B%22testo%22%3Anull%2C%22link%22%3Anull%7D%2C%22infoNotePreparazione%22%3A%7B%22testo%22%3Anull%2C%22link%22%3Anull%7D%2C%22infoLuogoPresentazione%22%3A%7B%22testo%22%3A%22C%2FO%20MEDICINA%20NUCLEARE%22%2C%22link%22%3Anull%7D%2C%22infoMemorandum%22%3A%7B%22testo%22%3Anull%2C%22link%22%3Anull%7D%2C%22infoNoteDisdettaPrenotazione%22%3A%7B%22testo%22%3A%22Le%20modalita'%20di%20disdetta%20di%20un%20appuntamento%20possono%20essere%20le%20seguenti%3A%5Cn-%20mail%20al%20seguente%20indirizzo%20di%20posta%20elettronica%3A%20annullamentoprenotazioni%40asst-rhodense.it%5Cn-%20fax%20al%20numero%2002%2099430.5518%5Cn-%20personalmente%20presso%20i%20CUP%20aziendali%20nelle%20sedi%20e%20orari%20visionabili%20al%20seguente%20link%3A%20http%3A%2F%2Fwww.asst-rhodense.it%2Finew%2FASST%2Fcittadino%2Forari-sportelli.html%22%2C%22link%22%3Anull%7D%2C%22infoConsensoInformato%22%3A%7B%22testo%22%3Anull%2C%22link%22%3Anull%7D%2C%22infoMezzi%22%3A%7B%22testo%22%3Anull%2C%22link%22%3Anull%7D%2C%22cicli%22%3A%5B%5D%2C%22quesitoDiagnostico%22%3A%7B%22codice%22%3Anull%2C%22descrizione%22%3A%22SOSPETTO%3A%20MORBO%20PARKINSON%20PRIMARIO%22%7D%2C%22regimeErogazione%22%3A%221%22%2C%22differita%22%3Anull%2C%22ricetta%22%3A%7B%22iup%22%3A%2200KOX6BTXC%22%2C%22iurp%22%3Anull%2C%22cittadino%22%3Anull%2C%22emessaIl%22%3Anull%2C%22scadenzaIl%22%3Anull%2C%22tipo%22%3Anull%2C%22modulo%22%3A%7B%22id%22%3A%220300A4361329860%22%2C%22tipo%22%3Anull%7D%2C%22flagRe%22%3Anull%2C%22priorita%22%3Anull%2C%22urgenza%22%3Anull%2C%22tipoPrestazione%22%3Anull%2C%22stato%22%3Anull%2C%22quesitoDiagnostico%22%3Anull%2C%22note%22%3Anull%2C%22esenzione%22%3Anull%2C%22flagEsenzionePatologia%22%3Anull%2C%22flagAltreEsenzioni%22%3Anull%2C%22flagSuggerita%22%3Anull%2C%22brancaSpecialistica%22%3Anull%2C%22prescrittore%22%3Anull%2C%22nrPrestazioni%22%3Anull%2C%22prestazioni%22%3A%5B%5D%2C%22prestazioniPrenotate%22%3A%5B%5D%2C%22datiRispostaMEF%22%3Anull%2C%22appuntamenti%22%3Anull%2C%22appuntamentiUnificati%22%3A%5B%5D%2C%22daSbloccare%22%3Afalse%7D%7D%5D%2C%22combinati%22%3A%5B%5D%2C%22associati%22%3A%5B%5D%2C%22rpDifferite%22%3A%5B%5D%7D%2C%22appuntamentiUnificati%22%3Anull%2C%22daSbloccare%22%3Afalse%7D%2C%22tipoPrestazione%22%3A%22O%22%2C%22presidi%22%3A%5B%5D%2C%22recapiti%22%3A%7B%22telefono%22%3A%223667044374%22%2C%22cellulare%22%3Anull%2C%22email%22%3A%22raffaele.giammario%40gmail.com%22%7D%2C%22vincoliTemporali%22%3A%7B%22dal%22%3A%2220250128000000%22%2C%22al%22%3Anull%2C%22lunedi%22%3A%22S%22%2C%22martedi%22%3A%22S%22%2C%22mercoledi%22%3A%22S%22%2C%22giovedi%22%3A%22S%22%2C%22venerdi%22%3A%22S%22%2C%22sabato%22%3A%22S%22%2C%22domenica%22%3A%22S%22%2C%22mattina%22%3A%22S%22%2C%22pomeriggio%22%3A%22S%22%7D%2C%22caricaRequestRicercaAgende%22%3A%22S%22%2C%22minDal%22%3Anull%2C%22ats%22%3Anull%2C%22tipoNegoziazione%22%3Anull%7D",
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        })];
                case 1:
                    ris = _a.sent();
                    return [4 /*yield*/, ris.text()];
                case 2:
                    text = _a.sent();
                    log("fetchProvincia", text);
                    return [2 /*return*/];
            }
        });
    });
}
