chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bolder-root",
        title: "Bolder",
        contexts: ["selection"]
    });

    const styles = [
        { id: "bold", title: "Bold" },
        { id: "italic", title: "Italic" },
        { id: "boldItalic", title: "Bold Italic" },
        { id: "serifBold", title: "Serif Bold" },
        { id: "serifItalic", title: "Serif Italic" },
        { id: "serifBoldItalic", title: "Serif Bold Italic" }
    ];

    styles.forEach(style => {
        chrome.contextMenus.create({
            id: `bolder-${style.id}`,
            parentId: "bolder-root",
            title: style.title,
            contexts: ["selection"]
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.toString().startsWith("bolder-") && tab && tab.id) {
        const style = info.menuItemId.toString().replace("bolder-", "");
        chrome.tabs.sendMessage(tab.id, { action: "convert", style: style });
    }
});
