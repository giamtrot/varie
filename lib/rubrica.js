var hidden = JSON.parse(localStorage.getItem("hidden") || "{}");
console.log( hidden );
document.querySelectorAll("tr").forEach( function(it) { 
	var tdCognome = it.querySelector("td:nth-of-type(1)"); 
	var tdNome = it.querySelector("td:nth-of-type(2)"); 
	if (tdNome != null && tdCognome != null) { 
		var onclick = it.getAttribute("onclick");
		onclick = onclick.replace("_self", "_blank");
		it.setAttribute("onclick", onclick);
		
		var nome = tdNome.innerText;
		var cognome = tdCognome.innerText;
		if ( hidden[cognome] != undefined && hidden[cognome][nome] != undefined ) {
			it.style.display = "none";
			return;
		}
		
		var onclick2 = it.getAttribute("onclick");
		onclick2 = onclick2.replace("javascript:window.open('./details.aspx", "./getImage.aspx");
		onclick2 = onclick2.replace("','_self')", "");
		var row = it;
		var x = row.insertCell(2);
		x.innerHTML = "<img height='100px' src='" + onclick2 + "'>";
			
		tdCognome.style.color = "#dfeaf4"; 
		tdCognome.addEventListener("mouseenter", function( event ) { 
			tdCognome.style.color = "black"; 
		}); 
		tdCognome.addEventListener("mouseleave", function( event ) { 
			tdCognome.style.color = "#dfeaf4"; 
		}); 
		
		tdNome.style.display = "none"; 
		tdNome.addEventListener("mouseenter", function( event ) { 
			tdNome.style.color = "black"; 
			tdNome.style.display = "block"; 
		}); 
		tdNome.addEventListener("mouseleave", function( event ) { 
			tdNome.style.display = "none"; 
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