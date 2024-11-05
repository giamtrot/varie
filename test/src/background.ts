chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log("onMessage", message, sender, sendResponse)
	handleMessage(message, sender, sendResponse);

	// Return true to indicate that sendResponse will be called asynchronously
	return true;
});

async function handleMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	try {
		if (message.action === "loadScripts") {
			await loadScriptsHandler(message, sender);
			sendResponse({ success: true, message: "done " + message.action });
		} else if (message.action === "createTabFromHtml") {
			await createTabFromHtmlHandler(message.data.title, message.data.html);
			sendResponse({ success: true, message: "done " + message.action })
		} else if (message.action === "openTab") {
			await openTabHandler(message);
			sendResponse({ success: true, message: "done " + message.action })
		} else {
			sendResponse({ success: false, message: "error: handler not found for " + message.action })
		}
	} catch (error) {
		sendResponse({ success: false, message: "error executing " + message.action, data: error });
	}
}

async function createTabFromHtmlHandler(title: string, html: string) {


	const tab = await chrome.tabs.create({
		url: 'https://www.example.com/',
		active: false
	})

	if (!tab.id) {
		throw new Error('Tab ID is undefined');
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


async function loadScriptsHandler(message: any, sender: chrome.runtime.MessageSender) {
	if (!sender.tab || sender.tab.id == undefined) {
		throw new Error("loadScripts failed because sender.tab is not found")
	}

	console.log("loadScripts", message.files, sender.tab.id);
	chrome.scripting.executeScript({
		target: { tabId: sender.tab.id },
		files: message.files,
		world: message.world
	});
}

async function openTabHandler(message: any) {
	console.log("openTab", message);

	const tab = await chrome.tabs.create({
		url: message.data.url,
		active: false
	});

	return tab

}

