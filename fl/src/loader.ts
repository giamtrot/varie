document.onreadystatechange = (document as any).onload = function (this: Document) {

    console.log("loader.js")

    if ((!this.readyState || this.readyState == 'complete')) {
        loadScripts(['content.bundle.js'], "MAIN")
        window.addEventListener("message", forwardOpenTab );
    };
};


function forwardOpenTab(event: MessageEvent<any>)  {
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


