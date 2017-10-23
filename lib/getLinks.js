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
	
	// console.clear();
		
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
		// console.log(text);
		// console.log(encodeURIComponent(text));
		
		let style = 'font-family: "title-bold"; font-size: 18px; line-height: 19px; text-align: justify; color: #363a3e;';
	
		var html = '<html><body style="margin: 0px; zoom: 0.7"><div style="height: 90%; width: 90%;"><img src="' + href + '"><p style=\'' + style + '\'>' + text + '</p></div></body></html>';
		var uri = "data:text/html;charset=UTF-8," + encodeURIComponent(html);
		// console.log(uri);
		links.push(uri);
				
		if (i > 10) {
			break;
		}
		// return links;
	}
	
	return links;
};

var clear = function clear() {
	
	var body = document.querySelector("body");
	while (body.firstChild) {
		body.removeChild(body.firstChild);
	}

	while (document.getElementsByTagName("link").length > 0) {
		var link = document.getElementsByTagName("link")[0];
		link.parentNode.removeChild(link);
	}
	
	while (document.getElementsByTagName("style").length > 0) {
		var link = document.getElementsByTagName("style")[0];
		link.parentNode.removeChild(link);
	}
}

var createIframe = function createIframe(link) {
	var iframe = document.createElement('iframe');

	iframe.src = link;
	iframe.width = "95%";
	iframe.height = window.screen.availHeight - 200;
	document.body.appendChild(iframe);
}

var links = getLinks();
clear();
console.clear();
document.body.style.margin = "0px";

for (var i  = 0; i < links.length; ++i) {
	createIframe( links[i] );
}
