const extId = "LN - 2024.10.14-1"

const mapName = "rg-linkedin-map"

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

	console.clear()
	log("start")

	enrichJobPost()
}

function list(li: HTMLLIElement) {

	const id = li.dataset.occludableJobId
	if (!id) {
		throw new Error("occludableJobId not found")
	}
	const title = li.querySelector(".job-card-list__title")?.ariaLabel
	const company = li.querySelector(".job-card-container__primary-description")?.textContent?.trim()
	log(id, title, company)
}

function enrichJobPost() {
	waitForList((li) => { enrich(li) })
}

function waitForList(callback: (element: HTMLLIElement) => void) {
	const baseSelector = "div.scaffold-layout__list > div > ul"
	const baseObserver = new MutationObserver(() => {
		const targetNode = document.querySelector(baseSelector)
		if (targetNode) {
			baseObserver.disconnect()
			addUI()
		}
	})

	baseObserver.observe(document, {
		childList: true,
		subtree: true
	})

	const targetSelector = "li.ember-view.jobs-search-results__list-item.occludable-update.p0.relative.scaffold-layout__list-item:not([data-rg-enriched=true])"
	const observer = new MutationObserver(() => {
		const targetNodes = document.querySelectorAll(targetSelector)
		Array.from(targetNodes).forEach((li) => { callback(li as HTMLLIElement) })
	})


	observer.observe(document, {
		childList: true,
		subtree: true,
	})
}

function enrich(li: HTMLElement) {

	const button = li.querySelector("button");

	if (!button) { return }

	const id = li.dataset.occludableJobId
	if (!id) {
		throw new Error("occludableJobId not found")
	}
	const link = li.querySelector("a.job-card-list__title") as HTMLAnchorElement
	const title = link?.ariaLabel
	const url = link?.href
	const company = li.querySelector(".job-card-container__primary-description")?.textContent?.trim()
	li.setAttribute("data-rg-enriched", 'true');
	log(id, title, company, url)

	hideBySelector(li, "div.job-card-list__insight")
	hideBySelector(li, "ul.job-card-list__footer-wrapper")

	var newButton = document.createElement("button");
	newButton.id = "rg-button-X-" + id
	newButton.textContent = "->"
	newButton.addEventListener("click", function () {
		log("opening", url)
		openTab(url)
	})
	button.parentNode?.insertBefore(newButton, button);
}

function hideBySelector(li: HTMLElement, selector: string) {
	const insight = li.querySelector(selector) as HTMLElement
	if (insight) {
		insight.remove()
	}
}

function addUI() {

	// openTab("https://www.example.com")

	const element = document.querySelector("div.jobs-search-results-list")

	if (element === null || element.parentNode === null) {
		return
		// throw new Error("element.parentNode is null")
	}

	var removeAllButton = document.createElement("INPUT") as HTMLInputElement;
	removeAllButton.type = "button"
	removeAllButton.id = "rg-ln-removeAll"
	removeAllButton.value = "Rimuovi Tutti"
	removeAllButton.addEventListener("click", rimuoviTutti)
	element.parentNode.insertBefore(removeAllButton, element);
	element.parentNode.insertBefore(document.createTextNode(" "), element);

	log("addUI done")
}


function rimuoviTutti() {
	const targetSelector = "li.ember-view.jobs-search-results__list-item.occludable-update.p0.relative.scaffold-layout__list-item"
	const targetNodes = document.querySelectorAll(targetSelector)
	// log("rimuoviTutti", targetNodes)
	Array.from(targetNodes).forEach((li) => {
		const button = li.querySelector("button.job-card-container__action") as HTMLButtonElement;
		if (!button) { return }
		// log("rimuoviTutti", button)
		button.click();
	})
}
