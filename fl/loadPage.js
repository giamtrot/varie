const COLS = 2
const FOR_PAGE = 4

async function loadPage(){
	
	log("loadPage")
	const tables = {};
	const cells = {};
	
	const urls = document.querySelectorAll("div.photo > a.photo-link")
	log(urls);
	
	Array.from(urls).slice(0, 10).forEach( 
		(url, index) => {
			cells[url] = handleImage(tables, url, index)
		}
	)
	
	log(cells)
	Object.keys(cells).forEach(
		(u) => {
			fillCell(tables, u, cells[u])
		}
	)
	
	// log(tables)
}

async function fillCell(tables, url, cell) {
	
	log("fillCell - start", url)
	const ris = await fetch(url)
	const html = await ris.text()
	
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
    // log(doc.documentElement.outerHTML)
    // root.auth = {"signedIn":true,"csrf":"1722138877:r29brohfedb:ddf6a30b05b02ddb3b5d3d6b16377ec2"
    // document.documentElement.outerHTML.indexOf("api.site_key")
    // root.YUI_config.flickr.api.site_key = "dead99d0ecc6f9e26ce10b525a76d210"
    // https://api.flickr.com/services/rest?photo_id=53885065640&method=flickr.photos.getAllContexts&csrf=1722136722%3Ahzvsu97ih4k%3Afb151e300b007170be037c7e34e0c09b&api_key=dead99d0ecc6f9e26ce10b525a76d210&format=json&hermes=1&nojsoncallback=1

	const desc = "titolo" //doc.querySelector("#summary-val").textContent
    const photostream = doc.querySelector("div.attribution-info > a").outerHTML
    const album = "album" //doc.querySelector(".view .sub-photo-albums-view").outerHTML
    // log(desc)
    // log(photostream)

	createCard(cell, url, desc, album, photostream)
	log("fillCell - end", url)
}

function handleImage(tables, url, index)  {
	
	const page = Math.floor(index / FOR_PAGE)
	log(index, page, url)
	
	const table = getTable(tables, page)
	let row = table.rows[table.rows.length - 1]
	if (index % COLS == 0) {
		row = table.insertRow()
	}
	
	return row.insertCell()

}

function createCard(cell, url, desc, album, photostream) {
	
	const doc = cell.ownerDocument
	const table = doc.createElement("table")
	cell.appendChild(table)
	
	table.insertRow().insertCell().innerHTML = photostream
    table.insertRow().insertCell().innerHTML = url
	table.insertRow().insertCell().innerHTML = desc
	table.insertRow().insertCell().innerHTML = album

}

function getTable(tables, page) {

	if (tables[page]) {
		return tables[page]
	}
	
	// const win = window.open("about:blank", "_blank")
	// const doc = win.document
	
	const doc = document
	
	const style = doc.createElement('style');
	style.type = 'text/css';
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
