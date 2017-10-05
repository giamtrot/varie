var getLinks = function getLinks() {
	
	if (document.location.href.indexOf("www.corriere.it") >= 0) {
		return corriere();
	}
	
	var links = [];
	var count = document.querySelectorAll(".sk-gallery-info h4")[0].textContent.split("/")[1];
	var start = document.querySelectorAll(".sk-gallery-next")[0].href;
	var base = start.substring(0, start.lastIndexOf("/") + 1);
	var page = parseInt(start.substring(start.lastIndexOf("/") + 1))
	
	var text = "";
	for (var i = 0; i < count - 1; i++ ) {
		var link = base + ( page + i );
		links.push(link);
	}
	return links;
};

var corriere = function corriere() {
	
	var links = [];
	var lis = document.querySelectorAll("ul.slideshow > li");
	
	for (var i  = 0; i < lis.length; ++i) {
		var li = lis[i];
		// console.log(li);
		var img = li.querySelectorAll("a.img_container > img")[0];
		// console.log(img);
		var href = img.attributes.getNamedItem("data-original").value;
		if (href.startsWith("//")) { 
			href = "http:" + href; 
		}
		// console.log(href);
		
		var p = li.querySelectorAll("div.hideDescription > p")[0];
		// console.log(p);
		var text = p != null ? p.textContent : "";
		text = "La cicogna nera (Ciconia nigra) è una versione scura della più nota cicogna bianca. Rarissima in tuta Europa è ancor più rara in Italia. Una decina di coppie nidifica in Basilicata e la sua silhouette si può avvistare nei pressi di Matera, riconoscibile per il petto bianco, le lunghe ali nere e il collo affusolato proteso in avanti (Wwf)";
		console.clear();
		console.log(text);
		console.log(encodeURIComponent(text));
		
		let style = 'font-family: "title-bold"; font-size: 18px; line-height: 19px; text-align: justify; color: #363a3e;';
	
		var html = '<img src="' + href + '"><p style=\'' + style + '\'>' + text + '</p>';
		var uri = "data:text/html;charset=UTF-8," + encodeURIComponent(html);
		// console.log(uri);
		links.push(uri);
		return links;
	}
	
	return links;
};


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(new Date() + " - called");
	sendResponse(getLinks());
});
console.log(new Date() + " - ES installed");
