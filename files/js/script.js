document.addEventListener('DOMContentLoaded', function() {
    // Selector de inputs
    const inputs = document.querySelectorAll(".input");

    // Agregar listeners a cada input
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

    // Listener para el botón 'saveWebsite'
    document.getElementById('savePostButton').addEventListener('click', function() {
        const title = document.getElementById('postTitle').value;
        const description = document.getElementById('postDescription').value;
        const imageFile = document.getElementById('postImage').files[0];

        if (title && description && imageFile) {
            const reader = new FileReader();

            reader.onload = function(e) {
                // Crear una nueva tarjeta con los datos del modal
                const postContainer = document.getElementById('postContainer');
                const card = document.createElement('div');
                card.classList.add('col-12', 'col-md-4', 'col-sm-6', 'col-lg-3', 'product-item');

                const cardBody = `
                    <div class="card h-100">
                        <img src="${e.target.result}" class="card-img-top" alt="${title}">
                        <div class="card-body">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="selectProduct${postContainer.children.length + 1}">
                                <label class="form-check-label" for="selectProduct${postContainer.children.length + 1}">Seleccionar</label>
                            </div>
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${description}</p>
                            <p class="card-text"><b>Teléfono:</b> 944972856</p>
                            <div class="d-flex justify-content-between">
                                <a href="#" class="btn btn-sm btn-outline-success">WhatsApp</a>
                                <a href="#" class="btn btn-sm btn-outline-primary">Llamar</a>
                            </div>
                        </div>
                    </div>
                `;

                card.innerHTML = cardBody;
                postContainer.appendChild(card);

                // Limpiar el formulario
                document.getElementById('postForm').reset();

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById(''));
                modal.hide();
            };

            reader.readAsDataURL(imageFile);
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });
});