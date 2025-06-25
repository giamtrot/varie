const EXT_ID = "LN - 2025.06.25-1"

const CARDS = "li.ember-view.scaffold-layout__list-item"

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

	const targetSelector = CARDS + ":not([data-rg-enriched=true])"
	const observer = new MutationObserver(() => {
		const targetNodes = document.querySelectorAll(targetSelector)
		Array.from(targetNodes).forEach((li) => { callback(li as HTMLLIElement) })
	})


	observer.observe(document, {
		childList: true,
		subtree: true,
	})
}

async function enrich(li: HTMLElement) {

	const button = li.querySelector("button");

	if (!button) {
		log("button not found", li)
		return
	}

	const id = li.dataset.occludableJobId
	if (!id) {
		throw new Error("occludableJobId not found")
	}
	const { url, title, company } = getJobInfo(li)
	log(url, title, company)
	li.setAttribute("data-rg-enriched", 'true');
	// hideBySelector(li, "div.job-card-list__insight")
	// hideBySelector(li, "ul.job-card-list__footer-wrapper")

	var newButton = document.createElement("button");
	newButton.id = "rg-button-X-" + id
	newButton.textContent = "->"
	newButton.addEventListener("click", function () {
		log("opening", url)
		openTab(url)
	})
	log(button.parentNode)
	button.parentNode?.insertBefore(newButton, button);

	const oldJob = oldJOb(title, company)
	if (oldJob) {
		log("Found already seen job")
		const { button, role } = getJobButton(li);
		if (!button) { return }
		button.click();
		emptyLi(li)
	}

}

function getJobInfo(li: HTMLElement) {
	const link = li.querySelector("a.job-card-container__link") as HTMLAnchorElement
	const url = link?.href
	const title = link?.ariaLabel || ""
	const company = li.querySelector(".artdeco-entity-lockup__subtitle")?.textContent?.trim() || ""
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

	const parent = document.querySelector("div.scaffold-layout__list")
	if (parent === null) {
		log("parent node is null")
		return
	}

	const element = document.querySelector("header.scaffold-layout__list-header")
	if (element === null) {
		log("element node is null")
		return
	}


	var removeAllButton = document.createElement("INPUT") as HTMLInputElement;
	removeAllButton.type = "button"
	removeAllButton.id = "rg-ln-removeAll"
	removeAllButton.value = "Rimuovi Tutti"
	removeAllButton.addEventListener("click", rimuoviTutti)
	parent.insertBefore(removeAllButton, element);
	parent.insertBefore(document.createTextNode(" "), element);

	log("addUI done")
}


function rimuoviTutti() {
	// const targetSelector = "li.ember-view.jobs-search-results__list-item.occludable-update.p0.relative.scaffold-layout__list-item"
	const targetNodes = document.querySelectorAll(CARDS)
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

async function auditValue(row: string) {
	const map = await getMap()
	map[row] = Date.now()
	// const oneWeekAgo = Date.now() - 1 * 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	// const newMap = Object.fromEntries(Object.entries(map).filter(([key, timestamp]) => typeof timestamp === 'number' && timestamp >= oneWeekAgo))
	const newMap = map
	await saveStorage(newMap)
}


async function getMap() {
	await initStorage({})
	const map = await getStorage()
	return map
}

function oldJOb(title: string, company: string) {
	const row = getRow(title, company)
	const map = getMap()
	const oldJob = row in map
	return oldJob
}

function emptyLi(li: HTMLElement) {
	log("emptyLi", li)
	li.querySelector("div.job-card-list__logo")?.remove()
	li.querySelector("div.artdeco-entity-lockup__subtitle")?.remove()
	li.querySelector("div.artdeco-entity-lockup__caption")?.remove()
}

