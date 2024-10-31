function log(...msg: (any)[]) {
	const date = new Date();
	const logMsg = [extId, " - ", date.toLocaleDateString(), date.toLocaleTimeString(), " - ", ...msg]
	console.log(...logMsg)
}

async function openTab(url: string) {
	window.postMessage({ action: "openTab", data: { url: url } }, "*");
}
