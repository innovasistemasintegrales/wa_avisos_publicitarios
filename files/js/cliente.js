// Función para crear una tarjeta
function createCard(title, description, imageSrc, id) {
    const card = document.createElement('div');
    card.classList.add('col-12', 'col-md-4', 'col-sm-6', 'col-lg-3', 'product-item');
    card.id = id || 'card-' + Date.now();

    card.innerHTML = `
        <div class="card h-100">
            <img src="${imageSrc}" class="card-img-top" alt="${title}">
            <div class="card-body">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="selectProduct${card.id}">
                    <label class="form-check-label" for="selectProduct${card.id}">Seleccionar</label>
                </div>
                <h5 class="card-title">${title}</h5>
                <div class="description-wrapper">
                    <p class="card-text description-container">${description}</p>
                </div>
                <br>
                <p class="card-text"><b>Teléfono:</b> 944972856</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-danger delete-button">Eliminar</button>
                    <button class="btn btn-sm btn-outline-primary edit-button" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>
                </div>
            </div>
        </div>
    `;

    return card;
}


// Listener para el botón 'savePostButton'
document.getElementById('savePostButton').addEventListener('click', function() {
    const title = document.getElementById('postTitle').value;
    const description = document.getElementById('postDescription').value;
    const imageFile = document.getElementById('postImage').files[0];

    if (title && description && imageFile) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const postContainer = document.getElementById('postContainer');
            const card = createCard(title, description, e.target.result);

            // Agregar evento al botón de eliminar
            card.querySelector('.delete-button').addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
                    card.remove();
                    if (postContainer.querySelectorAll('.product-item').length === 0) {
                        document.getElementById('noPostsMessage').style.display = 'block';
                    }
                }
            });

            // Agregar evento al botón de editar
            card.querySelector('.edit-button').addEventListener('click', function() {
                const editModal = document.getElementById('editModal');
                const editTitle = editModal.querySelector('#editTitle');
                const editDescription = editModal.querySelector('#editDescription');
                const currentImage = editModal.querySelector('#currentImage');

                editTitle.value = card.querySelector('.card-title').textContent;
                editDescription.value = card.querySelector('.description-container').textContent;
                currentImage.src = card.querySelector('.card-img-top').src;

                // Guardar una referencia a la tarjeta actual en el modal
                editModal.dataset.currentCard = card.id;
            });

            postContainer.appendChild(card);

            // Mostrar u ocultar el mensaje de "No tienes ninguna publicación"
            const noPostsMessage = document.getElementById('noPostsMessage');
            noPostsMessage.style.display = 'none';

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

// Mostrar mensaje al cargar la página si no hay publicaciones
const postContainer = document.getElementById('postContainer');
const noPostsMessage = document.getElementById('noPostsMessage');
const postCards = postContainer.querySelectorAll('.product-item');

if (postCards.length === 0) {
    noPostsMessage.style.display = 'block'; // Mostrar mensaje si no hay publicaciones
}

// Listener para el cambio de imagen de perfil
document.getElementById('profileImageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado

    if (file) {
        const reader = new FileReader(); // Crear un objeto FileReader

        reader.onload = function(e) {
            // Cambiar la fuente de la imagen de perfil a la nueva imagen
            document.getElementById('profileImagePreview').src = e.target.result;
        }

        reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
});

// Agregar el modal de edición al DOM
document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Editar publicación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <div class="mb-3">
                            <label for="editTitle" class="form-label">Título</label>
                            <input type="text" class="form-control" id="editTitle" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="editDescription" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editImage" class="form-label">Imagen actual</label>
                            <img id="currentImage" src="" alt="Imagen actual" class="img-fluid mb-2">
                            <input type="file" class="form-control" id="editImage" accept="image/*">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="saveEditButton">Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>
`);

// Listener para el botón de guardar cambios en el modal de edición
document.getElementById('saveEditButton').addEventListener('click', function() {
    const editModal = document.getElementById('editModal');
    const cardId = editModal.dataset.currentCard;
    const card = document.getElementById(cardId);

    const newTitle = document.getElementById('editTitle').value;
    const newDescription = document.getElementById('editDescription').value;
    const newImageFile = document.getElementById('editImage').files[0];

    if (newTitle && newDescription) {
        card.querySelector('.card-title').textContent = newTitle;
        card.querySelector('.description-container').textContent = newDescription;

        if (newImageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                card.querySelector('.card-img-top').src = e.target.result;
            }
            reader.readAsDataURL(newImageFile);
        }

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance();
        modal.hide();
    } else {
        alert('Por favor, completa todos los campos requeridos.');
    }
});