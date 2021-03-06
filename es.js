var getLinks = function getLinks() {
	
	if (document.location.href.indexOf("corriere.it") >= 0) {
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
		console.log(href);
		var p = li.querySelectorAll("div.hideDescription > p")[0];
		// console.log(p);
		var text = p != null ? p.textContent : "";
		// console.log(text);
		var html = '<img src=http:"' + href + '"><p>' + text + '</p>';
		var uri = "data:text/html," + html; //encodeURIComponent(html);
		// console.log(link);
		links.push(uri);
	}
	
	return links;
};


function openInNewTab(uri) {
	console.log(uri);
	var iframe = document.createElement("iframe");
	iframe.src = uri;
	iframe.width = "1000px";
	iframe.height = "1000px";
	document.querySelector("body").appendChild(iframe);
}




function validateLinks(links) {
	//var rlinks = Array.prototype.slice.call(links).reverse();
	for (var i in links) {
		openInNewTab( links[i] );
	}
}

console.clear();
var links = getLinks();
validateLinks( links );
