"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXT_ID = void 0;
var loadPage_1 = require("./loadPage");
var utils_1 = require("./utils");
exports.EXT_ID = "FL - 2024.08.22-1";
var ALBUMS_PATH = ".view .sub-photo-title-desc-view";
var ALBUMS_DIV = "div_rg_1";
(0, utils_1.log)("before start", document.readyState);
if (document.readyState != 'complete') {
    document.onload = document.onreadystatechange = start;
}
else {
    start();
}
(0, utils_1.log)("after start");
//=====================================================================
function start() {
    (0, utils_1.log)("start");
    if ((!document.readyState || document.readyState == 'complete')) {
        checkPhotostream();
        checkPhoto();
        ones();
    }
    ;
    document.addEventListener('keyup', doc_keyUp, false);
}
function ones() {
    (0, utils_1.log)(document.location.hostname);
    if (!document.location.hostname.endsWith("ones.com")) {
        return;
    }
    if (document.location.href.endsWith("/feed")) {
        var aurl = document.location.href.replace("/feed", "/photos?q=&f[categories]=Anal&filter_mode[categories]=and&filter_mode[global]=and");
        var furl = document.location.href.replace("/feed", "/photos?q=&f[categories]=Facial&filter_mode[categories]=and&filter_mode[global]=and");
        var win2 = window.open(aurl, "_blank");
        var win1 = window.open(furl, "_blank");
        // window.close()
        // document.location.href = aurl
    }
    else {
        var gallery = document.querySelectorAll("#fxgp-gallery > figure:nth-child(1) > a")[0];
        if (!gallery) {
            (0, utils_1.log)("no gallery");
            return;
        }
        gallery.click();
    }
}
function doc_keyUp(e) {
    (0, utils_1.log)(e);
    if (e.ctrlKey && e.altKey && e.key === 'a') {
        openAlbums();
    }
    if (e.ctrlKey && e.altKey && e.key === 'x') {
        openPhotostream();
    }
    if (e.ctrlKey && e.altKey && e.key === 'ArrowRight') {
        nextPage();
    }
    if (e.ctrlKey && e.altKey && e.key === 'ArrowLeft') {
        previousPage();
    }
    if (e.ctrlKey && e.altKey && e.key === 'z') {
        openAbout();
    }
    if (e.ctrlKey && e.altKey && (e.keyCode >= 48 && e.keyCode <= 57)) {
        openPhoto(e.keyCode - 48);
    }
}
function openPhoto(pos) {
    console.log("openPhoto()", pos);
    var photos = document.querySelectorAll(".photo-list-photo-interaction > a");
    if (photos.length > pos) {
        var photo = photos[pos - 1];
        photo.click();
    }
}
function previousPage() {
    var _a;
    (_a = document.querySelector("a[data-track='paginationLeftClick']")) === null || _a === void 0 ? void 0 : _a.click();
}
function nextPage() {
    var _a;
    (_a = document.querySelector("a[data-track='paginationRightClick']")) === null || _a === void 0 ? void 0 : _a.click();
}
function openAbout() {
    var _a;
    // console.log("openAbout()");
    var about = (_a = document.querySelector("li#about > a")) === null || _a === void 0 ? void 0 : _a.href;
    console.log(about);
    if (about) {
        document.location.href = about;
    }
}
function openAlbums() {
    // console.log("openAlbums()");
    var albums = document.querySelector("#" + ALBUMS_DIV).querySelectorAll("a.thumbnail");
    if (albums.length == 0) {
        return;
    }
    if (albums.length == 1) {
        var album = albums[0];
        document.location.href = album.href;
    }
    else {
        Array.from(albums).forEach(function (a) { return (0, utils_1.openTab)(a.href); });
    }
}
function openPhotostream() {
    var _a;
    var photostream = (_a = document.querySelector(".attribution-info > a.owner-name.truncate")) === null || _a === void 0 ? void 0 : _a.href;
    if (photostream) {
        document.location.href = photostream;
    }
}
function checkPhotostream() {
    if (document.location.href !== "https://www.flickr.com/") {
        (0, utils_1.log)("No Photostream");
        return;
    }
    var targetNode = document.querySelector(".flickr-logo-container");
    if (!targetNode) {
        (0, utils_1.log)("no logo");
        setTimeout(checkPhotostream, 100);
        return;
    }
    addUI(targetNode);
}
function checkPhoto() {
    if (!document.location.href.startsWith("https://www.flickr.com/photos/")) {
        (0, utils_1.log)("No Photo");
        return;
    }
    var targetNode = document.querySelector(ALBUMS_PATH);
    if (!targetNode) {
        (0, utils_1.log)("No Photo found");
        setTimeout(checkPhoto, 100);
        return;
    }
    var d1 = document.createElement("DIV");
    d1.id = ALBUMS_DIV;
    document.body.appendChild(d1);
    var width = 200;
    var left = screen.width - width - 17;
    var top = 50;
    var height = screen.height - top;
    d1.style.position = "absolute";
    d1.style.top = top + "px";
    d1.style.height = height + "px";
    d1.style.width = width + "px";
    d1.style.left = left + "px";
    d1.style.backgroundColor = "black";
    d1.style.zIndex = "10000";
    d1.appendChild(targetNode);
    targetNode.style.backgroundColor = "white";
    targetNode.style.margin = "0";
    checkAlbum(d1);
}
function checkAlbum(d1) {
    var targetNode = document.querySelector(".view .sub-photo-albums-view");
    if (!targetNode) {
        (0, utils_1.log)("No Photo found");
        setTimeout(function () { checkAlbum(d1); }, 100);
        return;
    }
    d1.appendChild(targetNode);
    targetNode.style.backgroundColor = "white";
    //	targetNode.style.marginTop = "0px"
}
function addUI(targetNode) {
    if (!targetNode || !targetNode.parentNode) {
        (0, utils_1.log)("targetNode or targetNode.parentNode not found", targetNode);
        return;
    }
    var loadButton = document.createElement("INPUT");
    loadButton.type = "button";
    loadButton.id = "rg-fli-load";
    loadButton.value = "Load";
    loadButton.addEventListener("click", load);
    targetNode.parentNode.insertBefore(loadButton, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    var scrollButton48 = document.createElement("INPUT");
    scrollButton48.type = "button";
    scrollButton48.id = "rg-fli-scroll";
    scrollButton48.value = "Scroll Free";
    scrollButton48.addEventListener("click", scrollStartFree);
    targetNode.parentNode.insertBefore(scrollButton48, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    var scrollButton = document.createElement("INPUT");
    scrollButton.type = "button";
    scrollButton.id = "rg-fli-scroll";
    scrollButton.value = "Scroll 24";
    scrollButton.addEventListener("click", function () { scrollStart(24); });
    targetNode.parentNode.insertBefore(scrollButton, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    var scroll12Button = document.createElement("INPUT");
    scroll12Button.type = "button";
    scroll12Button.id = "rg-fli-scroll12";
    scroll12Button.value = "Scroll 12";
    scroll12Button.addEventListener("click", function () { scrollStart(12); });
    targetNode.parentNode.insertBefore(scroll12Button, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    var loadPageButton = document.createElement("INPUT");
    loadPageButton.type = "button";
    loadPageButton.id = "rg-fli-loadPage";
    loadPageButton.value = "Load Page";
    loadPageButton.addEventListener("click", loadPage_1.loadPage);
    targetNode.parentNode.insertBefore(loadPageButton, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    (0, utils_1.log)("addUI done");
}
function getHours() {
    var _a;
    var times = document.querySelectorAll(".time");
    var lastTime = (_a = times[times.length - 1].textContent) === null || _a === void 0 ? void 0 : _a.trim();
    if (!lastTime) {
        (0, utils_1.log)("no lastTime");
        return 0;
    }
    console.log("scroll: ", lastTime);
    var hours = 0;
    if (lastTime.endsWith("ago")) {
        lastTime = lastTime.substr(0, lastTime.length - 4);
        var multi = 1;
        if (lastTime.endsWith("d")) {
            multi = 24;
        }
        hours = parseInt(lastTime.substring(0, lastTime.length - 1)) * multi;
    }
    else {
        if (lastTime === "1 g. fa") {
            hours = 24;
        }
        if (lastTime === "2 gg. fa") {
            hours = 48;
        }
    }
    console.log("scroll: ", hours);
    return hours;
}
var Scroller = /** @class */ (function () {
    function Scroller(tillHours) {
        this.tillHours = tillHours;
    }
    Scroller.prototype.scroll = function () {
        var _this = this;
        var hours = getHours();
        console.log("tillHours: ", this.tillHours);
        if (hours >= this.tillHours) {
            return;
        }
        window.scrollBy(0, 800);
        setTimeout(function () { _this.scroll(); }, 100);
    };
    return Scroller;
}());
function scrollStart(tillHours) {
    var scroller = new Scroller(tillHours);
    scroller.scroll();
}
function scrollStartFree() {
    var ris = null;
    while (!ris) {
        ris = prompt("Till Hours", "48");
    }
    var tillHours = parseInt(ris);
    var scroller = new Scroller(tillHours);
    scroller.scroll();
}
function load() {
    var urls = document.querySelectorAll(".title-container > a");
    // log(urls);
    // const uniqueUrls = [...new Set(Array.from(urls).map(a => a.href))]
    var uniqueUrls = Array.from(new Set(Array.from(urls).map(function (a) { return a.href; })));
    (0, utils_1.log)("uniqueUrls", uniqueUrls);
    //Array.from(uniqueUrls).forEach(a => window.open(a)); 
    var STEP = 20;
    var blocks = [];
    var from = 0;
    while (true) {
        var to = Math.min(from + STEP, uniqueUrls.length);
        blocks.push(uniqueUrls.slice(from, to));
        if (to == uniqueUrls.length) {
            break;
        }
        from += STEP;
    }
    (0, utils_1.log)("blocks", blocks);
    blocks.forEach(function (b, i) { return createBlock(b, i); });
}
function createBlock(urls, pos) {
    (0, utils_1.log)("createBlock", urls, pos);
    var targetNode = document.querySelector("#rg-fli-load");
    if (!targetNode || !targetNode.parentNode) {
        (0, utils_1.log)("targetNode or targetNode.parentNode not found", targetNode);
        return;
    }
    var blockButton = document.createElement("INPUT");
    blockButton.type = "button";
    blockButton.id = "rg-fli-block-" + pos;
    blockButton.value = "Block " + (pos + 1);
    blockButton.style.backgroundColor = 'red';
    blockButton.addEventListener("click", function () { loadBlock(blockButton, urls); });
    targetNode.parentNode.insertBefore(blockButton, targetNode);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode);
}
function loadBlock(source, urls) {
    (0, utils_1.log)("loadBlock", urls);
    source.style.backgroundColor = 'green';
    urls.forEach(function (a) { return window.open(a); });
}
