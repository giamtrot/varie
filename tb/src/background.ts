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

let cont = 0;

// Function to perform the periodic operation
function performTask(reason: string) {
	cont++
	console.log(reason, "Executing periodic operation at", new Date().toLocaleTimeString());
	console.log("chrome.runtime.id", chrome.runtime.id)
	const filename = `tab/session_${formatDate(new Date())}.txt`;

	chrome.tabs.query({}, (tabs) => {
		console.log("query tabs", tabs)
		const urls = tabs.map((tab) => tab.url).join("\n");
		// console.log("urls", urls)
		// const encoded = encodeBase64(urls);
		let encoded = encrypt(urls);

		encoded += "\n\nCont: " + cont + "\nReason: " + reason + "\nId: " + chrome.runtime.id;
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

const TASK_NAME = "TAB_periodicTask";

chrome.alarms.getAll(alarms => {
	console.log("Alarms:", alarms);
	const alarmExists = alarms.some(alarm => alarm.name === TASK_NAME);
	if (alarmExists) {
		console.log("L'allarme esiste già.");
	} else {
		console.log("L'allarme non esiste.");
		performTask("first time");
		chrome.alarms.create(TASK_NAME, { periodInMinutes: 5 });
	}
});


chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === TASK_NAME) {
		performTask("periodic");
	}
});

console.log("Background script loaded.");
