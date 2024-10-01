const inputs = document.querySelectorAll(".input");


inputs.forEach(input => {
    input.addEventListener('focus', function() {
        // Añade la clase 'focus' al contenedor padre cuando el input tiene foco
        let parent = this.parentNode.parentNode;
        parent.classList.add('focus');
    });

    input.addEventListener('blur', function() {
        // Si el input está vacío al perder el foco, quita la clase 'focus'
        if (this.value === "") {
            let parent = this.parentNode.parentNode;
            parent.classList.remove('focus');
        }
    });
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