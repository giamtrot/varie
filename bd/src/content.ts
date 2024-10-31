const EXT_ID = "BD - 2024.10.31-1"

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

	console.log("Starting Sort")
	var sorter = document.querySelector("#customselect__list-0 > li:nth-child(6)") as HTMLElement
	if (sorter)
		sorter.click();
	var sorter = document.querySelector("#customselect__list-0 > li:nth-child(6)") as HTMLElement
	if (sorter)
		sorter.click();
	console.log("Sort done")

}
