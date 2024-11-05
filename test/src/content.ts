const extId = "TEST - 2024.11.04-1"

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

	createTabFromHtml("new title", "<h1>TEST</h1>")

}