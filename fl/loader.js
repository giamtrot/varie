document.onload = document.onreadystatechange = function() {

    console.log("loader.js")

	if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        // loadScripts(['loadPage.js', 'content.js'], "ISOLATED")
        loadScripts(['mustache.js', 'loadPage.js', 'content.js'], "MAIN")
	};
};

function loadScripts(files, world) {
    chrome.runtime.sendMessage({files: files, world: world}, function(response) {
        console.log(response)
    });
}
  


