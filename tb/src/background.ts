import { encrypt } from "./crypt";


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
	const filename = `tab/session_${formatDate(new Date())}.txt`;

	chrome.tabs.query({}, (tabs) => {
		// console.log("tabs", tabs)
		const urls = tabs.map((tab) => tab.url).join("\n");
		// console.log("urls", urls)
		// const encoded = encodeBase64(urls);
		const encoded = encrypt(urls);
		console.log("Encoded:", encoded);

		const blob = new Blob([encoded], { type: "text/plain" });

		const reader = new FileReader();
		reader.onloadend = function () {
			const dataUrl = reader.result as string;
			console.log("downloading", filename, dataUrl)

			chrome.downloads.download({
				url: dataUrl,
				filename: filename,
				saveAs: false  // Set to true if you want the "Save As" prompt
			});

		};

		reader.readAsDataURL(blob);
	});
}

function formatDate(date: Date): string {
	const pad = (num: number) => String(num).padStart(2, "0");

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1); // Months are 0-based
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}




performTask()

const TASK_NAME = "periodicTask";
// Set up an alarm to trigger periodically
chrome.alarms.create(TASK_NAME, { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === TASK_NAME) {
		performTask();
	}
});

console.log("Background script loaded.");
