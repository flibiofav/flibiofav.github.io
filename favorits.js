function oLink(nom, desti)
{
	this.nom = nom;
	this.desti = desti;
}

function oCategoria(titol, color_bg, color_tx, links)
{
	this.titol = titol;
	this.color_bg = color_bg;
	this.color_tx = color_tx;
	this.links = links;
}

function oLlistaCats(cats)
{
	this.llista = cats;
}

var xhttp = new XMLHttpRequest();
var objJSON;
var popup = document.getElementById("popup1");
var edit_items_display = 0; /* none */
var disp = "none";

xhttp.onreadystatechange = function()
{
	if (this.readyState == 4)
		CarregaJSON(this.responseText);
}
xhttp.open("GET", "favorits.json", true);
xhttp.send();

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}

function SaveJSON()
{
	var myJSON = JSON.stringify(objJSON);
	var myBlob = new Blob([myJSON], {type:"text/plain"});
	var myURL = window.URL.createObjectURL(myBlob);
	var dl = document.createElement("a");
    dl.download = "favorits.json";
    dl.href = myURL;
    dl.style.display = "none";
    document.body.appendChild(dl);
    dl.click();
	document.body.removeChild(dl);
}

function CarregaJSON(text)
{
	if (text == "")
	{
		alert("No s'ha pogut recuperar el fitxer");
		var llista = [];
		llista.push(new oCategoria("Categoria 1", "#FF8585", "#FFFFFF", []));
		objJSON = new oLlistaCats(llista);
		document.getElementById("save").style.visibility = "visible";
	}
	else
		objJSON = JSON.parse(text);
	DibuixaJSON();
}

function DibuixaJSON()
{
	var out = "";
	for (i=0; i < objJSON.llista.length; i++)
	{
		nomcat = objJSON.llista[i].titol;
		col_bg = objJSON.llista[i].color_bg;
		col_tx = objJSON.llista[i].color_tx;
		out += '<div class="flex-item" style="background-color:' + col_bg + '">';
		if (i > 0)
			out += '\n<span class="edit-items" id="lf-cat_' + i + '" onclick="DoEdit(this.id)">&#9664;</span>';
		if (i < (objJSON.llista.length - 1))
			out += '\n<span class="edit-items" id="rt-cat_' + i + '" onclick="DoEdit(this.id)">&#9654;</span>';
		out += '\n<span class="titol" style="color:' + col_tx + ';">' + nomcat + '</span>';
		out += '\n<span class="edit-items" id="e-cat_' + i + '" onclick="DoEdit(this.id)">&#9997;</span>';
		out += '\n<span class="edit-items" id="dl-cat_' + i + '" onclick="DoEdit(this.id)">&#10006;</span>';
		out += '\n<span class="edit-items" id="a-cat_' + i + '" onclick="DoEdit(this.id)">&#10010;</span>';
		out += '</p>';
		links = objJSON.llista[i].links;
		for (j=0; j < links.length; j++)
		{
			if (j > 0)
				out += '<span class="edit-items" id="up-elem_' + i + '_' + j + '" onclick="DoEdit(this.id)">&#9650;</span>\n';
			if (j < (links.length - 1))
				out += '<span class="edit-items" id="dw-elem_' + i + '_' + j + '" onclick="DoEdit(this.id)">&#9660;</span>\n ';
			out += '<a href="' + links[j].desti + '">' + links[j].nom + '</a>\n<span class="edit-items" id="e-elem_' + i + '_' + j + '" onclick="DoEdit(this.id)">&#9997;</span>\n<span class="edit-items" id="d-elem_' + i + '_' + j + '" onclick="DoEdit(this.id)">&#10006;</span><br>';
		}
		out += '<span class="edit-items" id="a-elem_' + i + '" onclick = "DoEdit(this.id)">&#10010;</span>';
		out += '</div>';
	}
	document.getElementById("capses").innerHTML = out;
	var elements = document.getElementsByClassName('edit-items');
	for(var i=0; i<elements.length; i++)
		elements[i].style.display = disp;
}

function DoEdit(id)
{
	var arr = id.split("_");

	switch(arr[0])
	{
		case "e-elem":
			TractarLink(1, arr[1], arr[2]);
			break;
		case "a-elem":
			TractarLink(2, arr[1], 0);
			break;
		case "d-elem":
			EsborrarLink(arr[1], arr[2]);
			break;
		case "up-elem":
			MoureLink(arr[1], arr[2], 1);
			break;
		case "dw-elem":
			MoureLink(arr[1], arr[2], 2);
			break;
		case "lf-cat":
			MoureCat(arr[1], 1);
			break;
		case "rt-cat":
			MoureCat(arr[1], 2);
			break;
		case "dl-cat":
			EsborrarCat(arr[1]);
			break;
		case "e-cat":
			TractarCat(1, arr[1]);
			break;
		case "a-cat":
			TractarCat(2, arr[1]);
			break;

	}
}

