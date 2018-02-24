function openInNewTab(uri) {
	// document.writeln(link.href + " - " + link.text);
	chrome.tabs.create({ url: uri });
}

function validateLinks(links) {
	//var rlinks = Array.prototype.slice.call(links).reverse();
	for (var i in links) {
		openInNewTab(links[i]);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	// document.writeln("DOMContentLoaded - Ok");
	chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
		var tabId = tab[0].id;

		chrome.tabs.executeScript(null, { file: "contentScript.js" }, function (result) {
			// document.writeln("executeScript - Ok");
			chrome.tabs.sendMessage(tabId, {}, {}, function (result) {
				// document.writeln("sendMessage - Ok");
				validateLinks(result);
			});
		});

	});
}, false);

console.log("chrome.runtime.onMessageExternal.addListener");

chrome.runtime.onMessageExternal.addListener(
	function (request, sender, sendResponse) {
		console.log("received", request, sender, sendResponse);
		chrome.tabs.create({ url: request.url, windowId : sender.tab.windowId, active : false });
	});