'use strict'
		
var script     = document.createElement('script');
	script.src = 'https://code.jquery.com/jquery.js';

var head = document.getElementsByTagName('head')[0],
done = false;

// Attach handlers for all browsers
script.onload = script.onreadystatechange = function() {

	if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
	
		done = true;
		
		main();
		
		script.onload = script.onreadystatechange = null;
		head.removeChild(script);
		
	};

};
		
head.appendChild(script);

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

var iframeIdPrefix = "iframe_rg_";
var length;
var index = 0;

var move = function move(delta) {
	index += delta;
	$("#" + iframeIdPrefix + index)[0].scrollIntoView()
}
		
	
var moveNext = function moveNext() {
	if (index >= length - 1)
		return false;
	
	move(+1);
	return true;
}
		
var movePrevious = function movePrevious() {
	if (index <= 0)
		return false;
  
	move(-1);
	return true;
}

var createIframe = function createIframe(base, pos, link) {
	
	var info = (pos + 1) + "/" + length;
	var id = iframeIdPrefix + pos;
	
	var iframe = "<iframe id='" + id + "'>";
	$("<div class='container'><span id='info" + id + "' class='tag'>" + info + "</span>" + iframe + "</div>").insertAfter(base);
	base = $("#" + id);
	base.attr("src", link);
	base.css({
		"display" : "block", 
		"margin-left" : "auto",
		"margin-right" : "auto",
		"max-height" : window.screen.availHeight - 200, 
		"max-width" : window.screen.availWidth,
		"width" : "95%",
		"height" : window.screen.availHeight - 200
	});
	  
	$("#info" + id).position.top = base.position.top;
	
	return base;
}

var main = function main() {
	var links = getLinks();
	clear();
	console.clear();
	document.body.style.margin = "0px";

	length = links.length;
	
	var base = $("body");
	for (var i  = 0; i < length; ++i) {
		base = createIframe( base, i, links[i] );
	}

	$(".tag").css( {
		"float": "left",
		"position": "absolute",
		"left": "0px",
		"z-index": "1000",
		"background-color": "#92AD40",
		"padding": "5px",
		"color": "#FFFFFF",
		"font-weight": "bold"
	});
	
	move(0);

	$( "body" ).keydown(function( event ) {
		switch(event.which) 
		{
			case 38 : //Arrow up
				if (movePrevious())
					event.preventDefault();
				break;
			case 40 : //Arrow down
				if (moveNext())
					event.preventDefault();
				break;
		}
	});
}