function TractarLink(op, c, l)
{
	if (op == 1) //editar link
	{
		var text = "Editar '" + objJSON.llista[c].links[l].nom + "'";
		var v1 = ' value="' + objJSON.llista[c].links[l].nom + '"';
		var v2 = ' value="' + objJSON.llista[c].links[l].desti + '"';
		var v3 = '<button name="' + c + '_' + l + '"';
	}
	else if (op == 2) //afegir link
	{
		var text = "Afegir enllaç a '" + objJSON.llista[c].titol + "'";
		var v1 = "";
		var v2 = "";
		var v3 = '<button name="' + c + '"';
	}
	document.getElementsByClassName("popup-content")[0].style.width = "354px";
	document.getElementById("popup_titol").innerHTML = text;
	document.getElementsByClassName("popup-header")[0].style.color = objJSON.llista[c].color_tx;
	document.getElementsByClassName("popup-body")[0].style.color = objJSON.llista[c].color_tx;
	document.getElementsByClassName("popup-header")[0].style.backgroundColor = objJSON.llista[c].color_bg;
	document.getElementsByClassName("popup-body")[0].style.backgroundColor = objJSON.llista[c].color_bg;
	document.getElementById("popup_cos").innerHTML = 'Nom:<br><input type="text" size=20 id="nou_nom"' + v1 + ' autofocus><br>Adreça:<br><input id="nou_desti" type="url" size = 50' + v2 + '><br><br>' + v3 + ' onclick="NouLink(this.name)">OK</button><p id="resultat"></p></div>';
	popup.style.display = "block";
}

function NouLink(nom)
{
	var arr = nom.split("_");
	var c = arr[0];
	var l = arr[1];
	var nou_nom = document.getElementById("nou_nom");
	if (nou_nom.value == "")
		document.getElementById("resultat").innerHTML = "El nom no pot estar a blancs";
	else
	{
		var nou_desti = document.getElementById("nou_desti");
		if (nou_desti.checkValidity() == false)
			document.getElementById("resultat").innerHTML = "L'adreça no és vàlida";
		else
		{
			if (arr.length == 1) //si l no està informat s'ha de crear un enllaç nou
				objJSON.llista[c].links.push(new oLink(nou_nom.value, nou_desti.value));
			else
			{
				objJSON.llista[c].links[l].nom = nou_nom.value;
				objJSON.llista[c].links[l].desti = nou_desti.value;
			}
			document.getElementById("save").style.visibility = "visible";
			TancarPopup();
			DibuixaJSON();
		}
	}
}

function EsborrarLink(c, l)
{
	if (confirm("Segur que vols esborrar \'" + objJSON.llista[c].links[l].nom + "\' de la categoria \'" + objJSON.llista[c].titol + "\'?") == true)
	{
		objJSON.llista[c].links.splice(l, 1);
		document.getElementById("save").style.visibility = "visible";
		DibuixaJSON();
	}
}

function MoureLink(c, l, d)
{
	if (d == 1) //dalt
	{
		var elem = objJSON.llista[c].links[l];
		objJSON.llista[c].links.splice(l, 1);
		objJSON.llista[c].links.splice(l - 1, 0, elem);
		DibuixaJSON();
		document.getElementById("save").style.visibility = "visible";
		return;
	}
	if (d == 2) //baix
	{
		var elem = objJSON.llista[c].links[l];
		objJSON.llista[c].links.splice(l, 1);
		objJSON.llista[c].links.splice(l + 1, 0, elem);
		DibuixaJSON();
		document.getElementById("save").style.visibility = "visible";
	}
}

function MoureCat(c, d)
{
	if (d == 1) //esquerra
	{
		var elem = objJSON.llista[c]
		objJSON.llista.splice(c, 1);
		objJSON.llista.splice(c - 1, 0, elem);
		DibuixaJSON();
		document.getElementById("save").style.visibility = "visible";
		return;
	}
	if (d == 2) //baix
	{
		var elem = objJSON.llista[c]
		objJSON.llista.splice(c, 1);
		objJSON.llista.splice(c + 1, 0, elem);
		DibuixaJSON();
		document.getElementById("save").style.visibility = "visible";
	}
}

function EsborrarCat(c)
{
	if (confirm("Segur que vols esborrar la categoria \'" + objJSON.llista[c].titol + "\'?") == true)
	{
		objJSON.llista.splice(c, 1);
		document.getElementById("save").style.visibility = "visible";
		DibuixaJSON();
	}
}

