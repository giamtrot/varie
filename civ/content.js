// TODO: scelta dinamica del consiglio
// TODO: migliore fruizione move allegati

const extId = "CIV - 2024.07.28-1"
const WAIT = 2000

log("before start", document.readyState)
if (document.readyState != 'loaded' && document.readyState != 'complete') {
	document.onload = document.onreadystatechange = start
}
else {
	start()
}
log("after start")

//=====================================================================

function start() {

	log("start")
	loadUI()
	document.addEventListener('keyup', doc_keyUp, false);

};

function loadUI() {

	log("loadUI")
	
	const targetNode = document.querySelector("div.menu-extras > ul")
	var downloadloadButton = document.createElement("INPUT");
	downloadloadButton.type = "button"
	downloadloadButton.id ="rg-civ-download"
	downloadloadButton.value = "Download All"
	downloadloadButton.addEventListener("click", downloadAll)
	targetNode.parentNode.insertBefore(downloadloadButton, targetNode.nextSibling);

	var fetchButton = document.createElement("INPUT");
	fetchButton.type = "button"
	fetchButton.id ="rg-civ-fetch"
	fetchButton.value = "Fetch All"
	fetchButton.addEventListener("click", fetchAll)
	targetNode.parentNode.insertBefore(fetchButton, targetNode.nextSibling);


	// targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);

	log("loadUI done")
}

async function fetchAll() {

	let response = await fetch('/CommissioniOnline/ODG/Ricerca', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: 'v=&IdOrgano=&NumeroDal=&NumeroAl=&DataConvocazione1Dal=&DataConvocazione1Al=&IdSedeConsiliare=&OggettoDelibera=&DataDelibera=&NumeroDelibera=&pageSize=50&FiltraPerAnnoEsercizio=true&page=1&SortNames=DescrizioneOrganoDeliberante&SortDirections=desc&SortNames=Numero&SortDirections=desc'
	});

	// {
	// 	"Id": 88931,
	// 	"IdSottoTipoAtto": 1544,
	// 	"DescrizioneOrganoDeliberante": "Consiglio Comunale",
	// 	"Numero": 1,
	// 	"DataOraConvocazione1": "15/02/2024 18:30",
	// 	"DataOraConvocazione2": "",
	// 	"NumeroProtocollo": null,
	// 	"DataProtocollo": null,
	// 	"TipoSeduta": "Pubblica",
	// 	"TipoSedutaId": 1,
	// 	"TipoSessione": "Ordinaria",
	// 	"TipoSessioneId": 1,
	// 	"SedeConsiliareId": 196,
	// 	"IsSecondaConvocazione": false,
	// 	"Firmatario": null,
	// 	"Sede": "Casa Comunale",
	// 	"Note": null,
	// 	"IdOrgano": 99
	// },
	let consigli = await response.json();
	// for (const consiglio of consigli.Data.Items) {
	// 	log(consiglio)
	// }
	const consiglio = consigli.Data.Items.filter((c) => c.Numero == 5)
	await fetchConsiglio(consiglio[0])

}

async function fetchConsiglio(consiglio) {

	log(consiglio)

	let response = await fetch('/CommissioniOnline/ODG/CercaPuntiODG', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: `v=&pageSize=50&Id=${consiglio.Id}&page=1&SortNames=DescrizioneSottotipo&SortDirections=desc&SortNames=Posizione&SortDirections=desc&SortNames=NumeroProposta&SortDirections=desc&SortNames=DataProposta&SortDirections=desc&SortNames=NumeroDelibera&SortDirections=desc&SortNames=DataDelibera&SortDirections=desc`
	});

	// {
	// 	"Cancellato": false,
	// 	"DataProposta": "11/07/2024",
	// 	"DescrizioneStatoProposta": "Proposta inserita in Ordine del Giorno",
	// 	"Id": 454534,
	// 	"IdOrdineGiorno": 104284,
	// 	"IdPunto": 4239872,
	// 	"Note": null,
	// 	"NumeroProposta": 42,
	// 	"Oggetto": "Comunicazioni del Sindaco  (Art. 62 – Regolamento Consiglio Comunale)\r\n\r\n",
	// 	"Posizione": 1,
	// 	"ProgressivoSottotipo": 39,
	// 	"StatoProposta": 3,
	// 	"TipoPunto": 0,
	// 	"NumeroDelibera": null,
	// 	"DataDelibera": "",
	// 	"DescrizioneSottotipo": "Delibera di Consiglio"
	// },
	let json = await response.json();
	let odgs= json.Data.Items.filter( (o) => o.Cancellato == false)
	for (const odg of odgs) {
		await fetchOdg(odg, 'Documenti')
		await fetchOdg(odg, 'Allegati')
	}

}

async function fetchOdg(odg, tipo) {

	log(`ODG: ${tipo} - ${odg.Posizione} - ${odg.Id} - ${odg.Oggetto}`)

	let response = await fetch(`/CommissioniOnline/ODG/Cerca${tipo}Proposta`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: `v=&IdPunto=${odg.IdPunto}&pageSize=50&page=1`
	});

	let json = await response.json();
	// {
	// 	"Id": 9172672,
	// 	"NomeFile": "Proposta.pdf",
	// 	"MimeType": "application/pdf",
	// 	"IdAtto": 4239872,
	// 	"Version": 0,
	// 	"St": "v3Kgn0lvppq_4hACrmYpni2F1YPGWAIvarTxti-jxME"
	// }
	let docs= json.Data.Items
	index = 0;
	for (const doc of docs) {
		index++
		await fetchFile(odg, tipo, doc, index)
	}

}

async function fetchFile(odg, tipo, doc, index) {

	const sub = (tipo === 'Documenti' ? "" : "a.") + ("00" + index).slice(-2)
	const nomefile = `${odg.Posizione}.${sub} - ${odg.Oggetto.substring(0, 100)} - ${doc.NomeFile}`
	log(`DOC: ${doc.Id} - ${nomefile}`)

	const  linkUrl = tipo === 'Documenti' ? 
		"/AttiAmministrativi/Common/DownloadDocumentoProdotto" :	
		"/AttiAmministrativi/Common/DownloadAllegato"
	;

	const idField = tipo === 'Documenti' ? "IdDocumento" : "IdAllegato"
;
	// IdAllegato=10180204&st=unr_NSyl9hzODWqfyOS57_KUGdinnvf2SPxKivqxBF0
	const queryString = `${idField}=` + doc.Id + '&IdAtto=' + doc.IdAtto + '&NomeFile=' + nomefile + '&MimeType=' + doc.Mime + '&st=' + doc.St;
	
	window.open(linkUrl + '?' + queryString);
	if (tipo == 'Allegati') {
		console.log(`move "${doc.NomeFile}" "${nomefile}"`)
	}
}


function doc_keyUp(e) {

	// log(e)
	if (e.ctrlKey && e.altKey && e.key === 'A') {
        downloadAll();
    }
}

function log(...msg){
	const date = new Date();
	console.log(extId, " - ", date.toLocaleDateString(), date.toLocaleTimeString(), " - ", msg)
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

