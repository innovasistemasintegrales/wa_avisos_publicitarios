const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});


/*JS para Cliente*/
 
document.getElementById('saveWebsite').addEventListener('click', function() {
    var websiteName = document.getElementById('websiteName').value;
    var websiteUrl = document.getElementById('websiteUrl').value;

    if (websiteName && websiteUrl) {
        // Crear un nuevo enlace de sitio web
        var newWebsite = document.createElement('div');
        newWebsite.innerHTML = '<a href="' + websiteUrl + '">' + websiteName + '</a>';

        // Agregar el nuevo enlace al panel de sitios web
        document.getElementById('websitePanel').appendChild(newWebsite);

        // Cerrar el modal
        var modal = bootstrap.Modal.getInstance(document.getElementById('addWebsiteModal'));
        modal.hide();

        // Limpiar el formulario
        document.getElementById('websiteForm').reset();
    }
});