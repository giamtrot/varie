chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
	console.log("onMessage", message, sender)

	if (message.action === "openTab") {
		console.log("openTab", message)

		var window = await creaTab(message.data.url)
		sendResponse(window);	

	} else if (message.action === "loadScripts" && sender.tab && sender.tab.id !== undefined) {
		console.log("loadScripts", message.files, sender.tab.id)
		chrome.scripting.executeScript({
			target: { tabId: sender.tab.id },
			files: message.files,
			world: message.world
		});
		sendResponse("done: " + message.action);
	}

	sendResponse("error: handler not found for " + message.action);


});

async function creaTab(url: string) {
	const tab = await chrome.tabs.create({
		url: url,
		active: false
	});
	const windowId = tab.windowId;
	const window = await chrome.windows.get(windowId);
	// Riferimento alla finestra del tab appena creato
	const tabWindow = window;
	console.log("tabWindow", tabWindow)
	
}