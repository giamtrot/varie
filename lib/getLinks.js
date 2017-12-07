'use strict'
		
console.clear();
		
var script     = document.createElement('script');
	script.src = 'https://code.jquery.com/jquery.js';

var head = document.getElementsByTagName('head')[0],
done = false;

// Attach handlers for all browsers
script.onload = script.onreadystatechange = function() {

	if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
	
		done = true;
		
		main();
	};

};
		
head.appendChild(script);

var getLinks = function getLinks() {
	
	if (document.location.href.indexOf("corriere.it") >= 0) {
		return corriere();
	}
	
	if (document.querySelectorAll(".sk-gallery-info h4").length > 0) {
		return altro();	
	}
	
	return links();
	
};

var links = function links() {
	var links = [];
	var subIndexIds = [];
	var headerLinks = document.querySelectorAll(".headerLinks > a");
	var count = headerLinks.length;
	
	for (var i = 0; i < count; i++ ) {
		console.log( headerLinks[i].href );
		var subIndexHref = headerLinks[i].href.toLowerCase();
		try {
			var html = loadPage( subIndexHref );
		}
		catch (e) {}
		var subIndexId = "rgSubIndex" + i;
		$("body").append("<div id='" + subIndexId + "' style='display:none' />");
		// // console.log(html);
		$("#" + subIndexId)[0].innerHTML = html;
	}
	
	var fullName = findSource() + "altro.html";
	// console.log( fullName );
	
	var suffix = ".jpg";
	
	document.querySelectorAll("a").forEach( 
		function(v) {
			var href = v.href;
			if (href == undefined) {
				return false;
			}
			// console.log(href);
			if (href.toLowerCase().indexOf(suffix, href.length - suffix.length) !== -1) {
			// var html = '<html><body style="margin: 0px; zoom: 0.7"><img style="height: 90%;" src="' + v.src + '"></body></html>';
				var uri = fullName + "?" + encodeURIComponent(document.location.href) + "?" + encodeURIComponent(href); //"data:text/html;charset=UTF-8," + encodeURIComponentComponent(html);
				links.push(uri);
			}
		}
	);
	
	return links;
}

var getBase = function getBase(src) {
	return src.substring(0, src.lastIndexOf("/") + 1);
}

var altro = function altro() {
	var links = [];
	var count = document.querySelectorAll(".sk-gallery-info h4")[0].textContent.split("/")[1];
	var next = document.querySelectorAll(".sk-gallery-next")[0].href;
	
	var text = "";
	for (var i = 0; i < count - 1; i++ ) {
		var html = loadPage( next );
		var subIndexId = "rgSubIndex" + i;
		$("body").append("<div id='" + subIndexId + "' style='display:none' />");
		// console.log(html);
		$("#" + subIndexId)[0].innerHTML = html;
		next = document.querySelectorAll("#" + subIndexId + " .sk-gallery-next")[0].href;
	}
	
	var fullName = findSource() + "altro.html";
	console.log( fullName );
	
	document.querySelectorAll(".sk-gallery-content > img").forEach( 
		function(v) {
			console.log(v);
			// var html = '<html><body style="margin: 0px; zoom: 0.7"><img style="height: 90%;" src="' + v.src + '"></body></html>';
			var uri = fullName + "?" + encodeURIComponent(document.location.href) + "?" + encodeURIComponent(v.src); //"data:text/html;charset=UTF-8," + encodeURIComponentComponent(html);
			links.push(uri);
		}
	);
  
	return links;
}

function loadPage(href) {
	log("loading " + href);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
	
	if (xmlhttp.status == 200) {
		log("loaded " + href);
		return xmlhttp.responseText;
	}
	
	log("failed loading of " + href);
	return loadPage(href);
}

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
		// console.log(text);
		// console.log(encodeURIComponentComponent(text));
		
		let style = 'font-family: "title-bold"; font-size: 18px; line-height: 19px; text-align: justify; color: #363a3e;';
	
		var html = '<html><body style="margin: 0px; zoom: 0.7"><div style="height: 90%; width: 90%;"><img src="' + href + '"><p style=\'' + style + '\'>' + text + '</p></div></body></html>';
		var uri = "data:text/html;charset=UTF-8," + encodeURIComponentComponent(html);
		// console.log(uri);
		links.push(uri);
				
		// if (i > 10) {
			// break;
		// }
	}
	
	return links;
};

var clear = function clear() {
	
	var body = document.querySelector("body");
	$(body).css({
		"background": ""
	});
	
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

var getLogDivId = function getLogDivId() {
	return "logDivRg";
}

var getLogDiv = function getLogDiv() {
	return $("#" + getLogDivId());
}

var createLogDiv = function createLogDiv(base) {
	
	var divHtml = "<div id='" + getLogDivId() + "'>";
	$(document.body).append(divHtml);
	getLogDiv().css({
		"position": "fixed", 
		"top": "0", 
		"width": "100%",
		"z-index": "1000",
		"background-color": "white"
	});
}

var log = function log(msg) {
	console.log(msg);
	getLogDiv().html( getLogDiv().html() + "<span>" + msg + "</span><br />" );
}

var createIframe = function createIframe(pos, links, onComplete) {
	
	// console.log(links);
	var info = (pos + 1) + "/" + length;
	var id = iframeIdPrefix + pos;
	
	var iframe = "<iframe id='" + id + "'>";
	$(document.body).append("<div class='container'><span id='info" + id + "' class='tag'>" + info + "</span>" + iframe + "</div>");
	var newBase = $("#" + id);
	var link = links.shift();
	newBase.css({
		"display" : "block", 
		"margin-left" : "auto",
		"margin-right" : "auto",
		"max-height" : window.screen.availHeight - 200, 
		"max-width" : window.screen.availWidth,
		"width" : "95%",
		"height" : window.screen.availHeight - 200
	});
	
	newBase.attr("src", link);
	$("#info" + id).position.top = newBase.position.top;
	var nextStep = links.length == 0 ? 
		onComplete :
		function(){
			createIframe( pos + 1, links, onComplete );
		};
		
	newBase.load(nextStep);
}

var findSource = function findSource() {
	var mySelfSrc = document.querySelectorAll("script[src$='getLinks.js']")[0].src;
	return getBase( mySelfSrc );
}


var main = function main() {
	var base = $("body");
	createLogDiv(base);
	var links = getLinks();
	// return;
	clear();
	document.body.style.margin = "0px";

	length = links.length;
	
		
	createIframe( 0, links, function() {
		var rule = { 
			"float": "left",
			"position": "absolute",
			"left": "0px",
			"z-index": "1000",
			"background-color": "#92AD40",
			"padding": "5px",
			"color": "#FFFFFF",
			"font-weight": "bold"
		};
		
		$(".tag").css( rule );
		move(0);
	});

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