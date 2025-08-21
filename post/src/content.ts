import { log, openTab } from './utils'

export const EXT_ID = "POST - 2025.08.21-1"

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
	if ((!document.readyState || document.readyState == 'complete')) {
		const links = document.querySelectorAll("#__next a") 
		const targetNode = Array.from(links).filter( it => it.className.startsWith("_logo"))[0];
		addUI(targetNode);
		// checkPhotostream();
		// checkPhoto();

		// ones()
	};

	// document.addEventListener('keyup', doc_keyUp, false);
}



function addUI(targetNode: Element) {

	if (!targetNode || !targetNode.parentNode) {
		log("targetNode or targetNode.parentNode not found", targetNode)
		return
	}
	var loadButton = document.createElement("INPUT") as HTMLInputElement
	loadButton.type = "button"
	loadButton.id = "rg-post-load"
	loadButton.value = "Load"
	loadButton.addEventListener("click", load)
	targetNode.parentNode.insertBefore(loadButton, targetNode.nextSibling);

	// targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);

	// var scrollButton48 = document.createElement("INPUT") as HTMLInputElement
	// scrollButton48.type = "button"
	// scrollButton48.id = "rg-fli-scroll"
	// scrollButton48.value = "Scroll Free"
	// scrollButton48.addEventListener("click", scrollStartFree)
	// targetNode.parentNode.insertBefore(scrollButton48, targetNode.nextSibling);
	// targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);

	// var scrollButton = document.createElement("INPUT") as HTMLInputElement
	// scrollButton.type = "button"
	// scrollButton.id = "rg-fli-scroll"
	// scrollButton.value = "Scroll 24"
	// scrollButton.addEventListener("click", () => { scrollStart(24) })
	// targetNode.parentNode.insertBefore(scrollButton, targetNode.nextSibling);
	// targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);

	// var scroll12Button = document.createElement("INPUT") as HTMLInputElement
	// scroll12Button.type = "button"
	// scroll12Button.id = "rg-fli-scroll12"
	// scroll12Button.value = "Scroll 12"
	// scroll12Button.addEventListener("click", () => { scrollStart(12) })
	// targetNode.parentNode.insertBefore(scroll12Button, targetNode.nextSibling);
	// targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);


	log("addUI done")
}

function load() {

	const nextData = document.querySelector("#__NEXT_DATA__")?.textContent;
	const data = JSON.parse(nextData || "{}");
	log("load", data)
}