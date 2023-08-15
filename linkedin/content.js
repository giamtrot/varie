document.onload = document.onreadystatechange = function() {

	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		// const targetNode = document.getElementById("products-panel");
		console.clear();
		const targetNode = document.querySelector(".jobs-unified-top-card")
		if (!targetNode) {
			log("no job-panel")
			return;
		}
		addUI(targetNode);
	};

};

function log(msg){

	console.log("LinkedIn - 2023.06.24-1 - ", msg)

}

function seeStatus(targetNode, value) {
	var div = document.createElement("DIV");
	if (value) {
		div.id ="rg-lin-yes-done"
		div.textContent = "Applied"
		div.style.backgroundColor = "#19bcaa"
	} else {
		div.id ="rg-lin-no-done"
		div.textContent = "Not Applied"
		div.style.backgroundColor = "red"
	}
	div.style.color = "white"
	div.style.fontSize = "xx-large"
	div.style.fontWeight = "bold"
	div.style.padding = "10px"
	div.style.display = "inline-block"
	targetNode.insertBefore(div, targetNode.firstChild);
}


function say(targetNode, value, yesButton, noButton){
	var works = JSON.parse(localStorage.works)
	works[document.location.pathname] = value
	log(works)
	localStorage.works = JSON.stringify(works)
	log(localStorage.works)
	seeStatus(targetNode, value)
	yesButton.style.display = "none"
	noButton.style.display = "none"
}

function addUI(targetNode) {

	var works = {}
	if (localStorage.works) {
		works = JSON.parse(localStorage.works)
	}
	log(works)

	var selector = document.location.pathname;
	var work = works[selector]
	log(work)
	if (work == undefined) {
		var yesButton = document.createElement("INPUT");
		yesButton.type = "button"
		yesButton.id ="rg-lin-yes"
		yesButton.value = "YES"
		var noButton = document.createElement("INPUT");
		noButton.type = "button"
		noButton.id ="rg-lin-no"
		noButton.value = "NO"
		yesButton.addEventListener("click", function() { say(targetNode, true, yesButton, noButton) })
		noButton.addEventListener("click", function() { say(targetNode, false, yesButton, noButton) })
		targetNode.insertBefore(noButton, targetNode.firstChild);
		targetNode.insertBefore(yesButton, targetNode.firstChild);
	}
	
	else if (work) {
		seeStatus(targetNode, true)
	}
	else {
		seeStatus(targetNode, false)
	}

	log("addUI done")
}

function Observe() {
	// Select the node that will be observed for mutations
	// const targetNode = document.getElementById("products-panel");
	const targetNode = document.querySelector("[ui-view='productSet']")

	// Options for the observer (which mutations to observe)
	const config = { attributes: false, childList: true, subtree: false };

	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
		var sortAgain = false;
  		for (const mutation of mutationList) {
    		if (mutation.type === "childList") {
      			log("A child node has been added or removed.");
				sortAgain = true;
    		}
		}

		if (sortAgain) {
			sort(observer);
		}
  	;}


	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
	log("Observation started")
}
