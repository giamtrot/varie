(async () => {
    const src = chrome.runtime.getURL("dist/content.js");
    await import(src);
})();
