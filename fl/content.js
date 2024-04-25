const extId = "FL - 2024.03.17-1"

document.onload = document.onreadystatechange = function() {

	log()
	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		checkPhotostream();
		checkPhoto();
	};

};

function log(msg){
	console.log(extId, " - ", msg)
}


function checkPhotostream() {
	if (document.location.href !== "https://www.flickr.com/") {
		log("No Photostream");
		return;
	}

	
	const targetNode = document.querySelector(".flickr-logo-container")
	if (!targetNode) {
		log("no logo")
		setTimeout(checkPhotostream, 100)
		return;
	}
	addUI(targetNode)
}

function checkPhoto() {
	if (!document.location.href.startsWith("https://www.flickr.com/photos/")) {
		log("No Photo");
		return;
	}

	
	const targetNode = document.querySelector(".sub-photo-view")
	if (!targetNode) {
		log("No Photo found")
		setTimeout(checkPhoto, 100)
		return;
	}
	const width = 200;
	const left = screen.width - width;
	targetNode.style.position = "absolute"
	targetNode.style.top = "50px"
	targetNode.style.width = width + "px"
	targetNode.style.left = left + "px"
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

