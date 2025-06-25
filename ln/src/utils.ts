function log(...msg: (any)[]) {
	const date = new Date();
	const logMsg = [EXT_ID, " - ", date.toLocaleDateString(), date.toLocaleTimeString(), " - ", ...msg]
	console.log(...logMsg)
}

async function openTab(url: string) {
	window.postMessage({ action: "openTab", data: { url: url } }, "*");
}

// function setLocalStorage(key: string, value: any) {
// 	localStorage.setItem(key, JSON.stringify(value));
// }

// function getLocalStorage(key: string) {
// 	const value = localStorage.getItem(key);
// 	if (value) {
// 		return JSON.parse(value);
// 	}
// 	return null;
// }

// function initLocalStorage(key: string, initValue: any) {
// 	if (!getLocalStorage(key)) {
// 		setLocalStorage(key, initValue);
// 	}
// }

const ARRAY_NAME = "rg-linkedin-map"

async function saveStorage(value: any) {
	await chrome.storage.local.set({ [ARRAY_NAME]: JSON.stringify(value) });
}

async function getStorage() {
	const value = await chrome.storage.local.get([ARRAY_NAME]);
	if (value[ARRAY_NAME]) {
		return JSON.parse(value[ARRAY_NAME]);
	}
	return null;
}

async function initStorage(initValue: any) {
	const value = await getStorage();
	if (!value) {
		saveStorage(initValue);
	}
}
