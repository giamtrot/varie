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
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("onMessage", message, sender, sendResponse);
    handleMessage(message, sender, sendResponse);
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
});
function handleMessage(message, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function () {
        var window_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    if (!(message.action === "loadScripts")) return [3 /*break*/, 2];
                    return [4 /*yield*/, loadScriptsHandler(message, sender, sendResponse)];
                case 1:
                    _a.sent();
                    sendResponse({ success: true, message: "done " + message.action });
                    return [3 /*break*/, 7];
                case 2:
                    if (!(message.action === "createTabFromHtml")) return [3 /*break*/, 4];
                    return [4 /*yield*/, createTabFromHtmlHandler(message.data.title, message.data.html)];
                case 3:
                    window_1 = _a.sent();
                    sendResponse({ success: true, message: "done " + message.action });
                    return [3 /*break*/, 7];
                case 4:
                    if (!(message.action === "openTab")) return [3 /*break*/, 6];
                    return [4 /*yield*/, openTabHandler(message)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    sendResponse({ success: false, message: "error: handler not found for " + message.action });
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    sendResponse({ success: false, data: error_1 });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function createTabFromHtmlHandler(title, html) {
    return __awaiter(this, void 0, void 0, function () {
        var tab;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.tabs.create({
                        url: 'https://www.example.com/',
                        active: false
                    })];
                case 1:
                    tab = _a.sent();
                    if (!tab.id) {
                        console.error('Tab ID is undefined');
                        return [2 /*return*/];
                    }
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: function (title, html) {
                            document.title = title;
                            document.body.innerHTML = html;
                        },
                        args: [title, html]
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function loadScriptsHandler(message, sender, sendResponse) {
    if (!sender.tab || sender.tab.id == undefined) {
        sendResponse("error: loadScripts failed because sender.tab is not found");
        console.log(sender);
        return;
    }
    console.log("loadScripts", message.files, sender.tab.id);
    chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: message.files,
        world: message.world
    });
    sendResponse("done: " + message.action);
}
function openTabHandler(message) {
    return __awaiter(this, void 0, void 0, function () {
        var tab;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("openTab", message);
                    return [4 /*yield*/, chrome.tabs.create({
                            url: message.data.url,
                            active: false
                        })];
                case 1:
                    tab = _a.sent();
                    return [2 /*return*/, tab];
            }
        });
    });
}
