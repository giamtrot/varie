const extId = "CIV - 2024.07.19-1"

document.onload = document.onreadystatechange = function() {

	log()
	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		// checkPhotostream();
		// checkPhoto();
	};
	
	document.addEventListener('keyup', doc_keyUp, false);
};

function doc_keyUp(e) {

	// log(e)
	if (e.ctrlKey && e.altKey && e.key === 'A') {
        downloadAll();
    }
}

function log(msg){
	console.log(extId, " - ", msg)
}

async function downloadAll() {
	log("downloadAll()");

	let cerca = document.querySelector('button[aria-label="Cerca"')
	log(cerca)
	cerca.click()
	
	return

	// Punti all'ordine del giorno
	document.querySelector("a[href='#tab-puntiodg'").click()
	await sleep(1000);

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
	
	let row = puntiODGRows.shift();
	row.click();
	
	await sleep(1000);
	await downloadDocumentiPunto()

	//clickNextPunto( puntiRows )
}

async function downloadDocumentiPunto() {

	log("downloadDocumentiPunto")

	let documenti = document.querySelectorAll("a[aria-label='Documenti']")[0]
	log(documenti)
	documenti.click()

	await sleep(1000);

	let rows = Array.from(document.querySelector("#GridDocumentiProposta > div.awe-mcontent > div.awe-content.awe-tablc > div > table > tbody").rows)
	log(rows)
	rows.forEach( (r) => {
		console.log(r)
	})

	await sleep(10000);
	let chiudi = document.querySelectorAll("a[aria-label='Chiudi']")[0]
	log(chiudi)
	chiudi.click()

}

