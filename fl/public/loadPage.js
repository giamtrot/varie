var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { log } from "./utils";
import Mustache from 'mustache';
const FOR_PAGE = 12;
const LIMIT_TO = -1;
// const LIMIT_TO = 4
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export function loadPage() {
    return __awaiter(this, void 0, void 0, function* () {
        log("loadPage");
        const tables = {};
        const cells = {};
        const buttons = document.querySelectorAll("a.count-overlay-button");
        // log(buttons)
        Array.from(buttons).forEach(b => {
            b.click();
        });
        yield sleep(5000);
        const urls = document.querySelectorAll("div.photo > a.photo-link");
        const uniqueUrls = Array.from(new Set(Array.from(urls).map(a => a.href)));
        // log(uniqueUrls);
        let pages = slice(uniqueUrls.slice(0, LIMIT_TO), FOR_PAGE);
        pages.forEach(urlsForPage => loadFinalPage(urlsForPage));
    });
}
function loadFinalPage(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        // log("loadFinalPage", urls)
        let images = [];
        for (const url of Array.from(urls)) {
            images.push(yield getImageInfo(url));
        }
        const win = window.open("about:blank", "_blank");
        const doc = win.document;
        const style = doc.createElement('style');
        style.innerHTML = getNewStyle();
        doc.head.appendChild(style);
        const target = doc.createElement("div");
        doc.body.insertBefore(target, doc.body.childNodes[0]);
        render(target, images);
    });
}
function fill(template, target, images) {
    const rendered = Mustache.render(template, { images: images });
    // log(rendered)
    target.innerHTML = rendered;
}
function slice(array, chunkSize) {
    const ris = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        ris.push(chunk);
    }
    return ris;
}
function getImageInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        // log("getImageInfo - start", url)
        const ris = yield fetch(url);
        const html = yield ris.text();
        // log(html)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const photostream = doc.querySelector("div.attribution-info > a");
        if (photostream == null) {
            log("not found stream");
        }
        const photostreamName = photostream.textContent;
        const photostreamURL = photostream.href;
        const videos = doc.querySelectorAll("div.main-photo");
        const isVideo = videos.length > 0;
        if (isVideo) {
            window.open(url, "_blank");
            return {};
        }
        // Search image if not video
        const img = isVideo ? "" : doc.querySelectorAll("img.main-photo")[0].src;
        // const desc = doc.querySelectorAll("meta[name='description']")[0]?.content
        const desc = (_b = (_a = doc.querySelectorAll("div.title-desc-block.showFull")[0].innerText) === null || _a === void 0 ? void 0 : _a.replace("Done\n\n\t", "")) === null || _b === void 0 ? void 0 : _b.trim();
        // log(desc)
        let description = desc;
        let descriptionFull = "";
        if ((desc === null || desc === void 0 ? void 0 : desc.length) > 200) {
            description = desc.substring(0, 196) + " ...";
            descriptionFull = desc;
        }
        // log("csrf", window?.auth?.csrf)
        // log("api_key", window?.YUI_config?.flickr?.api?.site_key)
        const csrf = (_c = window.auth) === null || _c === void 0 ? void 0 : _c.csrf;
        const api_key = (_f = (_e = (_d = window.YUI_config) === null || _d === void 0 ? void 0 : _d.flickr) === null || _e === void 0 ? void 0 : _e.api) === null || _f === void 0 ? void 0 : _f.site_key;
        const photo_id = url.split('/')[5];
        const detailAPI = `https://api.flickr.com/services/rest?photo_id=${photo_id}&csrf=${csrf}&api_key=${api_key}&method=flickr.photos.getAllContexts&format=json&hermes=1&nojsoncallback=1`;
        log("detailAPI", photo_id, detailAPI);
        const detailRis = yield fetch(detailAPI, {
            credentials: 'include'
        });
        const detailJson = yield detailRis.json();
        log(photo_id, JSON.stringify(detailJson));
        // // log(doc.documentElement.outerHTML)
        // // root.auth = {"signedIn":true,"csrf":"1722138877:r29brohfedb:ddf6a30b05b02ddb3b5d3d6b16377ec2"
        // // document.documentElement.outerHTML.indexOf("api.site_key")
        // // root.YUI_config.flickr.api.site_key = "dead99d0ecc6f9e26ce10b525a76d210"
        // // https://api.flickr.com/services/rest?photo_id=53885065640&method=flickr.photos.getAllContexts&csrf=1722136722%3Ahzvsu97ih4k%3Afb151e300b007170be037c7e34e0c09b&api_key=dead99d0ecc6f9e26ce10b525a76d210&format=json&hermes=1&nojsoncallback=1
        // const sets = JSON.stringify(detailJson.set)
        let album = "";
        if (detailJson.set) {
            log(detailJson.set);
            const albums = detailJson.set.map((s) => {
                return { id: s.id, title: s.title, owner: s.owner.nsid };
            });
            const albumUrlTemplate = "https://www.flickr.com/photos/$owner/albums/$id";
            albums.forEach((a) => a.url = albumUrlTemplate.replace("$owner", a.owner).replace("$id", a.id));
            // log(albums)
            const albumLIst = albums.map((a) => `<a href="${a.url}">${a.title}</a>`);
            log("album", albumLIst, albumLIst.join("<br />"));
            album = albumLIst.join("<br />");
        }
        const image = {
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
        return image;
        // log("getImageInfo - end", url)
    });
}
function render(target, images) {
    log("render", images);
    const template = `
<div class="parent-container-rg">
    {{#images}}
    <div title="{{descriptionFull}}" class="child-container-rg">
		<div class="photostream-rg"><a href="{{photostream.url}}">{{photostream.name}}</a></div>
		<div class="description-rg">{{{description}}}</div>
		<div class="album-rg">{{{album}}}</div>
		<a target="_blank" href="{{url}}">
			<img class="image-rg" src="{{img}}" />
		</a>
    </div>
    {{/images}}
</div>
	`;
    fill(template, target, images);
}
function getNewStyle() {
    return `
.parent-container-rg {
    padding: 20px;
}

a {
    color: #FFFFFF;
    font-weight: bold;
}

.image-rg {
    height: 300px; 
}

.child-container-rg {
    float: left;
    border: 1px solid #DDDDDD;
    height: 300px; 
    position: relative;
    /* width: 50%; */
}

.photostream-rg {
    float: left;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 1000;
    background-color: rgba(146, 173, 64, 0.4);
    padding: 5px;
    color: #FFFFFF;
    font-weight: bold;
}

.description-rg {
    /* float: left; */
    position: absolute;
    left: 0px;
    bottom: 0px;
    z-index: 1000;
    background-color: rgba(146, 173, 64, 0.4);
    padding: 5px;
    color: #FFFFFF;
    font-weight: bold;
}

.album-rg {
    float: right;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 1000;
    background-color: rgba(146, 173, 64, 0.4);
    padding: 5px;
    color: #FFFFFF;
    font-weight: bold;
}
`;
}
