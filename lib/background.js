console.log("background.js: loading");

var name = "background.js";
var thisScript = 
	Array.from(
		document.querySelectorAll("script"))
		.filter( 
			it => it.src.endsWith(name) 
		)[0].src;

var baseUrl = thisScript.substring(0, thisScript.length - name.length);

document.addEventListener('keyup', function(e) {
	
	if (e.ctrlKey && e.key == "P" && e.altKey) {
		document.querySelector("div[title='Stampa tutto']").click();
    }
	
	if (e.ctrlKey && e.key == "F1") {
		loadScript(baseUrl + "../lib/getLinks.js");
    }
	
}, false);

var loadScript = function loadScript(scriptUrl) {
	var s=document.createElement('script'); 
	s.setAttribute('src', scriptUrl); 
	document.getElementsByTagName('body')[0].appendChild(s); 
	void(s);
}

var formatTweetDeckSections = function formatTweetDeckSections() {
	if (document.location.href.indexOf("https://tweetdeck.twitter.com/") != 0) {
		return;
	}
	
	console.log("starting formatSections");
	var sections = document.querySelectorAll("section");
	console.log("contentScript.js: ", sections);
	if (sections.length === 0) {
		setTimeout(formatSections, 1000);
		return;
	}

	sections.forEach( function( it ) {
		it.style.width = "400px";
	});
	
	sections[0].querySelector("a[data-action='options']").click();
	sections[1].querySelector("a[data-action='options']").click();

	setTimeout(function() {
		sections[1].querySelector("span.column-head-title").innerText = "NBA";
		document.querySelectorAll("div.js-accordion-item").forEach( function(it) {
			it.style.display = 'none';
		});
		document.querySelectorAll("fieldset.js-thumb-size").forEach( function(it) {
			it.style.display = 'none';
		});
	}, 1000);
		
	
	window.onkeyup = function(e) {
		if (!e.ctrlKey) return;
		if (e.key != "c") return;
		document.querySelector("#container > div > section.js-column.column.column-type-home.will-animate.is-options-open > div > div:nth-child(1) > div.js-column-content.column-content.flex-auto.position-rel.flex.flex-column.height-p--100 > div.js-column-options-container.column-options.flex-shrink--0.z-index--1 > div.js-column-options > form > fieldset.accordion-divider-t.button-tray.padding-hs > button:nth-child(3)").click();
	};
};

if (document.readyState === "complete") {
	formatTweetDeckSections(); 
}
else {
	document.addEventListener("DOMContentLoaded", formatTweetDeckSections, false);
}

console.log("background.js: loaded");