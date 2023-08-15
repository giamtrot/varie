document.onload = document.onreadystatechange = function() {

	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
		// const targetNode = document.getElementById("products-panel");
		const targetNode = document.querySelector("[ui-view='productSet']")
		if (!targetNode) {
			log("no products-panel")
			return;
		}
		console.clear();
		sort();
	};

};

function log(msg){

	console.log("ES - 2023.06.10-2 - ", msg)

}

function sort(observer) {

	if (observer) {
		observer.disconnect();
	}

	log("Starting Sort")
	let list = document.querySelectorAll(".content-item");
	let items = Array.from(list)
		.filter(elem => elem.id != '')
		.map( elem => {
			let valueS = elem.querySelector("esselunga-product-label > p > span").textContent
			let value = parseFloat(valueS.split(' ')[0].replaceAll(',', '.'))
			// console.log(valueS, value)
			let newElem = {"id": elem.id, "value" : value}; 
			// console.log(newElem)
			return newElem
		})
		.sort((a, b) => b.value - a.value);

	items.forEach( elem => {
		var node = document.getElementById(elem.id).parentElement.parentElement;
		var padre = node.parentElement;
		padre.insertBefore(node, padre.firstChild);
		// console.log(node);
	})
	
	Observe();
	// console.log(items);
	log("Sort done")
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
