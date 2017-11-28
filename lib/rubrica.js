var hidden = JSON.parse(localStorage.getItem("hidden") || "{}");
console.log( hidden );
document.querySelectorAll("tr").forEach( function(it) { 
	var tdCognome = it.querySelector("td:nth-of-type(1)"); 
	var tdNome = it.querySelector("td:nth-of-type(2)"); 
	if (tdNome != null && tdCognome != null) { 
		var nome = tdNome.innerText;
		var cognome = tdCognome.innerText;
		if ( hidden[cognome] != undefined &&  hidden[cognome][nome] != undefined ) {
			it.style.display = "none";
			return;
		}
			
		tdNome.style.color = "#dfeaf4"; 
		tdNome.addEventListener("mouseenter", function( event ) { 
			tdNome.style.color = "black"; 
		}); 
		tdNome.addEventListener("mouseleave", function( event ) { 
			tdNome.style.color = "#dfeaf4"; 
		}); 
		var hide = function hide(event) {
			event.stopImmediatePropagation();		
			it.style.display = "none";
			if ( hidden[cognome] === undefined ) {
				hidden[cognome] = {};
			}
			hidden[cognome][nome] = true;
			localStorage.setItem("hidden", JSON.stringify(hidden));
		}
		tdCognome.addEventListener("dblclick", hide); 
		tdCognome.addEventListener("click", hide); 
	} 
});