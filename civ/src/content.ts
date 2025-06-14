
const EXT_ID = "CIV - 2025.06.07-1"
const WAIT = 2000
const MOVE_AREA = "rg-civ-move"

log("before start", document.readyState)
if (document.readyState != 'complete') {
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

}

function loadUI() {

	log("loadUI")

	if (location.href.indexOf("protocollo.civilianext.it") >= 0) {
		UIProtocollo()
	} else {
		UICommissioni()
	}

	log("loadUI done")
}

let progress
function UIProtocollo() {
	log("UIProtocollo")
	
	const targetNode = document.querySelector("div.menu-extras > ul")
	if (!targetNode || !targetNode.parentNode) {
		log("targetNode or parentNode not found", targetNode)
		return
	}
	
	const currentYear = new Date().getFullYear();
	
	progress = document.createElement("div") as HTMLInputElement;
	progress.style.fontSize = 'large';
	progress.style.color = 'white';
	targetNode.parentNode.insertBefore(progress, targetNode.nextSibling);

	targetNode.parentNode.insertBefore(document.createTextNode("\u00A0"), targetNode.nextSibling);

	var downloadloadButtonThisYear = document.createElement("INPUT") as HTMLInputElement;
	downloadloadButtonThisYear.type = "button"
	downloadloadButtonThisYear.id = "rg-civ-download-thisYear"
	downloadloadButtonThisYear.value = `Download ${currentYear}`;
	
	downloadloadButtonThisYear.addEventListener("click", () => downloadYear(currentYear))
	targetNode.parentNode.insertBefore(downloadloadButtonThisYear, targetNode.nextSibling);
	
	targetNode.parentNode.insertBefore(document.createTextNode("\u00A0"), targetNode.nextSibling);
	
	var downloadloadButtonLastYear = document.createElement("INPUT") as HTMLInputElement;
	downloadloadButtonLastYear.type = "button"
	downloadloadButtonLastYear.id = "rg-civ-download-lastYear"
	downloadloadButtonLastYear.value = `Download ${currentYear-1}`;
	downloadloadButtonLastYear.addEventListener("click", () => downloadYear(currentYear-1))
	targetNode.parentNode.insertBefore(downloadloadButtonLastYear, targetNode.nextSibling);

	targetNode.parentNode.insertBefore(document.createTextNode("\u00A0"), targetNode.nextSibling);
}

async function downloadYear(year: number) {

	log(`downloadYear: ${year}`)
	
	const pageSize = 50; // Numero di pratiche per pagina
	let page = 1; // Pagina da scaricare
	let pageCount = 1; // Numero di pagine da scaricare (puoi modificarlo in base alle tue esigenze)
	const elements: any[] = []; // Array per memorizzare gli elementi scaricati
	do {
		const ris = await downloadPage(year, page, pageSize);
		const { pageCount: newPageCount, elements: pageElements } = ris;
		pageCount = newPageCount;
		elements.push(...pageElements);
		log(`downloadPage: ${year} - page: ${page} - pageCount: ${pageCount} - elements: ${pageElements.length} - total: ${elements.length}`);
		// if (page == 2) {
		// 	break;
		// }
		progress!.textContent = `Scaricamento ${year} - Pagina ${page} di ${pageCount} - Elementi: ${elements.length}`;
		page++;
	} while (page <= pageCount);
	
	downloadCSV(elements, year)
	log(`downloadYear: ${year} done`)
	progress!.textContent = `Scaricamento ${year} completato - Elementi: ${elements.length}`;
}

