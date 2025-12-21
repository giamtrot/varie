const EXT_ID = "TOSANO - 2024.10.31-1"

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

	log("Starting Sort")

	// Load sort menu
	const sortArea = Array.from(document.querySelectorAll("span")).findLast(it => it.textContent === "Ordina per");
	log("Found sort area:", sortArea);

	const sortButton = sortArea?.parentNode?.querySelector("div[role='button']") as HTMLDivElement;
	log("Found sort button:", sortButton);

	sortButton?.click()

	let sortItem: HTMLDivElement | undefined = undefined;
	let loopCount = 0;

	const clicker = () => {
		if (sortItem) {
			sortItem?.click();
			log("Sort done")
			return
		}

		if (loopCount > 10) {
			log("Sort item not found, giving up")
			return
		}

		sortItem = Array.from(document.querySelectorAll(".v-list-item__title")).findLast(it => it.textContent === "Prezzo al kg crescente") as HTMLDivElement;
		log("Found sort item:", sortItem);
		loopCount++;
		setTimeout(clicker, 500);
	}

	setTimeout(clicker, 500);

}
