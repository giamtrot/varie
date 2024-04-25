const extId = "FL - 2024.04.11-1"

const ALBUMS_PATH = ".view .sub-photo-title-desc-view"
const ALBUMS_DIV = "div_rg_1"

document.onload = document.onreadystatechange = function() {

	log()
	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		checkPhotostream();
		checkPhoto();
	};
	
	document.addEventListener('keyup', doc_keyUp, false);
};

function doc_keyUp(e) {

	console.log(e)
	if (e.ctrlKey && e.altKey && e.key === 'a') {
        openAlbums();
    }

	if (e.ctrlKey && e.altKey && e.key === 'x') {
        openPhotostream();
    }

	if (e.ctrlKey && e.altKey && e.key === 'ArrowRight') {
        nextPage();
    }

	if (e.ctrlKey && e.altKey && e.key === 'ArrowLeft') {
        previousPage();
    }

	if (e.ctrlKey && e.altKey && e.key === 'z') {
        openAbout();
    }
	
	if (e.ctrlKey && e.altKey && (e.keyCode >= 48 && e.keyCode <= 57)) {
        openPhoto(e.keyCode - 48);
    }

}

function openPhoto(pos) {
	console.log("openPhoto()", pos);
	const photos = document.querySelectorAll(".photo-list-photo-interaction > a")
	if (photos.length > pos ) {
		photos[pos-1].click()
	}
}

function previousPage() {
	document.querySelector("a[data-track='paginationLeftClick']").click()
}

function nextPage() {
	document.querySelector("a[data-track='paginationRightClick']").click()
}

function openAbout() {
	// console.log("openAbout()");
	const about = document.querySelector("li#about > a")?.href
	console.log(about)
	if (about) {
		document.location.href = about
	}
}


function openAlbums() {
	// console.log("openAlbums()");
	const albums = document.querySelector("#" + ALBUMS_DIV).querySelectorAll("a.thumbnail")
	
	if (albums.length == 0) {
		return
	}
	
	if (albums.length == 1) {
		document.location.href = albums[0]
	}
	else {
		Array.from(albums).forEach(a => window.open(a)); 
	}
}

function openPhotostream() {
	const photostream = document.querySelector(".attribution-info > a.owner-name.truncate")?.href
	if (photostream) {
		document.location.href = photostream
	}
}

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

	
	const targetNode = document.querySelector(ALBUMS_PATH)
	if (!targetNode) {
		log("No Photo found")
		setTimeout(checkPhoto, 100)
		return;
	}
	
	const d1 = document.createElement("DIV")
	d1.id = ALBUMS_DIV
	document.body.appendChild(d1)
	const width = 200;
	const left = screen.width - width - 17;
	const top = 50;
	const height = screen.height - top;
	d1.style.position = "absolute"
	d1.style.top = top + "px"
	d1.style.height = height + "px"
	d1.style.width = width + "px"
	d1.style.left = left + "px"
	d1.style.backgroundColor = "black"
	d1.style.zIndex = 10000
	d1.appendChild(targetNode)
	targetNode.style.backgroundColor = "white"
	targetNode.style.margin = "0"
	
	checkAlbum(d1)
}

function checkAlbum(d1) {
	const targetNode = document.querySelector(".view .sub-photo-albums-view")
	if (!targetNode) {
		log("No Photo found")
		setTimeout(() => {checkAlbum(d1)}, 100)
		return;
	 }
	d1.appendChild(targetNode)
	targetNode.style.backgroundColor = "white"
//	targetNode.style.marginTop = "0px"
}


function addUI(targetNode) {

	var loadButton = document.createElement("INPUT");
	loadButton.type = "button"
	loadButton.id ="rg-fli-load"
	loadButton.value = "Load"
	loadButton.addEventListener("click", load)
	targetNode.parentNode.insertBefore(loadButton, targetNode.nextSibling);

	targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);

	var scrollButton = document.createElement("INPUT");
	scrollButton.type = "button"
	scrollButton.id ="rg-fli-scroll"
	scrollButton.value = "Scroll"
	scrollButton.addEventListener("click", scroll)
	targetNode.parentNode.insertBefore(scrollButton, targetNode.nextSibling);
	
	targetNode.parentNode.insertBefore(document.createTextNode("&nbsp;"), targetNode.nextSibling);
	log("addUI done")
}
	
function scroll() {

	const times = document.querySelectorAll(".time");
	const lastTime = times[times.length - 1].textContent.trim()
	console.log("scroll: ", lastTime)
	if (lastTime === "1d ago") {
		return;
	}
	if (lastTime === "2d ago") {
		return;
	}
	if (lastTime === "1 g. fa") {
		return;
	}
	if (lastTime === "2 gg. fa") {
		return;
	}
	window.scrollBy(0, 800); 
	setTimeout(scroll, 100)	
}

function load(){
	
	const urls = document.querySelectorAll(".title-container > a")
	// log(urls);
	const uniqueUrls = new Set(Array.from(urls).map(a => a.href));
	log(uniqueUrls);
	Array.from(uniqueUrls).forEach(a => window.open(a)); 
		
}

