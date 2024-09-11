const FOR_PAGE = 12

const LIMIT_TO = -1
// const LIMIT_TO = 4

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function loadPage() {

	log("loadPage")
	const tables = {};
	const cells = {};

	const buttons = document.querySelectorAll("a.count-overlay-button")
	// log(buttons)
	Array.from(buttons).forEach(b => {
		b.click()
	})

	await sleep(5000)

	const urls = document.querySelectorAll("div.photo > a.photo-link")
	const uniqueUrls = [...new Set(Array.from(urls).map(u => u.href))];

	// log(uniqueUrls);

	let pages = slice(uniqueUrls.slice(0, LIMIT_TO), FOR_PAGE)
	pages.forEach(urlsForPage => loadFinalPage(urlsForPage))
}

async function loadFinalPage(urls) {

	// log("loadFinalPage", urls)

	let images = []

	for (const url of Array.from(urls)) {
		images.push(await getImageInfo(url))
	}

	const win = window.open("about:blank", "_blank")
	doc = win.document

	const style = doc.createElement('style');
	style.innerHTML = getNewStyle()
	doc.head.appendChild(style);

	const target = doc.createElement("div")
	doc.body.insertBefore(target, doc.body.childNodes[0]);
	render(target, images)
}


function fill(template, target, images) {
	const rendered = Mustache.render(template, { images: images });
	// log(rendered)
	target.innerHTML = rendered;
}

function slice(array, chunkSize) {
	const ris = []
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		ris.push(chunk)
	}
	return ris
}

async function getImageInfo(url) {

	// log("getImageInfo - start", url)
	const image = {}
	const ris = await fetch(url)
	const html = await ris.text()
	// log(html)

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const photostream = doc.querySelector("div.attribution-info > a")
	const photostreamName = photostream?.textContent
	const photostreamURL = photostream?.href
	if (photostream == null) {
		log("not found stream")
	}

	const videos = doc.querySelectorAll("div.main-photo")
	const isVideo = videos.length > 0

	if (isVideo) {
		window.open(url, "_blank")
		return {}
	}

	image.url = url

	// Search image if not video
	const img = isVideo ? "" : doc.querySelectorAll("img.main-photo")[0]?.src
	image.img = img

	image.photostream = { name: photostreamName, url: photostreamURL }

	// const desc = doc.querySelectorAll("meta[name='description']")[0]?.content
	const desc = doc.querySelectorAll("div.title-desc-block.showFull")[0]?.innerText?.replace("Done\n\n\t", "")?.trim()
	// log(desc)
	if (desc?.length > 200) {
		image.description = desc.substring(0, 196) + " ..."
		image.descriptionFull = desc
	}
	else {
		image.description = desc
		image.descriptionFull = ""
	}

	// log("csrf", window?.auth?.csrf)
	// log("api_key", window?.YUI_config?.flickr?.api?.site_key)
	const csrf = window?.auth?.csrf
	const api_key = window?.YUI_config?.flickr?.api?.site_key
	const photo_id = url.split('/')[5]
	const detailAPI = `https://api.flickr.com/services/rest?photo_id=${photo_id}&csrf=${csrf}&api_key=${api_key}&method=flickr.photos.getAllContexts&format=json&hermes=1&nojsoncallback=1`
	log("detailAPI", photo_id, detailAPI)

	const detailRis = await fetch(detailAPI, {
		credentials: 'include'
	})
	const detailJson = await detailRis.json()
	log(photo_id, JSON.stringify(detailJson))

	// // log(doc.documentElement.outerHTML)
	// // root.auth = {"signedIn":true,"csrf":"1722138877:r29brohfedb:ddf6a30b05b02ddb3b5d3d6b16377ec2"
	// // document.documentElement.outerHTML.indexOf("api.site_key")
	// // root.YUI_config.flickr.api.site_key = "dead99d0ecc6f9e26ce10b525a76d210"
	// // https://api.flickr.com/services/rest?photo_id=53885065640&method=flickr.photos.getAllContexts&csrf=1722136722%3Ahzvsu97ih4k%3Afb151e300b007170be037c7e34e0c09b&api_key=dead99d0ecc6f9e26ce10b525a76d210&format=json&hermes=1&nojsoncallback=1

	// const sets = JSON.stringify(detailJson.set)
	image.album = ""
	if (detailJson.set) {
		log(detailJson.set)
		const albums = detailJson.set.map(s => {
			return { id: s.id, title: s.title, owner: s.owner.nsid }
		})

		const albumUrlTemplate = "https://www.flickr.com/photos/$owner/albums/$id"
		albums.forEach(a => a.url = albumUrlTemplate.replace("$owner", a.owner).replace("$id", a.id))
		// log(albums)
		const album = albums.map( a => `<a href="${a.url}">${a.title}</a>`)
		log("album", album, album.join("<br />"))
		image.album = album.join("<br />")
	} 
	return image
	// log("getImageInfo - end", url)
}

function render(target, images) {
	log("render", images)
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
	`
	fill(template, target, images)
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
`
}