function downloadCSV(elements: any[], year: number) {
	const csvRows: string[] = []
	if (elements.length > 0) {
		// Get headers from object keys
		const headers = Object.keys(elements[0])
		const separator = ";"
		csvRows.push(headers.join(separator))
		for (const el of elements) {
			const row = headers.map(h => {
				let val = el[h]
				if (val === null || val === undefined) return ""
				val = val.toString().replace(/"/g, '""')
				if (val.includes(separator) || val.includes('"') || val.includes("\n")) {
					val = `"${val}"`
				}
				return val
			}).join(separator)
			csvRows.push(row)
		}
		const csvContent = csvRows.join("\r\n")
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		const now = new Date()
		const ts = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
		log(`downloadCSV: ${year} - elements: ${elements.length} - ts: ${ts}`)
		a.download = `pratiche_${year}_${ts}.csv`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}
}

async function downloadPage(year: number, page: number, pageSize: number) {
	log(`downloadPage: ${year} - page: ${page} - pageSize: ${pageSize}`)

	// The API response is expected to contain total pages and items.
	
	let response = await fetch("/Protocollo/Pratica/CercaPratica", {
		"method": "POST",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		"body": `v=&pageSize=${pageSize}&IdCodiceAOO=355&IdRegistroCorrispondenza=146&ANno=${year}&page=${page}&SortNames=NumeroProtocollo&SortDirections=desc`,
	})
	
	
	const json = await response.json();
	const pageCount = json.PageCount;
	const elements = json.Data.Items
	return { pageCount, elements };		
}


function UICommissioni() {
	log("UICommissioni")
	const targetNode = document.querySelector("div.menu-extras > ul")
	if (!targetNode || !targetNode.parentNode) {
		log("targetNode or parentNode not found", targetNode)
		return
	}

	var moveArea = document.createElement("TEXTAREA") as HTMLTextAreaElement;
	moveArea.id = MOVE_AREA
	targetNode.parentNode.insertBefore(moveArea, targetNode.nextSibling);


	var downloadloadButton = document.createElement("INPUT") as HTMLInputElement;
	downloadloadButton.type = "button"
	downloadloadButton.id = "rg-civ-download"
	downloadloadButton.value = "Download All"
	downloadloadButton.addEventListener("click", downloadAll)
	//targetNode.parentNode.insertBefore(downloadloadButton, targetNode.nextSibling);

	var fetchButton = document.createElement("INPUT") as HTMLInputElement;
	fetchButton.type = "button"
	fetchButton.id = "rg-civ-fetch"
	fetchButton.value = "Fetch All"
	fetchButton.addEventListener("click", fetchAll)
	targetNode.parentNode.insertBefore(fetchButton, targetNode.nextSibling);

	// targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);

	var fetchConsiglioButton = document.createElement("INPUT") as HTMLInputElement;
	fetchConsiglioButton.type = "button"
	fetchConsiglioButton.id = "rg-civ-fetch-single"
	fetchConsiglioButton.value = "Fetch Consiglio"
	fetchConsiglioButton.addEventListener("click", fetchConsiglioSingolo)
	targetNode.parentNode.insertBefore(fetchConsiglioButton, targetNode.nextSibling);

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
	let ultimo = consigli.Data.Items.sort((a: { Numero: number }, b: { Numero: number }) => b.Numero - a.Numero)[0].Numero
	let quale = prompt("Quale consiglio", ultimo);
	if (quale == null) {
		return
	}
	log(`Scelto ${quale}`)
	const consiglio = consigli.Data.Items.filter((c: { Numero: string }) => c.Numero == quale)
	await fetchConsiglio(consiglio[0])

}

async function fetchConsiglioSingolo() {

	let selected = document.querySelectorAll("tr.awe-row.awe-selected") as NodeList
	if (!selected || !(selected.length == 1)) {
		log("Selected not found")
		return
	}

	let element = selected[0] as Element 
	let date = element.children[2].textContent?.substring(0, 10)
	log ("date", date)
	let response1 = await fetch('/CommissioniOnline/ODG/Ricerca', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: `v=&IdOrgano=&NumeroDal=&NumeroAl=&DataConvocazione1Dal=${date}&DataConvocazione1Al=${date}&IdSedeConsiliare=&OggettoDelibera=&DataDelibera=&NumeroDelibera=&pageSize=50&FiltraPerAnnoEsercizio=true&page=1&SortNames=DescrizioneOrganoDeliberante&SortDirections=desc&SortNames=Numero&SortDirections=desc`
	});
	let json1 = await response1.json();
	log("json1", json1)

	if (json1.Data.Items.length != 1) {
		log("Not found 1")
		return
	}

	let consiglio = json1.Data.Items[0]
	log("consiglio", consiglio)

	await fetchConsiglio(consiglio)
}

async function fetchConsiglio(consiglio: { Id: any }) {

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
	let odgs = json.Data.Items.filter((o: { Cancellato: boolean }) => o.Cancellato == false)
	for (const odg of odgs) {
		await fetchOdg(odg, 'Documenti')
		await fetchOdg(odg, 'Allegati')
	}

}

async function fetchOdg(odg: { Posizione: any; Id: any; Oggetto: any; IdPunto: any }, tipo: string) {

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
	let docs = json.Data.Items
	let index = 0;
	for (const doc of docs) {
		index++
		await fetchFile(odg, tipo, doc, index)
	}

}

