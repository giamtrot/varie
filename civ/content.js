const extId = "CIV - 2024.07.19-1"
const WAIT = 2000

document.onload = document.onreadystatechange = function() {

	log()
	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		// checkPhotostream();
		// checkPhoto();
	};
	
	loadUI()
	document.addEventListener('keyup', doc_keyUp, false);
};

function loadUI() {

	log("loadUI")
	
	const targetNode = document.querySelector("div.menu-extras > ul")
	var loadButton = document.createElement("INPUT");
	loadButton.type = "button"
	loadButton.id ="rg-civ-load"
	loadButton.value = "Download All"
	loadButton.addEventListener("click", downloadAll)
	targetNode.parentNode.insertBefore(loadButton, targetNode.nextSibling);

	// targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);

	log("loadUI done")
}


function doc_keyUp(e) {

	// log(e)
	if (e.ctrlKey && e.altKey && e.key === 'A') {
        downloadAll();
    }
}

function log(msg){
	console.log(extId, " - ", new Date(), " - ", msg)
}

async function downloadAll() {
	log("downloadAll()");

	let cerca = document.querySelector('button[aria-label="Cerca"')
	log(cerca)
	cerca.click()
	await sleep(WAIT);

	let odgTable = document.querySelectorAll("#GridOdg > div.awe-mcontent > div.awe-content.awe-tablc > div > table")[0]
	log(odgTable)
	let odg = Array.from(odgTable.rows).find( (r) => r.cells[1].textContent === '5' )
	odg.click()
	await sleep(WAIT);
	
	// Punti all'ordine del giorno
	document.querySelector("a[href='#tab-puntiodg'").click()
	await sleep(WAIT);

	let puntiODGRows = Array.from(document.querySelector("#GridPuntiODG > div.awe-mcontent > div.awe-content.awe-tablc > div > table > tbody").rows);
	await clickNextPunto( puntiODGRows )
}

async function sleep(millis) {
	return new Promise(r => setTimeout(r, millis))
}

async function clickNextPunto(puntiODGRows) {

	log("clickNextPunto")
	log(puntiODGRows);
	if (puntiODGRows == undefined || puntiODGRows.length === 0) {
		return;
	}
	
	for (const row of puntiODGRows) {
	
		row.click();
		await sleep(1000);
	
		await downloadPunto('Allegati')
		await downloadPunto('Documenti')
	}

}

async function downloadPunto(tipo) {

	log("downloadPunto: " + tipo)

	let documenti = document.querySelectorAll("a[aria-label='" + tipo + "']")[0]
	log(documenti)
	documenti.click()

	await sleep(WAIT)

	let rows = document.querySelector("#GridDocumentiProposta > div.awe-mcontent > div.awe-content.awe-tablc > div > table > tbody")?.rows
	log(rows)
	if (rows) {
		for (const row of Array.from(rows)) {
			log("row click")
			row.click()
			await sleep(WAIT);
			log("download click")
			let download = document.querySelector("#downloadBtn")
			download.click()
			await sleep(WAIT);
		}
	}

	log("chiudi wait")
	await sleep(WAIT);
	let chiudi = document.querySelectorAll("a[aria-label='Chiudi']")[0]
	log(chiudi)
	chiudi.click()
	await sleep(WAIT);
}

