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

// Function to perform the periodic operation
function performTask() {
	console.log("Executing periodic operation at", new Date().toLocaleTimeString());
	const filename = "session.txt"

	chrome.tabs.query({}, (tabs) => {
		console.log("tabs", tabs)
		const urls = tabs.map((tab) => tab.url).join("\n");
		console.log("urls", urls)
		const blob = new Blob([urls], { type: "text/plain" });

		const reader = new FileReader();
		chrome.downloads.search({ filename: filename }, (results) => {
			if (results.length > 0) {
				chrome.downloads.erase({ id: results[0].id });
			}
			const dataUrl = reader.result as string;

			// Now download the new file
			chrome.downloads.download({
				url: dataUrl,
				filename: filename,
				saveAs: false
			});

		});

		reader.readAsDataURL(blob);
	});


}

// Set up an alarm to trigger periodically
chrome.alarms.create("periodicTask", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "periodicTask") {
		performTask();
	}
});

console.log("Background script loaded.");
