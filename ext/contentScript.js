var version = "2018.02.25-1"
// var scriptUrl = 'http://localhost:9080/varie/lib/background.js';
var scriptUrl = 'https://rawgit.com/giamtrot/varie/master/lib/background.js';
console.log("contentScript.js: loading " + scriptUrl + " " + version);

var s=document.createElement('script'); 
s.setAttribute('src', scriptUrl); 
document.getElementsByTagName('body')[0].appendChild(s); 
void(s);

console.log("contentScript.js: loaded " + version);