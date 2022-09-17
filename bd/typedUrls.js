function clearHistory() {

	console.log("clearHistory");
	
	var listHistoryItems = function(historyItems) {
		if (historyItems.length == 0) 
			document.writeln("<li>Nothing found");
		for (var i = 0; i < historyItems.length; ++i) {
			var url = historyItems[i].url;
			document.writeln("<li>Removing " + url);
			chrome.history.deleteUrl({'url': url});
		}
    }
	
	
	chrome.history.search(
		{ 'text': 'bennet', 'maxResults': 100000, 'startTime': 0  },
		listHistoryItems
	);
	
}

document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("clearButton");
  button.addEventListener('click', clearHistory);
});