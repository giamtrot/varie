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

function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}

var getLinks = function getLinks() {
	
	var refs = contains("a.copyright", "Bones");
	console.log(refs);
	
	refs.forEach( function(v, i) {
		var link = v.href;
		console.log(i + "/" + refs.length, link);
		var html = loadPage( link );
		var subIndexId = "rgSubIndex" + i;
		$("body").append("<div id='" + subIndexId + "' style='display:none' />");
		// console.log(html);
		$("#" + subIndexId)[0].innerHTML = html;
	});
	
	var link = "";
	document.querySelectorAll("a[href^='magnet']").forEach( function(v) {
		link += v.href + "\n";
	});
	
	console.log(link);
}

function loadPage(href) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}


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



var main = function main() {
	getLinks();
}