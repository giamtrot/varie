const ARRAY_NAME = "rg-linkedin-map"
const GET_STORAGE_API = "GET_STORAGE_API"
const SAVE_STORAGE_API = "SAVE_STORAGE_API"

if (chrome.runtime) {

	chrome.runtime.onMessage.addListener(loadScriptsHandler)
	chrome.runtime.onMessage.addListener(getStorageHandler)
	chrome.runtime.onMessage.addListener(saveStorageHandler)
	// 	if (message.action === "openTab") {
	// 		console.log("openTab", message)
	// 		chrome.tabs.create({
	// 			url: message.data.url,
	// 			active: false  // Questo apre il tab in background
	// 		});
	// 		sendResponse("done: " + message.action);
}

class StorageMap {
	fieldName: string;
	value: any;

	constructor(fieldName: string) {
		this.fieldName = fieldName;
		this.value = {};
	}
}

function saveStorageHandler(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	console.log("saveStorageHandler", message, sender)

	if (message.action !== SAVE_STORAGE_API) {
		return
	}

	console.log(SAVE_STORAGE_API, message);

	const map: StorageMap = message.data.value

	chrome.storage.local.set({ [map.fieldName]: map.value }, function () {
		console.log(message.action, "done");
		sendResponse("done: " + message.action);
	});

	return true; // Se usi setTimeout, fetch, chrome.storage, o qualsiasi cosa asincrona, devi restituire true
}

function getStorageHandler(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	console.log("getStorageHandler", message, sender)

	if (message.action !== GET_STORAGE_API) {
		return
	}

	console.log(GET_STORAGE_API, message);
	const map = new StorageMap(message.data.fieldName)

	chrome.storage.local.get([map.fieldName], function (result) {
		console.log(message.action, "result", result);
		map.value = result || {}
		console.log(message.action, "map", map);
		sendResponse(map);
	});

	return true; // Se usi setTimeout, fetch, chrome.storage, o qualsiasi cosa asincrona, devi restituire true
}

function loadScriptsHandler(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
	console.log("loadScriptsHandler", message, sender)

	if (message.action !== "loadScripts" || sender?.tab?.id == undefined)
		return;

	console.log("loadScripts", message.files, sender.tab.id);
	chrome.scripting.executeScript({
		target: { tabId: sender.tab.id },
		files: message.files,
		world: message.world
	});
	sendResponse("done: " + message.action);

}

async function getStorage(): Promise<StorageMap> {
	log("getStorage");
	return callAPI(GET_STORAGE_API, { fieldName: ARRAY_NAME }) as Promise<StorageMap>;
}


async function saveStorage(value: StorageMap) {
	log("saveStorage", value);
	return callAPI(SAVE_STORAGE_API, value);
}

async function callAPI(api: string, data: any) {
	const returnMessage = api + "Response";

	return new Promise((resolve) => {
		function handler(event: MessageEvent<any>) {
			if (event.source !== window || event.data.action !== returnMessage) return;
			window.removeEventListener("message", handler);
			console.log(returnMessage, event);
			resolve(event.data.data);
		}
		window.addEventListener("message", handler);
		log("callAPI", api, data);
		window.postMessage({ action: api, data: data }, "*");
	});
}