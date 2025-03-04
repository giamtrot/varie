const EXT_ID = "TB - 2025.03.-1"

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
	chrome.tabs.query({}, (tabs) => {
		log("tabs", tabs)
	});
}



