// OLD
const COLS = 2
const IN_PAGE = false

const FOR_PAGE = 12
const NEW = true

const LIMIT_TO = -1
// const LIMIT_TO = 4

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function loadPage(){
	
	log("loadPage")
	const tables = {};
	const cells = {};
	
	const buttons = document.querySelectorAll("a.count-overlay-button")
	log(buttons)
	Array.from(buttons).forEach( b => { 
		b.click() 
	})

	await sleep(5000)
	
	const urls = document.querySelectorAll("div.photo > a.photo-link")
	const uniqueUrls = [...new Set(Array.from(urls).map( u => u.href))];

	// log(uniqueUrls);

	Array.from(uniqueUrls).slice(0, LIMIT_TO).forEach( 
		(url, index) => {
			// log(url)
			if (!NEW) cells[url] = handleImage(tables, index)
		}
	)
	
	// log(cells)

	Object.keys(cells).forEach(
		(u) => {
			// log(u)
			if (!NEW) fillCell(tables, u, cells[u])
		}
	)

	// log(tables)
	
	let images = []
	
	for (const url of Array.from(uniqueUrls).slice(0, LIMIT_TO)) {
		if (NEW) images.push(await getImageInfo(url))
	}
	
	slice(images, FOR_PAGE).forEach( is => loadFinalPage(is) )
	
}

function loadFinalPage(images) {

	log("loadFinalPage", images)
	const win = window.open("about:blank", "_blank")
	doc = win.document

	const style = doc.createElement('style');
	style.innerHTML = getNewStyle()
	doc.head.appendChild(style);
	
	const target = doc.createElement("div")
	doc.body.insertBefore(target, doc.body.childNodes[0]);
	render(target, images)
}

function render(target, images) {
	const template = `
<div class="parent-container-rg">
    {{#images}}
    <div class="child-container-rg">
    <div class="photostream-rg"><a href="{{photostream.url}}">{{photostream.name}}</a></div>
    <div class="description-rg">Description</div>
    <div class="album-rg">Album</div>
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
    bottom: 0px;
    z-index: 1000;
    background-color: rgba(146, 173, 64, 0.4);
    padding: 5px;
    color: #FFFFFF;
    font-weight: bold;
}
`
}

async function renderFromFile(target, images) {
	const url = chrome.runtime.getURL('template.mustache');  
	log("renderFromFile", url)
	const response = await fetch(url)
	const template = await response.text()
	fill(template, target, images)
}

function fill(template, target, images) {
	const rendered = Mustache.render(template, { images: images });
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
	
	log("getImageInfo - start", url)
	const image = {}
	const ris = await fetch(url)
	const html = await ris.text()

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

	// Search image if not video
	const img = isVideo ? "" : doc.querySelectorAll("img.main-photo")[0]?.src

	image.url = url
	image.img = img
	image.photostream = { name: photostreamName, url: photostreamURL }
	image.album = "album"
	image.description = "description"

	// // log("csrf", window?.auth?.csrf)
	// // log("api_key", window?.YUI_config?.flickr?.api?.site_key)
	// const csrf = window?.auth?.csrf
	// const api_key  =window?.YUI_config?.flickr?.api?.site_key
	// const photo_id = url.split('/')[5]
	// const detailAPI = `https://api.flickr.com/services/rest?photo_id=${photo_id}&csrf=${csrf}&api_key=${api_key}&method=flickr.photos.getAllContexts&format=json&hermes=1&nojsoncallback=1`
	// // log(detailAPI)

	

	// const detailRis = await fetch(detailAPI)
	// const detailJson = await detailRis.json()
	// // log(JSON.stringify(detailJson))

    // // log(doc.documentElement.outerHTML)
    // // root.auth = {"signedIn":true,"csrf":"1722138877:r29brohfedb:ddf6a30b05b02ddb3b5d3d6b16377ec2"
    // // document.documentElement.outerHTML.indexOf("api.site_key")
    // // root.YUI_config.flickr.api.site_key = "dead99d0ecc6f9e26ce10b525a76d210"
    // // https://api.flickr.com/services/rest?photo_id=53885065640&method=flickr.photos.getAllContexts&csrf=1722136722%3Ahzvsu97ih4k%3Afb151e300b007170be037c7e34e0c09b&api_key=dead99d0ecc6f9e26ce10b525a76d210&format=json&hermes=1&nojsoncallback=1

	// const desc = "titolo" //doc.querySelector("#summary-val").textContent
    // const album = JSON.stringify(detailJson.set)
    // // log(desc)
    // // log(photostream)

	// createCard(cell, url, img, desc, album, photostream)

	return image
	log("getImageInfo - end", url)
}

