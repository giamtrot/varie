import { EXT_ID } from "./content";

export function log(...msg: (any)[]) {
	const date = new Date();
	const logMsg = [EXT_ID, " - ", date.toLocaleDateString(), date.toLocaleTimeString(), " - ", ...msg]
	console.log(...logMsg)
}

export async function openTab(url: string) {
	window.postMessage({ action: "openTab", data: { url: url } }, "*");
}

export function setLocalStorage(key: string, value: any) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage(key: string) {
	const value = localStorage.getItem(key);
	if (value) {
		return JSON.parse(value);
	}
	return null;
}

export function initLocalStorage(key: string, initValue: any) {
	if (!getLocalStorage(key)) {
		setLocalStorage(key, initValue);
	}
}
