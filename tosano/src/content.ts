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
	const sortItem = Array.from(document.querySelectorAll(".v-list-item__title") as NodeListOf<HTMLDivElement>).findLast(it => it.textContent === "Prezzo al kg crescente")
	log("Found sort item:", sortItem)
	sortItem?.click()
	log("Sort done")

}
