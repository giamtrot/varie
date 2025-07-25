document.onreadystatechange = (document as any).onload = function (this: Document) {

    console.log("loader.js")

    if ((!this.readyState || this.readyState == 'complete')) {
        initAPI("GET_STORAGE_API")
        initAPI("SAVE_STORAGE_API")

        loadScripts(['background.js', 'utils.js', 'content.js'], "MAIN")
        window.addEventListener("message", forwardOpenTab);
    };
};

function initAPI(api: string) {
    console.log("loader - initAPI", api);

    const returnMessage = api + "Response";
    window.addEventListener("message", function (event: MessageEvent<any>) {
        if (event.source !== window || !event.data.action || event.data.action !== api) return;

        console.log("loader", api, event);

        chrome.runtime.sendMessage(event.data, function (response) {
            console.log("loader", returnMessage, response);
            // Send the response back to the page context
            window.postMessage({ action: returnMessage, data: response }, "*");
        });

    });
}

function forwardOpenTab(event: MessageEvent<any>) {
    if (event.source !== window || !event.data.action || event.data.action !== "openTab") return;

    console.log("loader.js", event);

    // forward to background script
    chrome.runtime.sendMessage(event.data, function (response) {
        console.log(response);
    });
}

function loadScripts(files: string[], world: string) {
    chrome.runtime.sendMessage({ action: "loadScripts", files: files, world: world }, function (response) {
        console.log(response)
    });
}


