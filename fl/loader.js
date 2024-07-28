document.onload = document.onreadystatechange = function() {

    console.log("loader.js")

	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        loadScripts(['loadPage.js', 'content.js'])
	};
};

function loadScripts(files) {
    chrome.runtime.sendMessage({files: files}, function(response) {
        console.log(response)
    });
}
  

