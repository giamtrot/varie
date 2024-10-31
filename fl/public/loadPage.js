"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPage = loadPage;
var utils_1 = require("./utils");
var Mustache = __importStar(require("mustache"));
var FOR_PAGE = 12;
var LIMIT_TO = -1;
// const LIMIT_TO = 4
var sleep = function (ms) { return new Promise(function (r) { return setTimeout(r, ms); }); };
function loadPage() {
    return __awaiter(this, void 0, void 0, function () {
        var tables, cells, buttons, urls, uniqueUrls, pages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, utils_1.log)("loadPage");
                    tables = {};
                    cells = {};
                    buttons = document.querySelectorAll("a.count-overlay-button");
                    // log(buttons)
                    Array.from(buttons).forEach(function (b) {
                        b.click();
                    });
                    return [4 /*yield*/, sleep(5000)];
                case 1:
                    _a.sent();
                    urls = document.querySelectorAll("div.photo > a.photo-link");
                    uniqueUrls = Array.from(new Set(Array.from(urls).map(function (a) { return a.href; })));
                    pages = slice(uniqueUrls.slice(0, LIMIT_TO), FOR_PAGE);
                    pages.forEach(function (urlsForPage) { return loadFinalPage(urlsForPage); });
                    return [2 /*return*/];
            }
        });
    });
}
function loadFinalPage(urls) {
    return __awaiter(this, void 0, void 0, function () {
        var images, _i, _a, url, _b, _c, win, doc, style, target;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    images = [];
                    _i = 0, _a = Array.from(urls);
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    url = _a[_i];
                    _c = (_b = images).push;
                    return [4 /*yield*/, getImageInfo(url)];
                case 2:
                    _c.apply(_b, [_d.sent()]);
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    win = window.open("about:blank", "_blank");
                    doc = win.document;
                    style = doc.createElement('style');
                    style.innerHTML = getNewStyle();
                    doc.head.appendChild(style);
                    target = doc.createElement("div");
                    doc.body.insertBefore(target, doc.body.childNodes[0]);
                    render(target, images);
                    return [2 /*return*/];
            }
        });
    });
}
function fill(template, target, images) {
    var rendered = Mustache.render(template, { images: images });
    // log(rendered)
    target.innerHTML = rendered;
}
function slice(array, chunkSize) {
    var ris = [];
    for (var i = 0; i < array.length; i += chunkSize) {
        var chunk = array.slice(i, i + chunkSize);
        ris.push(chunk);
    }
    return ris;
}
function getImageInfo(url) {
    return __awaiter(this, void 0, void 0, function () {
        var ris, html, parser, doc, photostream, photostreamName, photostreamURL, videos, isVideo, img, desc, description, descriptionFull, csrf, api_key, photo_id, detailAPI, detailRis, detailJson, album, albums, albumUrlTemplate_1, albumLIst, image;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    ris = _g.sent();
                    return [4 /*yield*/, ris.text()
                        // log(html)
                    ];
                case 2:
                    html = _g.sent();
                    parser = new DOMParser();
                    doc = parser.parseFromString(html, "text/html");
                    photostream = doc.querySelector("div.attribution-info > a");
                    if (photostream == null) {
                        (0, utils_1.log)("not found stream");
                    }
                    photostreamName = photostream.textContent;
                    photostreamURL = photostream.href;
                    videos = doc.querySelectorAll("div.main-photo");
                    isVideo = videos.length > 0;
                    if (isVideo) {
                        window.open(url, "_blank");
                        return [2 /*return*/, {}];
                    }
                    img = isVideo ? "" : doc.querySelectorAll("img.main-photo")[0].src;
                    desc = (_b = (_a = doc.querySelectorAll("div.title-desc-block.showFull")[0].innerText) === null || _a === void 0 ? void 0 : _a.replace("Done\n\n\t", "")) === null || _b === void 0 ? void 0 : _b.trim();
                    description = desc;
                    descriptionFull = "";
                    if ((desc === null || desc === void 0 ? void 0 : desc.length) > 200) {
                        description = desc.substring(0, 196) + " ...";
                        descriptionFull = desc;
                    }
                    csrf = (_c = window.auth) === null || _c === void 0 ? void 0 : _c.csrf;
                    api_key = (_f = (_e = (_d = window.YUI_config) === null || _d === void 0 ? void 0 : _d.flickr) === null || _e === void 0 ? void 0 : _e.api) === null || _f === void 0 ? void 0 : _f.site_key;
                    photo_id = url.split('/')[5];
                    detailAPI = "https://api.flickr.com/services/rest?photo_id=".concat(photo_id, "&csrf=").concat(csrf, "&api_key=").concat(api_key, "&method=flickr.photos.getAllContexts&format=json&hermes=1&nojsoncallback=1");
                    (0, utils_1.log)("detailAPI", photo_id, detailAPI);
                    return [4 /*yield*/, fetch(detailAPI, {
                            credentials: 'include'
                        })];
                case 3:
                    detailRis = _g.sent();
                    return [4 /*yield*/, detailRis.json()];
                case 4:
                    detailJson = _g.sent();
                    (0, utils_1.log)(photo_id, JSON.stringify(detailJson));
                    album = "";
                    if (detailJson.set) {
                        (0, utils_1.log)(detailJson.set);
                        albums = detailJson.set.map(function (s) {
                            return { id: s.id, title: s.title, owner: s.owner.nsid };
                        });
                        albumUrlTemplate_1 = "https://www.flickr.com/photos/$owner/albums/$id";
                        albums.forEach(function (a) { return a.url = albumUrlTemplate_1.replace("$owner", a.owner).replace("$id", a.id); });
                        albumLIst = albums.map(function (a) { return "<a href=\"".concat(a.url, "\">").concat(a.title, "</a>"); });
                        (0, utils_1.log)("album", albumLIst, albumLIst.join("<br />"));
                        album = albumLIst.join("<br />");
                    }
                    image = {
                        url: url,
                        img: img,
                        description: description,
                        descriptionFull: descriptionFull,
                        album: album,
                        photostream: {
                            name: photostreamName,
                            url: photostreamURL
                        }
                    };
                    return [2 /*return*/, image
                        // log("getImageInfo - end", url)
                    ];
            }
        });
    });
}
function render(target, images) {
    (0, utils_1.log)("render", images);
    var template = "\n<div class=\"parent-container-rg\">\n    {{#images}}\n    <div title=\"{{descriptionFull}}\" class=\"child-container-rg\">\n\t\t<div class=\"photostream-rg\"><a href=\"{{photostream.url}}\">{{photostream.name}}</a></div>\n\t\t<div class=\"description-rg\">{{{description}}}</div>\n\t\t<div class=\"album-rg\">{{{album}}}</div>\n\t\t<a target=\"_blank\" href=\"{{url}}\">\n\t\t\t<img class=\"image-rg\" src=\"{{img}}\" />\n\t\t</a>\n    </div>\n    {{/images}}\n</div>\n\t";
    fill(template, target, images);
}
function getNewStyle() {
    return "\n.parent-container-rg {\n    padding: 20px;\n}\n\na {\n    color: #FFFFFF;\n    font-weight: bold;\n}\n\n.image-rg {\n    height: 300px; \n}\n\n.child-container-rg {\n    float: left;\n    border: 1px solid #DDDDDD;\n    height: 300px; \n    position: relative;\n    /* width: 50%; */\n}\n\n.photostream-rg {\n    float: left;\n    position: absolute;\n    left: 0px;\n    top: 0px;\n    z-index: 1000;\n    background-color: rgba(146, 173, 64, 0.4);\n    padding: 5px;\n    color: #FFFFFF;\n    font-weight: bold;\n}\n\n.description-rg {\n    /* float: left; */\n    position: absolute;\n    left: 0px;\n    bottom: 0px;\n    z-index: 1000;\n    background-color: rgba(146, 173, 64, 0.4);\n    padding: 5px;\n    color: #FFFFFF;\n    font-weight: bold;\n}\n\n.album-rg {\n    float: right;\n    position: absolute;\n    right: 0px;\n    top: 0px;\n    z-index: 1000;\n    background-color: rgba(146, 173, 64, 0.4);\n    padding: 5px;\n    color: #FFFFFF;\n    font-weight: bold;\n}\n";
}