function TractarCat(op, c)
{
	if (op == 1) //editar categoria
	{
		var text = "Editar '" + objJSON.llista[c].titol + "'";
		var v1 = ' value="' + objJSON.llista[c].titol + '"';
	}
	else if (op == 2) //afegir categoria
	{
		var text = "Afegir categoria";
		var v1 = "";
	}
	document.getElementsByClassName("popup-content")[0].style.width = "200px";
	document.getElementById("popup_titol").innerHTML = text;
	document.getElementsByClassName("popup-header")[0].style.color = objJSON.llista[c].color_tx;
	document.getElementsByClassName("popup-body")[0].style.color = objJSON.llista[c].color_tx;
	document.getElementsByClassName("popup-header")[0].style.backgroundColor = objJSON.llista[c].color_bg;
	document.getElementsByClassName("popup-body")[0].style.backgroundColor = objJSON.llista[c].color_bg;
	var v2 = ' value="' + objJSON.llista[c].color_bg + '"';
	var v3 = ' value="' + objJSON.llista[c].color_tx + '"';
	var v4 = '<button name="' + op + '_' + c + '"';
	var upd = ' onchange="UpdateColor(this.id, this.value)"';
	var str = 	'Nom:<br>' +
				'<input type="text" size=20 id="nou_titol"' + v1 + ' autofocus><br>' +
				'Color de fons:<br>' +
				'<input type="text" id="nou_colbg_tx" size=7 pattern = "^#[0-9a-fA-F]{6}"' + v2 + upd + '><input id="nou_colbg" type="color"' + v2 + upd + '><br>' + 
				'Color de text:<br>' +
				'<input type="text" id="nou_coltx_tx" size=7 pattern = "^#[0-9a-fA-F]{6}"' + v3 + upd + '><input id="nou_coltx" type="color"' + v3 + upd + '><br>' +
				'<br>' + v4 + ' onclick="NouCat(this.name)">OK</button><p id="resultat"></p></div>';
	document.getElementById("popup_cos").innerHTML = str; 
	popup.style.display = "block";
}

function NouCat(nom)
{
	var arr = nom.split("_");
	var op = arr[0];
	var c = arr[1];
	var nou_titol = document.getElementById("nou_titol").value;
	if (nou_titol == "")
		document.getElementById("resultat").innerHTML = "El nom no pot estar a blancs";
	else
	{
		var nou_colbg_tx = document.getElementById("nou_colbg_tx");
		if (nou_colbg_tx.checkValidity() == false)
			document.getElementById("resultat").innerHTML = "El color de fons no té un format vàlid";
		else
		{
			var nou_coltx_tx = document.getElementById("nou_coltx_tx");
			if (nou_coltx_tx.checkValidity() == false)
				document.getElementById("resultat").innerHTML = "El color del text no té un format vàlid";
			else
			{
				if (op == 1) //editar la categoria actual
				{
					objJSON.llista[c].titol = nou_titol;
					objJSON.llista[c].color_bg = nou_colbg_tx.value;
					objJSON.llista[c].color_tx = nou_coltx_tx.value;
				}
				else //afegir categoria
				{
					cat = new oCategoria(nou_titol, nou_colbg_tx.value, nou_coltx_tx.value, []);
					objJSON.llista.splice(c + 1, 0, cat);
				}
			}
			document.getElementById("save").style.visibility = "visible";
			TancarPopup();
			DibuixaJSON();
		}
	}
}

function ToggleDisplay()
{
	if (edit_items_display == 1)
	{
		disp = 'none';
		edit_items_display = 0;
	}
	else
	{
		disp = 'inline';
		edit_items_display = 1;
	}
	var elements = document.getElementsByClassName('edit-items');
	for(var i=0; i<elements.length; i++)
		elements[i].style.display = disp;
}

function UpdateColor(id, col)
{
	if (id == "nou_colbg" || id == "nou_colbg_tx")
	{
		document.getElementsByClassName("popup-header")[0].style.backgroundColor = col;
		document.getElementsByClassName("popup-body")[0].style.backgroundColor = col;
		document.getElementById("nou_colbg").value = col;
		document.getElementById("nou_colbg_tx").value = col;
	}
	else if (id == "nou_coltx"  || id == "nou_coltx_tx")
	{
		document.getElementsByClassName("popup-header")[0].style.color = col;
		document.getElementsByClassName("popup-body")[0].style.color = col;
		document.getElementById("nou_coltx").value = col;
		document.getElementById("nou_coltx_tx").value = col;
	}
}

function TancarPopup()
{
	popup.style.display = "none";
}