async function fillCell(tables, url, cell) {
	
	log("fillCell - start", url)
	const ris = await fetch(url)
	const html = await ris.text()

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

    const photostream = doc.querySelector("div.attribution-info > a").outerHTML

	const videos = doc.querySelectorAll("div.main-photo")
	const isVideo = videos.length > 0

	if (isVideo) {
		window.open(url, "_blank")
	}

	// Search image if not video
	const img = isVideo ? "" : doc.querySelectorAll("img.main-photo")[0]?.src

	// log("csrf", window?.auth?.csrf)
	// log("api_key", window?.YUI_config?.flickr?.api?.site_key)
	const csrf = window?.auth?.csrf
	const api_key  =window?.YUI_config?.flickr?.api?.site_key
	const photo_id = url.split('/')[5]
	const detailAPI = `https://api.flickr.com/services/rest?photo_id=${photo_id}&csrf=${csrf}&api_key=${api_key}&method=flickr.photos.getAllContexts&format=json&hermes=1&nojsoncallback=1`
	// log(detailAPI)

	

	const detailRis = await fetch(detailAPI)
	const detailJson = await detailRis.json()
	// log(JSON.stringify(detailJson))

    // log(doc.documentElement.outerHTML)
    // root.auth = {"signedIn":true,"csrf":"1722138877:r29brohfedb:ddf6a30b05b02ddb3b5d3d6b16377ec2"
    // document.documentElement.outerHTML.indexOf("api.site_key")
    // root.YUI_config.flickr.api.site_key = "dead99d0ecc6f9e26ce10b525a76d210"
    // https://api.flickr.com/services/rest?photo_id=53885065640&method=flickr.photos.getAllContexts&csrf=1722136722%3Ahzvsu97ih4k%3Afb151e300b007170be037c7e34e0c09b&api_key=dead99d0ecc6f9e26ce10b525a76d210&format=json&hermes=1&nojsoncallback=1

	const desc = "titolo" //doc.querySelector("#summary-val").textContent
    const album = JSON.stringify(detailJson.set)
    // log(desc)
    // log(photostream)

	createCard(cell, url, img, desc, album, photostream)
	log("fillCell - end", url)
}

function handleImage(tables, index)  {
	
	const page = Math.floor(index / FOR_PAGE)
	// log(index, page)
	
	const table = getTable(tables, page)
	let row = table.rows[table.rows.length - 1]
	if (index % COLS == 0) {
		row = table.insertRow()
	}
	
	return row.insertCell()

}

function createCard(cell, url, img, desc, album, photostream) {
	
	const doc = cell.ownerDocument
	const table = doc.createElement("table")
	cell.appendChild(table)
	
	table.insertRow().insertCell().innerHTML = photostream
	if (img == "") {
		table.insertRow().insertCell().innerHTML = 'No IMG. Is Video?'
	} else {
    	table.insertRow().insertCell().innerHTML = '<a target="_blank" href="' + url + '"><img style="height:400px" src="' + img + '"></a>'
	}
	// table.insertRow().insertCell().innerHTML = desc
	// table.insertRow().insertCell().innerHTML = album	

}

function getTable(tables, page) {

	if (tables[page]) {
		return tables[page]
	}
	
	let doc = document
	if (!IN_PAGE) {
		const win = window.open("about:blank", "_blank")
	 	doc = win.document
	}
	
	const style = doc.createElement('style');
	style.innerHTML = getStyle("" + Math.floor(100/COLS) + "%")
	doc.head.appendChild(style);
	
	const table = doc.createElement("table")
	// doc.body.appendChild(table)
	doc.body.insertBefore(table, doc.body.childNodes[0]);
	tables[page] = table
	return tables[page]
}

function getStyle(width) {
	return `
table,
td,
th
{
	border:1px solid black;
	border-collapse:collapse;
}
table
{
	table-layout:fixed;
	width: 100%
}
td
{
	text-align:right;
	width: $width;
}
th
{
	text-align:left
}
tr.odd td,
tr.odd th
{
	background-color:yellow;
}
caption
{
	font-weight:bold;
	color:#999
}
`.replaceAll('$width', width)
}

