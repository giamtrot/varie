const EXT_ID = "LN - 2024.10.14-1"

const MAP_NAME = "rg-linkedin-map"

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
	const { url, title, company } = getJobInfo(li)
	li.setAttribute("data-rg-enriched", 'true');
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

	const oldJob = oldJOb(title, company)
	if (oldJob) {
		log("Found already seen job")
		const { button, role } = getJobButton(li);
		if (!button) { return }
		button.click();
	}

}

function getJobInfo(li: HTMLElement) {
	const link = li.querySelector("a.job-card-list__title") as HTMLAnchorElement
	const url = link?.href
	const title = link?.ariaLabel || ""
	const company = li.querySelector(".job-card-container__primary-description")?.textContent?.trim() || ""
	return { url, title, company }
}

function getRow(title: string, company: string) {
	return `${title};${company}`
}

function hideBySelector(li: HTMLElement, selector: string) {
	const insight = li.querySelector(selector) as HTMLElement
	if (insight) {
		insight.remove()
	}
}

function addUI() {

	const element = document.querySelector("div.jobs-search-results-list")

	if (element === null || element.parentNode === null) {
		log("element.parentNode is null")
		return
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
		const { button, role } = getJobButton(li);
		if (!button) { return }
		if (role === "undo-small") { return }
		audit(li as HTMLElement)
		// log("rimuoviTutti", button)
		button.click();
	})
	log("rimuoviTutti done")
	window.location.reload();
}


function getJobButton(li: Element) {
	const button = li.querySelector("button.job-card-container__action") as HTMLButtonElement
	const role = button?.querySelector("svg")?.getAttribute('data-test-icon')
	return { button, role }
}

function audit(li: HTMLElement) {
	const { url, title, company } = getJobInfo(li)
	auditValue(getRow(title, company))
}
function auditValue(row: string) {
	const map = getMap()
	map[row] = Date.now()
	setLocalStorage(MAP_NAME, map)
}
function getMap() {
	initLocalStorage(MAP_NAME, {})
	const map = getLocalStorage(MAP_NAME)
	return map
}

function oldJOb(title: string, company: string) {
	const row = getRow(title, company)
	const map = getMap()
	const oldJob = row in map
	return oldJob
}