function createCard(title, description, imageSrc, category, id) {
    const card = document.createElement('div');
    card.classList.add('col-6', 'col-sm-4', 'col-md-3', 'product-item');
    card.id = id || 'card-' + Date.now();
    // Almacenar la descripción completa
    card.setAttribute('data-full-description', description);

    card.innerHTML = `
    <div class="card h-100" style="width: 100%;">
        <img src="${imageSrc}" class="card-img-top" alt="${title}" style="height: 120px; object-fit: cover;">
        <div class="card-body p-2">
            <h5 class="card-title" style="font-size: 1rem;">${title}</h5>
            <p class="card-text" style="font-size: 0.9rem;"><b>Categoría:</b> ${category}</p>
            <div class="description-wrapper">
                <p class="card-text description-container" style="font-size: 0.8rem;">${truncateDescription(description, 3)}</p>
            </div>
            <br>
            <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-danger delete-button">Eliminar</button>
                <button class="btn btn-sm btn-outline-primary edit-button" data-bs-toggle="modal" data-bs-target="#editModal2">Editar</button>
            </div>
        </div>
    </div>
    `;

    // Evento para eliminar la tarjeta
    card.querySelector('.delete-button').addEventListener('click', function () {
        if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            card.remove();
            updateNoPostsMessage();
        }
    });

    // Evento para editar la tarjeta
    card.querySelector('.edit-button').addEventListener('click', function () {
        fillEditModal(card.id);
    });

    return card;
}


// Función para truncar la descripción a un número máximo de líneas
function truncateDescription(text, maxLines) {
    const words = text.split(' ');
    let result = '';
    let lineCount = 0;

    for (let word of words) {
        result += word + ' ';
        if (result.split('\n').length >= maxLines) {
            result += '...';
            break;
        }
    }
    return result.trim();
}

// Listener para el botón 'savePostButton'
document.getElementById('savePostButton').addEventListener('click', function () {
    const title = document.getElementById('postTitle').value;
    const description = document.getElementById('postDescription').value;
    const imageFile = document.getElementById('postImage').files[0];
    const category = document.getElementById('postCategory').value;

    if (title && description && imageFile && category) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const postContainer = document.getElementById('postContainer');
            const card = createCard(title, description, e.target.result, category);
            postContainer.appendChild(card);
            updateNoPostsMessage();
            document.getElementById('postForm').reset();

            // Actualizar la foto de perfil
            updateProfilePicture(e.target.result);

            // Cerrar el modal correctamente
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
            modal.hide();
        };

        reader.readAsDataURL(imageFile);
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Función para actualizar la foto de perfil
function updateProfilePicture(imageSrc) {
    const profilePicture = document.getElementById('profilePicture');
    if (profilePicture) {
        profilePicture.src = imageSrc;
    }
}

// Agregar modal de edición al DOM con campo de categoría
document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="editModal2" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
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
                            <label for="editCategory" class="form-label">Categoría</label>
                            <input type="text" class="form-control" id="editCategory" required>
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
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveEditButton">Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>
`);

// Guardar cambios desde el modal de edición
document.getElementById('saveEditButton').addEventListener('click', function () {
    const editModal = document.getElementById('editModal2');
    const cardId = editModal.dataset.currentCard;
    const card = document.getElementById(cardId);

    const newTitle = document.getElementById('editTitle').value.trim();
    const newDescription = document.getElementById('editDescription').value.trim();
    const newCategory = document.getElementById('editCategory').value.trim();
    const newImageFile = document.getElementById('editImage').files[0];

    if (newTitle && newDescription && newCategory) {
        card.querySelector('.card-title').textContent = newTitle;
        card.querySelector('.card-text').innerHTML = `<b>Categoría:</b> ${newCategory}`;
        card.querySelector('.description-container').textContent = truncateDescription(newDescription, 3);

        if (newImageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                card.querySelector('.card-img-top').src = e.target.result;
                // Actualizar la foto de perfil
                updateProfilePicture(e.target.result);
            };
            reader.readAsDataURL(newImageFile);
        }

        // Mostrar mensaje de confirmación
        showConfirmationMessage(card);

        // Cerrar el modal
        const modalInstance = bootstrap.Modal.getInstance(editModal);
        if (modalInstance) {
            modalInstance.hide();
        }
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Función para mostrar el mensaje de confirmación
function showConfirmationMessage(card) {
    const message = document.createElement('div');
    message.textContent = 'Su edición ya está realizada';
    message.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #28a745;
        color: white;
        padding: 10px;
        text-align: center;
        z-index: 1000;
    `;
    card.style.position = 'relative';
    card.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

function fillEditModal(cardId) {
    const card = document.getElementById(cardId);
    const editModal = document.getElementById('editModal2');

    document.getElementById('editTitle').value = card.querySelector('.card-title').textContent;
    document.getElementById('editDescription').value = card.getAttribute('data-full-description'); // Obtener la descripción completa
    document.getElementById('editCategory').value = card.querySelector('.card-text').textContent.replace('Categoría:', '').trim();
    document.getElementById('currentImage').src = card.querySelector('.card-img-top').src;

    editModal.dataset.currentCard = cardId;
}


// Función para actualizar el mensaje de "No hay publicaciones"
function updateNoPostsMessage() {
    const postContainer = document.getElementById('postContainer');
    const noPostsMessage = document.getElementById('noPostsMessage');
    if (postContainer.querySelectorAll('.product-item').length === 0) {
        noPostsMessage.style.display = 'block';
    } else {
        noPostsMessage.style.display = 'none';
    }
}

// Función para manejar la carga de la imagen de perfil
function handleProfileImageUpload() {
    const input = document.getElementById('profileImageUpload');
    const preview = document.getElementById('profileImagePreview');

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                // También actualizamos la variable global si existe
                if (typeof updateProfilePicture === 'function') {
                    updateProfilePicture(e.target.result);
                }
            }
            reader.readAsDataURL(file);
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateNoPostsMessage();
    handleProfileImageUpload(); // Añadimos esta línea
});

   // Variable para almacenar el plan actual
   let planActual = "Gratis"; // Puedes cambiar esto según el plan predeterminado

   // Función para cambiar el plan
   function cambiarPlan(nuevoPlan) {
       // Actualiza el plan actual
       planActual = nuevoPlan;

       // Actualiza los botones de las tarjetas
       const botones = document.querySelectorAll('.plan-button');
       botones.forEach(boton => {
           if (boton.querySelector('.fs-8')) { // Para el botón del plan Gratis
               boton.querySelector('.fs-8').textContent = (nuevoPlan === "Gratis") ? "Tu Plan Actual" : "Gratis";
               boton.classList.toggle('btn-success', nuevoPlan === "Gratis");
               boton.classList.toggle('btn-secondary', nuevoPlan === "Gratis");
           }
           if (boton.querySelector('.fs-5')) { // Para el botón del plan Plus
               boton.querySelector('.fs-5').textContent = (nuevoPlan === "Plus") ? "Tu Plan Actual" : "Mejora tu plan a Premium";
               boton.classList.toggle('btn-success', nuevoPlan === "Plus");
               boton.classList.toggle('btn-secondary', nuevoPlan === "Plus");
           }
       });
   }

   // Agregar eventos a los botones
   document.querySelectorAll('.plan-button').forEach(boton => {
       boton.addEventListener('click', function(e) {
           e.preventDefault(); // Evitar el comportamiento predeterminado del enlace

           // Cambiar plan según el botón
           if (this.querySelector('.fs-8')) {
               cambiarPlan("Gratis");
           } else if (this.querySelector('.fs-5')) {
               cambiarPlan("Plus");
           }
       });
   });
   