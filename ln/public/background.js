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
var ARRAY_NAME = "rg-linkedin-map";
var GET_STORAGE_API = "GET_STORAGE_API";
var SAVE_STORAGE_API = "SAVE_STORAGE_API";
// This script is used both as background script (service worker) and as content script
// The handlers for the APIs are registered only in the service worker
if (chrome.runtime) {
    chrome.runtime.onMessage.addListener(loadScriptsHandler);
    chrome.runtime.onMessage.addListener(getStorageHandler);
    chrome.runtime.onMessage.addListener(saveStorageHandler);
    // 	if (message.action === "openTab") {
    // 		console.log("openTab", message)
    // 		chrome.tabs.create({
    // 			url: message.data.url,
    // 			active: false  // Questo apre il tab in background
    // 		});
    // 		sendResponse("done: " + message.action);
}
var StorageMap = /** @class */ (function () {
    function StorageMap(fieldName) {
        this.fieldName = fieldName;
        this.value = {};
    }
    return StorageMap;
}());
function saveStorageHandler(message, sender, sendResponse) {
    // console.log("saveStorageHandler", message, sender)
    var _a;
    if (message.action !== SAVE_STORAGE_API) {
        return;
    }
    console.log(SAVE_STORAGE_API, message);
    var map = message.data;
    chrome.storage.local.set((_a = {}, _a[map.fieldName] = map.value, _a), function () {
        console.log(message.action, "done");
        sendResponse("done: " + message.action);
    });
    return true; // Se usi setTimeout, fetch, chrome.storage, o qualsiasi cosa asincrona, devi restituire true
}
function getStorageHandler(message, sender, sendResponse) {
    // console.log("getStorageHandler", message, sender)
    if (message.action !== GET_STORAGE_API) {
        return;
    }
    console.log(GET_STORAGE_API, message);
    var map = new StorageMap(message.data.fieldName);
    chrome.storage.local.get([map.fieldName], function (result) {
        console.log(message.action, "result", result);
        map.value = (result && result[map.fieldName]) || {};
        console.log(message.action, "map", map);
        sendResponse(map);
    });
    return true; // Se usi setTimeout, fetch, chrome.storage, o qualsiasi cosa asincrona, devi restituire true
}
function loadScriptsHandler(message, sender, sendResponse) {
    var _a;
    console.log("loadScriptsHandler", message, sender);
    if (message.action !== "loadScripts" || ((_a = sender === null || sender === void 0 ? void 0 : sender.tab) === null || _a === void 0 ? void 0 : _a.id) == undefined)
        return;
    console.log("loadScripts", message.files, sender.tab.id);
    chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: message.files,
        world: message.world
    });
    sendResponse("done: " + message.action);
}
function getStorage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            log("getStorage");
            return [2 /*return*/, callAPI(GET_STORAGE_API, { fieldName: ARRAY_NAME })];
        });
    });
}
function saveStorage(value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            log("saveStorage", value);
            return [2 /*return*/, callAPI(SAVE_STORAGE_API, value)];
        });
    });
}
/*
 This script is used both as background script (service worker) and as content script
 Call a Chrome API and return a Promise that resolves with the response data.
 The API is expected to send a message back with the action name suffixed with "Response".
 The API is invoked with a window.postMessage call as the content script cannot invoke some chrome API directly
 due to the different execution World.
 So the process is:
 - content script call an API from background script wich can use window.postMessage
 - background script listens for the message and invokes window.postMessage to send the request to the
     loader script which is the registered content script
 - loader script listens for the message and invokes the API
 - loader script sends the response back to the background script with another window.postMessage
 - background script listens for the response and resolves the Promise with the response data

 * @param api The API to call.
 * @param data The data to send with the API call.
*/
function callAPI(api, data) {
    return __awaiter(this, void 0, void 0, function () {
        var returnMessage;
        return __generator(this, function (_a) {
            returnMessage = api + "Response";
            return [2 /*return*/, new Promise(function (resolve) {
                    function handler(event) {
                        if (event.source !== window || event.data.action !== returnMessage)
                            return;
                        window.removeEventListener("message", handler);
                        console.log(returnMessage, event);
                        resolve(event.data.data);
                    }
                    window.addEventListener("message", handler);
                    log("callAPI", api, data);
                    window.postMessage({ action: api, data: data }, "*");
                })];
        });
    });
}
