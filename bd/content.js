console.log("BD - 2021.03.14-1")

document.onload = document.onreadystatechange = function() {

	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        console.log("Starting Sort")
		var sorter = document.querySelector("#customselect__list-0 > li:nth-child(6)")
		if (sorter)
			sorter.click();
		var sorter = document.querySelector("#customselect__list-0 > li:nth-child(6)")
		if (sorter)
			sorter.click();
		console.log("Sort done")
	};

};

