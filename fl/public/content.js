import { loadPage } from './loadPage';
import { log, openTab } from './utils';
export const EXT_ID = "FL - 2025.03.23-1";
const ALBUMS_PATH = ".view .sub-photo-title-desc-view";
const ALBUMS_DIV = "div_rg_1";
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
    if ((!document.readyState || document.readyState == 'complete')) {
        checkPhotostream();
        checkPhoto();
        ones();
    }
    ;
    document.addEventListener('keyup', doc_keyUp, false);
}
function ones() {
    log(document.location.hostname);
    if (!document.location.hostname.endsWith("ones.com")) {
        return;
    }
    if (document.location.href.endsWith("/feed")) {
        const aurl = document.location.href.replace("/feed", "/photos?q=&f[categories]=Anal&filter_mode[categories]=and&filter_mode[global]=and");
        const furl = document.location.href.replace("/feed", "/photos?q=&f[categories]=Facial&filter_mode[categories]=and&filter_mode[global]=and");
        const win2 = window.open(aurl, "_blank");
        const win1 = window.open(furl, "_blank");
        // window.close()
        // document.location.href = aurl
    }
    else {
        const gallery = document.querySelectorAll("#fxgp-gallery > figure:nth-child(1) > a")[0];
        if (!gallery) {
            log("no gallery");
            return;
        }
        gallery.click();
    }
}
function doc_keyUp(e) {
    log(e);
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
    const photos = document.querySelectorAll(".photo-list-photo-interaction > a");
    if (photos.length > pos) {
        const photo = photos[pos - 1];
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
    const about = (_a = document.querySelector("li#about > a")) === null || _a === void 0 ? void 0 : _a.href;
    console.log(about);
    if (about) {
        document.location.href = about;
    }
}
function openAlbums() {
    // console.log("openAlbums()");
    const albums = document.querySelector("#" + ALBUMS_DIV).querySelectorAll("a.thumbnail");
    if (albums.length == 0) {
        return;
    }
    if (albums.length == 1) {
        const album = albums[0];
        document.location.href = album.href;
    }
    else {
        Array.from(albums).forEach((a) => openTab(a.href));
    }
}
function openPhotostream() {
    var _a;
    const photostream = (_a = document.querySelector(".attribution-info > a.owner-name.truncate")) === null || _a === void 0 ? void 0 : _a.href;
    if (photostream) {
        document.location.href = photostream;
    }
}
function checkPhotostream() {
    if (document.location.href !== "https://www.flickr.com/") {
        log("No Photostream");
        return;
    }
    const targetNode = document.querySelector(".flickr-logo-container");
    if (!targetNode) {
        log("no logo");
        setTimeout(checkPhotostream, 100);
        return;
    }
    addUI(targetNode);
}
function checkPhoto() {
    if (!document.location.href.startsWith("https://www.flickr.com/photos/")) {
        log("No Photo");
        return;
    }
    const targetNode = document.querySelector(ALBUMS_PATH);
    if (!targetNode) {
        log("No Photo found");
        setTimeout(checkPhoto, 100);
        return;
    }
    const d1 = document.createElement("DIV");
    d1.id = ALBUMS_DIV;
    document.body.appendChild(d1);
    const width = 200;
    const left = screen.width - width - 17;
    const top = 50;
    const height = screen.height - top;
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
    const targetNode = document.querySelector(".view .sub-photo-albums-view");
    if (!targetNode) {
        log("No Photo found");
        setTimeout(() => { checkAlbum(d1); }, 100);
        return;
    }
    d1.appendChild(targetNode);
    targetNode.style.backgroundColor = "white";
    //	targetNode.style.marginTop = "0px"
}
function addUI(targetNode) {
    if (!targetNode || !targetNode.parentNode) {
        log("targetNode or targetNode.parentNode not found", targetNode);
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
    scrollButton.addEventListener("click", () => { scrollStart(24); });
    targetNode.parentNode.insertBefore(scrollButton, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    var scroll12Button = document.createElement("INPUT");
    scroll12Button.type = "button";
    scroll12Button.id = "rg-fli-scroll12";
    scroll12Button.value = "Scroll 12";
    scroll12Button.addEventListener("click", () => { scrollStart(12); });
    targetNode.parentNode.insertBefore(scroll12Button, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    var loadPageButton = document.createElement("INPUT");
    loadPageButton.type = "button";
    loadPageButton.id = "rg-fli-loadPage";
    loadPageButton.value = "Load Page";
    loadPageButton.addEventListener("click", loadPage);
    targetNode.parentNode.insertBefore(loadPageButton, targetNode.nextSibling);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
    log("addUI done");
}
function getHours() {
    var _a;
    const times = document.querySelectorAll(".time");
    let lastTime = (_a = times[times.length - 1].textContent) === null || _a === void 0 ? void 0 : _a.trim();
    if (!lastTime) {
        log("no lastTime");
        return 0;
    }
    console.log("scroll: ", lastTime);
    let hours = 0;
    if (lastTime.endsWith("ago")) {
        lastTime = lastTime.substr(0, lastTime.length - 4);
        let multi = 1;
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
class Scroller {
    constructor(tillHours) {
        this.tillHours = tillHours;
    }
    scroll() {
        const hours = getHours();
        console.log("tillHours: ", this.tillHours);
        if (hours >= this.tillHours) {
            return;
        }
        window.scrollBy(0, 800);
        setTimeout(() => { this.scroll(); }, 100);
    }
}
function scrollStart(tillHours) {
    const scroller = new Scroller(tillHours);
    scroller.scroll();
}
function scrollStartFree() {
    let ris = null;
    while (!ris) {
        ris = prompt("Till Hours", "48");
    }
    const tillHours = parseInt(ris);
    const scroller = new Scroller(tillHours);
    scroller.scroll();
}
function load() {
    const urls = document.querySelectorAll(".title-container > a");
    // log(urls);
    // const uniqueUrls = [...new Set(Array.from(urls).map(a => a.href))]
    const uniqueUrls = Array.from(new Set(Array.from(urls).map(a => a.href)));
    log("uniqueUrls", uniqueUrls);
    //Array.from(uniqueUrls).forEach(a => window.open(a)); 
    const STEP = 20;
    const blocks = [];
    let from = 0;
    while (true) {
        let to = Math.min(from + STEP, uniqueUrls.length);
        blocks.push(uniqueUrls.slice(from, to));
        if (to == uniqueUrls.length) {
            break;
        }
        from += STEP;
    }
    log("blocks", blocks);
    blocks.forEach((b, i) => createBlock(b, i));
}
function createBlock(urls, pos) {
    log("createBlock", urls, pos);
    const targetNode = document.querySelector("#rg-fli-load");
    if (!targetNode || !targetNode.parentNode) {
        log("targetNode or targetNode.parentNode not found", targetNode);
        return;
    }
    var blockButton = document.createElement("INPUT");
    blockButton.type = "button";
    blockButton.id = "rg-fli-block-" + pos;
    blockButton.value = "Block " + (pos + 1);
    blockButton.style.backgroundColor = 'red';
    blockButton.addEventListener("click", () => { loadBlock(blockButton, urls); });
    targetNode.parentNode.insertBefore(blockButton, targetNode);
    targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode);
}
function loadBlock(source, urls) {
    log("loadBlock", urls);
    source.style.backgroundColor = 'green';
    urls.forEach((a) => window.open(a));
}
