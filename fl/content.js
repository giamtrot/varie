const extId = "FL - 2024.03.16-1"

document.onload = document.onreadystatechange = function() {

	log()
	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		checkPanel()
	};

};

function log(msg){
	console.log(extId, " - ", msg)
}


function checkPanel() {
	const targetNode = document.querySelector(".flickr-logo-container")
	if (!targetNode) {
		log("no logo")
		setTimeout(checkPanel, 100)
		return;
	}
	addUI(targetNode)
}

function addUI(targetNode) {

	var loadButton = document.createElement("INPUT");
	loadButton.type = "button"
		loadButton.id ="rg-fli-load"
		loadButton.value = "Load"
	loadButton.addEventListener("click", load)
	targetNode.parentNode.insertBefore(loadButton, targetNode.nextSibling);
	
	log("addUI done")
}
	
function load(){
	
	const urls = document.querySelectorAll(".link-footer > a");
	// log(urls);
	const uniqueUrls = new Set(Array.from(urls).map(a => a.href));
	log(uniqueUrls);
	Array.from(uniqueUrls).forEach(a => window.open(a)); 
		
}