async function fetchFile(odg: { Posizione: any; Id?: any; Oggetto: any; IdPunto?: any }, tipo: string, doc: { NomeFile: any; Id: string; IdAtto: string; Mime: string; St: string }, index: string | number) {

	const sub = (tipo === 'Documenti' ? "" : "a.") + ("00" + index).slice(-2)
	const nomefile = `${odg.Posizione}.${sub} - ${odg.Oggetto.substring(0, 100)} - ${doc.NomeFile}`
	log(`DOC: ${doc.Id} - ${nomefile}`)

	const linkUrl = tipo === 'Documenti' ?
		"/AttiAmministrativi/Common/DownloadDocumentoProdotto" :
		"/AttiAmministrativi/Common/DownloadAllegato"
		;

	const idField = tipo === 'Documenti' ? "IdDocumento" : "IdAllegato"
		;
	// IdAllegato=10180204&st=unr_NSyl9hzODWqfyOS57_KUGdinnvf2SPxKivqxBF0
	const queryString = `${idField}=` + doc.Id + '&IdAtto=' + doc.IdAtto + '&NomeFile=' + nomefile + '&MimeType=' + doc.Mime + '&st=' + doc.St;

	window.open(linkUrl + '?' + queryString);
	if (tipo == 'Allegati') {
		const allNomeFile = nomefile.replace("/", "_")
		logMove(`move "${doc.NomeFile}" "${allNomeFile}"`)
	}
}


function doc_keyUp(e: { ctrlKey: any; altKey: any; key: string }) {

	// log(e)
	if (e.ctrlKey && e.altKey && e.key === 'A') {
		downloadAll();
	}
}


async function downloadAll() {
	log("downloadAll()");

	let cerca = document.querySelector('button[aria-label="Cerca"') as HTMLButtonElement
	if (!cerca) {
		log("cerca not found")
		return
	}
	log(cerca)
	cerca.click()
	await sleep(WAIT);

	let odgTable = document.querySelectorAll("#GridOdg > div.awe-mcontent > div.awe-content.awe-tablc > div > table")[0] as HTMLTableElement
	log(odgTable)
	let odg = Array.from(odgTable.rows).find((r) => r.cells[1].textContent === '6')
	if (!odg) {
		log("odg not found")
		return
	}
	odg.click()
	await sleep(WAIT);

	// Punti all'ordine del giorno
	const puntiODG = document.querySelector("a[href='#tab-puntiodg'") as HTMLAnchorElement
	if (!puntiODG) {
		log("puntiODG not found")
		return
	}
	puntiODG.click()
	await sleep(WAIT);

	const table = document.querySelector("#GridPuntiODG > div.awe-mcontent > div.awe-content.awe-tablc > div > table > tbody") as HTMLTableElement
	if (!table) {
		log("table not found")
		return
	}
	let puntiODGRows = Array.from(table.rows);
	await clickNextPunto(puntiODGRows)
}

async function sleep(millis: number | undefined) {
	return new Promise(r => setTimeout(r, millis))
}

async function clickNextPunto(puntiODGRows: string | any[] | undefined) {

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

async function downloadPunto(tipo: string) {

	log("downloadPunto: " + tipo)

	let documenti = document.querySelectorAll("a[aria-label='" + tipo + "']")[0] as HTMLAnchorElement
	log(documenti)
	if (!documenti) {
		log("documenti not found")
		return
	}
	documenti.click()

	await sleep(WAIT)

	const rows = (document.querySelector("#GridDocumentiProposta > div.awe-mcontent > div.awe-content.awe-tablc > div > table > tbody") as HTMLTableElement)?.rows
	log(rows)
	if (rows) {
		for (const row of Array.from(rows)) {
			log("row click")
			row.click()
			await sleep(WAIT);
			log("download click")
			let download = document.querySelector("#downloadBtn") as HTMLElement
			if (!download) {
				log("download not found")
				return
			}
			download.click()
			await sleep(WAIT);
		}
	}

	log("chiudi wait")
	await sleep(WAIT);
	let chiudi = document.querySelectorAll("a[aria-label='Chiudi']")[0] as HTMLAnchorElement
	log(chiudi)
	if (!chiudi) {
		log("chiudi not found")
		return
	}
	chiudi.click()
	await sleep(WAIT);
}

function logMove(msg: string) {
	const moveArea = document.querySelector("#" + MOVE_AREA) as HTMLTextAreaElement
	moveArea.value += msg + "\n"
}

