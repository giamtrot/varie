chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message, sender)
	chrome.scripting.executeScript({
		target : {tabId : sender.tab.id},
		files : message.files,
	});
	sendResponse("done");
});

