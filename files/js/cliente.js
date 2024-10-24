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
    // Código para guardar la publicación en el modal gratuito
    const title = document.getElementById('postTitle').value;
    const description = document.getElementById('postDescription').value;
    const imageFile = document.getElementById('postImage').files[0];
    const category = document.getElementById('postCategory').value;

    if (title && description && imageFile && category) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const postContainer = document.getElementById('postContainer');
            const card = createCard(title, description, e.target.result, category, null, false); // Aquí se crea la tarjeta en modo gratuito
            postContainer.appendChild(card);
            updateNoPostsMessage();
            document.getElementById('postForm').reset();

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
let currentPlan = "Gratis";

// Función modificada para crear una tarjeta de publicación
function createCard(title, description, imageSrcs, category, id, isPremium = false) {
    const card = document.createElement('div');
    card.classList.add('col-6', 'col-sm-4', 'col-md-3', 'product-item');
    card.id = id || 'card-' + Date.now();
    card.setAttribute('data-full-description', description);
    card.setAttribute('data-images', JSON.stringify(imageSrcs)); // Almacenar todas las URLs de imágenes

    const premiumBadge = isPremium ? '<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">Premium</span>' : '';
    const imageCount = Array.isArray(imageSrcs) ? imageSrcs.length : 1;
    const imageBadge = imageCount > 1 ? `<span class="badge bg-info text-dark position-absolute top-0 start-0 m-2">${imageCount} imágenes</span>` : '';

    card.innerHTML = `
    <div class="card h-100" style="width: 100%;">
        ${premiumBadge}
        ${imageBadge}
        <img src="${Array.isArray(imageSrcs) ? imageSrcs[0] : imageSrcs}" class="card-img-top" alt="${title}" style="height: 120px; object-fit: cover;">
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

    card.querySelector('.delete-button').addEventListener('click', function () {
        if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            card.remove();
            updateNoPostsMessage();
        }
    });

    card.querySelector('.edit-button').addEventListener('click', function () {
        fillEditModal(card.id);
    });

    return card;
}


// Función para truncar la descripción
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

// Función para cambiar el plan
function changePlan(newPlan) {
    currentPlan = newPlan;
    updatePlanButtons();
    updateModalUsage();
}

// Función para actualizar los botones de plan
function updatePlanButtons() {
    const buttons = document.querySelectorAll('.plan-button');
    buttons.forEach(button => {
        const planName = button.closest('.card').querySelector('.plan-title').textContent;
        const isCurrentPlan = planName === currentPlan;
        
        if (button.querySelector('.fs-8')) {
            button.querySelector('.fs-8').textContent = isCurrentPlan ? "Tu Plan Actual" : "Gratis";
        } else if (button.querySelector('.fs-5')) {
            button.querySelector('.fs-5').textContent = isCurrentPlan ? "Tu Plan Actual" : "Mejora tu plan a Premium";
        }
        
        button.classList.toggle('btn-success', isCurrentPlan);
        button.classList.toggle('btn-secondary', !isCurrentPlan);
    });
}

// Función para actualizar el uso del modal basado en el plan actual
function updateModalUsage() {
    const addPostButton = document.querySelector('.add-post-button');
    if (addPostButton) {
        addPostButton.setAttribute('data-bs-target', 
            currentPlan === "Plus" ? '#addPremiumPostModal' : '#addPostModal');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('premiumPostImages');
    const imagePreview = document.getElementById('imagePreview');
    const savePremiumPostButton = document.getElementById('savePremiumPostButton');
    let selectedImages = [];

    imageInput.addEventListener('change', function(event) {
        const files = Array.from(event.target.files);
        
        if (selectedImages.length + files.length > 5) {
            alert('Puedes seleccionar un máximo de 5 imágenes.');
            return;
        }

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    addImagePreview(e.target.result);
                }
                reader.readAsDataURL(file);
                selectedImages.push(file);
            }
        });

        updateImageInput();
    });

    function addImagePreview(src) {
        const div = document.createElement('div');
        div.className = 'image-preview-item';
        div.innerHTML = `
            <img src="${src}" alt="Vista previa">
            <button type="button" class="remove-image" aria-label="Eliminar imagen">&times;</button>
        `;
        div.querySelector('.remove-image').addEventListener('click', function() {
            const index = Array.from(imagePreview.children).indexOf(div);
            selectedImages.splice(index, 1);
            div.remove();
            updateImageInput();
        });
        imagePreview.appendChild(div);
    }

    function updateImageInput() {
        const dataTransfer = new DataTransfer();
        selectedImages.forEach(file => {
            dataTransfer.items.add(file);
        });
        imageInput.files = dataTransfer.files;
    }

    document.getElementById('savePremiumPostButton').addEventListener('click', function(event) {
        event.preventDefault();
        if (document.getElementById('premiumPostForm').checkValidity()) {
            const title = document.getElementById('premiumPostTitle').value;
            const description = document.getElementById('premiumPostDescription').value;
            const category = document.getElementById('premiumPostCategory').value;
            const imageFiles = document.getElementById('premiumPostImages').files;
    
            if (title && description && category && imageFiles.length > 0) {
                if (imageFiles.length > 5) {
                    alert('Por favor, selecciona un máximo de 5 imágenes.');
                    return;
                }
    
                const imageSrcs = [];
                let loadedImages = 0;
    
                for (let i = 0; i < imageFiles.length; i++) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        imageSrcs.push(e.target.result);
                        loadedImages++;
    
                        if (loadedImages === imageFiles.length) {
                            const postContainer = document.getElementById('postContainer');
                            const card = createCard(title, description, imageSrcs, category, null, true);
                            postContainer.appendChild(card);
                            updateNoPostsMessage();
                            document.getElementById('premiumPostForm').reset();
    
                            const modal = bootstrap.Modal.getInstance(document.getElementById('addPremiumPostModal'));
                            modal.hide();
                        }
                    };
                    reader.readAsDataURL(imageFiles[i]);
                }
            } else {
                alert('Por favor, completa todos los campos y selecciona al menos una imagen (máximo 5).');
            }
        } else {
            document.getElementById('premiumPostForm').reportValidity();
        }
    });
    
    


// Función modificada para llenar el modal de edición
function fillEditModal(cardId) {
    const card = document.getElementById(cardId);
    const editModal = document.getElementById('editModal2');

    document.getElementById('editTitle').value = card.querySelector('.card-title').textContent;
    document.getElementById('editDescription').value = card.getAttribute('data-full-description');
    document.getElementById('editCategory').value = card.querySelector('.card-text').textContent.replace('Categoría:', '').trim();
    
    // Limpiar el contenedor de imágenes existente
    const imageContainer = document.getElementById('editImageContainer');
    imageContainer.innerHTML = '';

    // Obtener todas las imágenes almacenadas
    const images = JSON.parse(card.getAttribute('data-images'));

    // Mostrar todas las imágenes en el modal
    images.forEach((src, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = src;
        imgElement.alt = `Imagen ${index + 1}`;
        imgElement.className = 'img-thumbnail m-1';
        imgElement.style.width = '100px';
        imgElement.style.height = '100px';
        imgElement.style.objectFit = 'cover';
        imageContainer.appendChild(imgElement);
    });

    editModal.dataset.currentCard = cardId;
}

// Listener para el botón 'saveEditButton'
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
        card.setAttribute('data-full-description', newDescription);

        if (newImageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                card.querySelector('.card-img-top').src = e.target.result;
            };
            reader.readAsDataURL(newImageFile);
        }

        showConfirmationMessage(card);

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
            }
            reader.readAsDataURL(file);
        }
    });
}

// Agregar event listeners a los botones de plan
document.querySelectorAll('.plan-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const newPlan = this.closest('.card').querySelector('.plan-title').textContent;
        changePlan(newPlan);
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateNoPostsMessage();
    handleProfileImageUpload();
    updatePlanButtons();
    updateModalUsage();
});
})