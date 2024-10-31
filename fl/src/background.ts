chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log("onMessage", message, sender)

	if (message.action === "openTab") {
		console.log("openTab", message)
		chrome.tabs.create({
			url: message.data.url,
			active: false  // Questo apre il tab in background
		});
	} else if (message.action === "loadScripts" && sender.tab && sender.tab.id !== undefined) {
		console.log("loadScripts", message.files, sender.tab.id)
		chrome.scripting.executeScript({
			target: { tabId: sender.tab.id },
			files: message.files,
			world: message.world
		});
	} else {
		console.error('Sender is not a tab');
	}
	sendResponse("done: " + message.action);
});