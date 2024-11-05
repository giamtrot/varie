chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log("onMessage", message, sender, sendResponse)
	handleMessage(message, sender, sendResponse);

	// Return true to indicate that sendResponse will be called asynchronously
	return true;
});

async function handleMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	try {
		if (message.action === "loadScripts") {
			await loadScriptsHandler(message, sender, sendResponse);
			sendResponse({ success: true, message: "done " + message.action });
		} else if (message.action === "createTabFromHtml") {
			const window = await createTabFromHtmlHandler(message.data.title, message.data.html);
			sendResponse({ success: true, message: "done " + message.action })
		} else if (message.action === "openTab") {
			await openTabHandler(message);
		} else {
			sendResponse({ success: false, message: "error: handler not found for " + message.action })
		}
	} catch (error) {
		sendResponse({ success: false, data: error });
	}
}

async function createTabFromHtmlHandler(title: string, html: string) {


	const tab = await chrome.tabs.create({
		url: 'https://www.example.com/',
		active: false
	})

	if (!tab.id) {
		console.error('Tab ID is undefined');
		return;
	}

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: function (title, html) {
			document.title = title
			document.body.innerHTML = html
		},
		args: [title, html]
	});

}


function loadScriptsHandler(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	if (!sender.tab || sender.tab.id == undefined) {
		sendResponse("error: loadScripts failed because sender.tab is not found");
		console.log(sender)
		return
	}

	console.log("loadScripts", message.files, sender.tab.id);
	chrome.scripting.executeScript({
		target: { tabId: sender.tab.id },
		files: message.files,
		world: message.world
	});
	sendResponse("done: " + message.action);
}

async function openTabHandler(message: any) {
	console.log("openTab", message);

	const tab = await chrome.tabs.create({
		url: message.data.url,
		active: false
	});

	return tab

}

