const extId = "TEST - 2024.07.30-1"

document.onload = document.onreadystatechange = function () {

	log("")
	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		loadUI()
	};

};

function log(msg) {
	console.log(extId, " - ", msg)
}

const images = [
	{
		url: "https://www.corriere.it/economia/agritech-agrifood/24_luglio_30/orate-vongole-e-cozze-a-rischio-l-estate-orribile-della-pesca-tra-mucillagini-vermocane-e-granchio-blu-67da4c64-4657-470c-87cb-fc36cc6d4xlk.shtml",
		img: "https://dimages2.corriereobjects.it/files/main_image/uploads/2024/02/16/65cf89f658b85.jpeg"
	},
	{
		url: "https://milano.corriere.it/notizie/cronaca/24_luglio_30/milano-come-venezia-biglietto-atm-maggiorato-per-i-turisti-l-ipotesi-per-evitare-gli-aumenti-ai-residenti-74dac8d6-4d59-4518-b04a-a96f9a84exlk.shtml",
		img: "https://dimages2.corriereobjects.it/files/main_image/uploads/2024/07/30/66a8a9ac0d407.jpeg"
	}
]

function render() {
	const template = `
<table style="table-layout: fixed; width: 100%;">
<tr>
	{{#images}}
	<td class="container" style="">
		<div class="photostream">Photostream</div>
		<div class="description">Description</div>
		<div class="album">Album</div>
		<a target="_blank" href="{{url}}">
		<img style="width:100%; height:auto;" src="{{img}}" />
		</a>
	</td>
	{{/images}}
</tr>
</table>	
	`
	fill(template)
}

async function renderFromFile() {
	const url = chrome.runtime.getURL('template.mustache');  
	log(url)
	const response = await fetch(url)
	const template = await response.text()
	fill(template)
}

function fill(template) {
	const rendered = Mustache.render(template, { images: images });
	document.getElementById('target').innerHTML = rendered;
}

function loadUI() {

	log("loadUI")
	const d1 = document.createElement("DIV")
	d1.id = "target"
	document.body.insertBefore(d1, document.body.children[0])
	const width = 500;
	const height = 500;
	// d1.style.position = "absolute"
	d1.style.top = top + "px"
	d1.style.height = height + "px"
	d1.style.width = width + "px"
	d1.style.backgroundColor = "green"

	renderFromFile()
	// render()

}

