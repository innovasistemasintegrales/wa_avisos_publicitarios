// Función para crear una tarjeta de publicación
function createCard(title, description, imageSrcs, category, price, id, isPremium = false, videoSrc = null, phoneNumber = null) {
    const card = document.createElement('div');
    card.classList.add('col-6', 'col-sm-4', 'col-md-3', 'product-item');
    card.id = id || 'card-' + Date.now();
    card.setAttribute('data-full-description', description);
    card.setAttribute('data-images', JSON.stringify(imageSrcs));
    if (videoSrc) {
        card.setAttribute('data-video', videoSrc);
    }

    const premiumBadge = isPremium ? '<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">Premium</span>' : '';
    const imageCount = Array.isArray(imageSrcs) ? imageSrcs.length : 1;
    const imageBadge = imageCount > 1 ? `<span class="badge bg-info text-dark position-absolute top-0 start-0 m-2">${imageCount} imágenes</span>` : '';

    let mediaContent;
    if (isPremium) {
        mediaContent = createMediaCarousel(imageSrcs, videoSrc, card.id);
    } else {
        mediaContent = `<img src="${Array.isArray(imageSrcs) ? imageSrcs[0] : imageSrcs}" class="card-img-top" alt="${title}" style="height: 120px; object-fit: cover;">`;
    }

    let phoneContent = '';
    if (phoneNumber) {
        phoneContent = `
      <p class="card-text" style="font-size: 0.9rem;">
        <a href="https://wa.me/${phoneNumber}" target="_blank" class="text-decoration-none">
          <i class="fab fa-whatsapp text-success"></i> ${phoneNumber}
        </a>
      </p>
    `;
    }

    card.innerHTML = `
    <div class="card h-100" style="width: 100%;">
        ${premiumBadge}
        ${isPremium ? imageBadge : ''}
        ${mediaContent}
        <div class="card-body p-2">
            <h5 class="card-title" style="font-size: 1rem;">${title}</h5>
            <p class="card-text" style="font-size: 0.9rem;"><b>Categoría:</b> ${category}</p>
            <p class="card-text" style="font-size: 0.9rem;"><b>Precio:</b> S/${price}</p>
            ${phoneContent}
            <div class="description-wrapper">
                <p class="card-text description-container" style="font-size: 0.8rem;">${truncateDescription(description, 3)}</p>
            </div>
            <br>
            <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-danger delete-button">Eliminar</button>
                <button class="btn btn-sm btn-outline-primary edit-button">Editar</button>
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
        if (isPremium) {
            fillPremiumEditModal(card.id);
            const editModal = new bootstrap.Modal(document.getElementById('editPremiumModal'));
            editModal.show();
        } else {
            fillEditModal(card.id);
            const editModal = new bootstrap.Modal(document.getElementById('editModal2'));
            editModal.show();
        }
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
    const price = document.getElementById('postPrice').value;

    if (title && description && imageFile && category && price) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const postContainer = document.getElementById('postContainer');
            const card = createCard(title, description, e.target.result, category, price, null);
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

// Agregar modal de edición al DOM con campo de categoría y precio
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
                            <label for="editPrice" class="form-label">Precio</label>
                            <input type="number" class="form-control" id="editPrice" required>
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

// Función para llenar el modal de edición
function fillEditModal(cardId) {
    const card = document.getElementById(cardId);
    const editModal = document.getElementById('editModal2');

    document.getElementById('editTitle').value = card.querySelector('.card-title').textContent;
    document.getElementById('editDescription').value = card.getAttribute('data-full-description');
    document.getElementById('editCategory').value = card.querySelector('.card-text:nth-child(2)').textContent.replace('Categoría:', '').trim();
    document.getElementById('editPrice').value = card.querySelector('.card-text:nth-child(3)').textContent.replace('Precio: S/', '').trim();
    document.getElementById('currentImage').src = card.querySelector('.card-img-top').src;

    editModal.dataset.currentCard = cardId;
}

// Guardar cambios desde el modal de edición
document.getElementById('saveEditButton').addEventListener('click', function () {
    const editModal = document.getElementById('editModal2');
    const cardId = editModal.dataset.currentCard;
    const card = document.getElementById(cardId);

    const newTitle = document.getElementById('editTitle').value.trim();
    const newDescription = document.getElementById('editDescription').value.trim();
    const newCategory = document.getElementById('editCategory').value.trim();
    const newPrice = document.getElementById('editPrice').value.trim();
    const newImageFile = document.getElementById('editImage').files[0];

    if (newTitle && newDescription && newCategory && newPrice) {
        card.querySelector('.card-title').textContent = newTitle;
        card.querySelector('.card-text:nth-child(2)').innerHTML = `<b>Categoría:</b> ${newCategory}`;
        card.querySelector('.card-text:nth-child(3)').innerHTML = `<b>Precio:</b> S/${newPrice}`;
        card.querySelector('.description-container').textContent = truncateDescription(newDescription, 3);
        card.setAttribute('data-full-description', newDescription);

        if (newImageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                card.querySelector('.card-img-top').src = e.target.result;
                updateProfilePicture(e.target.result);
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
                if (typeof updateProfilePicture === 'function') {
                    updateProfilePicture(e.target.result);
                }
            }
            reader.readAsDataURL(file);
        }
    });
}

// Variable para almacenar el plan actual
let currentPlan = "Gratis";

// Agregar event listeners a los botones de plan
document.querySelectorAll('.plan-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const newPlan = this.closest('.card').querySelector('.plan-title').textContent;
        changePlan(newPlan);
    });
});

// Función para actualizar el uso del modal basado en el plan actual
function updateModalUsage() {
    const addPostButton = document.querySelector('.add-post-button');
    if (addPostButton) {
        addPostButton.setAttribute('data-bs-target', 
            currentPlan === "Plus" ? '#addPremiumPostModal' : '#addPostModal');
    }
}

// Función para cambiar el plan
function changePlan(newPlan) {
    currentPlan = newPlan;
    updatePlanButtons();
    updateModalUsage();
}

// Función para crear un carrusel de imágenes y video
function createMediaCarousel(imageSrcs, videoSrc, cardId) {
    if (!Array.isArray(imageSrcs) || imageSrcs.length === 0) {
        return '<img src="/placeholder.svg" class="card-img-top" alt="Placeholder" style="height: 120px; object-fit: cover;">';
    }

    const carouselId = `carousel-${cardId}`;
    let carouselItems = '';
    let carouselIndicators = '';

    imageSrcs.forEach((src, index) => {
        carouselItems += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${src}" class="d-block w-100" alt="Image ${index + 1}" style="height: 120px; object-fit: cover;">
            </div>
        `;
        carouselIndicators += `
            <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
        `;
    });

    if (videoSrc) {
        carouselItems += `
            <div class="carousel-item">
                <video src="${videoSrc}" class="d-block w-100" style="height: 120px; object-fit: cover;" controls></video>
            </div>
        `;
        carouselIndicators += `
            <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${imageSrcs.length}" aria-label="Video"></button>
        `;
    }

    return `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                ${carouselIndicators}
            </div>
            <div class="carousel-inner">
                ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span  class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;
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

// Añade esta función al principio de tu archivo :
function checkFormElements() {
    const requiredElements = [
        'premiumPostForm',
        'premiumPostTitle',
        'premiumPostDescription',
        'premiumPostCategory',
        'premiumPostPrice',
        'premiumPostImages',
        'premiumPostVideo',
        'premiumPostPhone'
    ];

    const missingElements = requiredElements.filter(elementId => !document.getElementById(elementId));

    if (missingElements.length > 0) {
        console.warn(`The following elements are missing from the DOM: ${missingElements.join(', ')}`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkFormElements();
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
        if (selectedImages.length > 0) {
            const dataTransfer = new DataTransfer();
            selectedImages.forEach(file => {
                dataTransfer.items.add(file);
            });
            imageInput.files = dataTransfer.files;
        } else {
            imageInput.value = '';
        }
    }

    // Modificar el evento para guardar una publicación premium
    document.getElementById('savePremiumPostButton').addEventListener('click', function(event) {
        event.preventDefault();
        const form = document.getElementById('premiumPostForm');
        if (form && form.checkValidity()) {
            const title = document.getElementById('premiumPostTitle')?.value;
            const description = document.getElementById('premiumPostDescription')?.value;
            const category = document.getElementById('premiumPostCategory')?.value;
            const price = document.getElementById('premiumPostPrice')?.value;
            const imageFiles = document.getElementById('premiumPostImages')?.files;
            const videoFile = document.getElementById('premiumPostVideo')?.files[0];
            const phoneNumber = document.getElementById('premiumPostPhone')?.value;

            if (title && description && category && price && imageFiles && imageFiles.length > 0) {
                if (imageFiles.length > 5) {
                    alert('Por favor, selecciona un máximo de 5 imágenes.');
                    return;
                }

                const imageSrcs = [];
                let loadedImages = 0;
                let videoSrc = null;

                const processMedia = () => {
                    if (loadedImages === imageFiles.length && (videoFile === undefined || videoSrc !== null)) {
                        const postContainer = document.getElementById('postContainer');
                        const card = createCard(title, description, imageSrcs, category, price, null, true, videoSrc, phoneNumber);
                        postContainer.appendChild(card);
                        updateNoPostsMessage();
                        form.reset();
                        document.getElementById('imagePreview').innerHTML = '';
                        document.getElementById('premiumPostVideoPreview').style.display = 'none';
                        document.getElementById('premiumPostVideoPreview').src = '';

                        const modal = bootstrap.Modal.getInstance(document.getElementById('addPremiumPostModal'));
                        modal.hide();
                    }
                };

                for (let i = 0; i < imageFiles.length; i++) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        imageSrcs.push(e.target.result);
                        loadedImages++;
                        processMedia();
                    };
                    reader.readAsDataURL(imageFiles[i]);
                }

                if (videoFile) {
                    const videoReader = new FileReader();
                    videoReader.onload = function (e) {
                        videoSrc = e.target.result;
                        processMedia();
                    };
                    videoReader.readAsDataURL(videoFile);
                } else {
                    processMedia();
                }
            } else {
                alert('Por favor, completa todos los campos requeridos y selecciona al menos una imagen (máximo 5).');
            }
        } else if (form) {
            form.reportValidity();
        } else {
            console.error('El formulario premiumPostForm no se encontró en el DOM');
        }
    });

    // Inicialización
    updateNoPostsMessage();
    handleProfileImageUpload();
    updatePlanButtons();
    updateModalUsage();
});

// Agregar el nuevo modal de edición premium al DOM
document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="editPremiumModal" tabindex="-1" aria-labelledby="editPremiumModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editPremiumModalLabel">Editar publicación premium</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editPremiumForm">
                        <div class="mb-3">
                            <label for="editPremiumTitle" class="form-label">Título</label>
                            <input type="text" class="form-control" id="editPremiumTitle" required>
                        </div>
                        <div class="mb-3">
                            <label for="editPremiumDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="editPremiumDescription" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editPremiumCategory" class="form-label">Categoría</label>
                            <input type="text" class="form-control" id="editPremiumCategory" required>
                        </div>
                        <div class="mb-3">
                            <label for="editPremiumPrice" class="form-label">Precio</label>
                            <input type="number" class="form-control" id="editPremiumPrice" required>
                        </div>
                        <div class="mb-3">
                            <label for="editPremiumPhone" class="form-label">Número de teléfono</label>
                            <input type="tel" class="form-control" id="editPremiumPhone">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Imágenes (máximo 5)</label>
                            <div id="editPremiumImageContainer" class="d-flex flex-wrap gap-2 mb-2"></div>
                            <input type="file" class="form-control" id="editPremiumImageUpload" accept="image/*" multiple>
                        </div>
                        <div class="mb-3">
                            <label for="editPremiumVideo" class="form-label">Video</label>
                            <input type="file" class="form-control" id="editPremiumVideo" accept="video/*">
                            <video id="editPremiumVideoPreview" controls class="mt-2 w-100" style="max-height: 200px; display: none;"></video>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="savePremiumEditButton">Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>
`);

// Función para llenar el modal de edición premium
function fillPremiumEditModal(cardId) {
    const card = document.getElementById(cardId);
    const editModal = document.getElementById('editPremiumModal');

    document.getElementById('editPremiumTitle').value = card.querySelector('.card-title').textContent;
    document.getElementById('editPremiumDescription').value = card.getAttribute('data-full-description');
    document.getElementById('editPremiumCategory').value = card.querySelector('.card-text:nth-child(2)').textContent.replace('Categoría:', '').trim();
    document.getElementById('editPremiumPrice').value = card.querySelector('.card-text:nth-child(3)').textContent.replace('Precio: S/', '').trim();
    
    const imageContainer = document.getElementById('editPremiumImageContainer');
    imageContainer.innerHTML = '';

    const images = JSON.parse(card.getAttribute('data-images'));

    images.forEach((src, index) => {
        addImageToEditPremiumModal(src, index);
    });

    const videoSrc = card.getAttribute('data-video');
    const videoPreview = document.getElementById('editPremiumVideoPreview');
    if (videoSrc) {
        videoPreview.src = videoSrc;
        videoPreview.style.display = 'block';
    } else {
        videoPreview.src = '';
        videoPreview.style.display = 'none';
    }

    const phoneElement = card.querySelector('.card-text a[href^="https://wa.me/"]');
    if (phoneElement) {
        document.getElementById('editPremiumPhone').value = phoneElement.textContent.trim();
    } else {
        document.getElementById('editPremiumPhone').value = '';
    }

    editModal.dataset.currentCard = cardId;
}

// Función para agregar una imagen al modal de edición premium
function addImageToEditPremiumModal(src, index) {
    const imageContainer = document.getElementById('editPremiumImageContainer');
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'position-relative';
    
    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.alt = `Imagen ${index + 1}`;
    imgElement.className = 'img-thumbnail';
    imgElement.style.width = '100px';
    imgElement.style.height = '100px';
    imgElement.style.objectFit = 'cover';
    
    const removeButton = document.createElement('button');
    removeButton.innerHTML = '&times;';
    removeButton.className = 'btn btn-danger btn-sm position-absolute top-0 end-0';
    removeButton.onclick = () => imgWrapper.remove();

    imgWrapper.appendChild(imgElement);
    imgWrapper.appendChild(removeButton);
    imageContainer.appendChild(imgWrapper);
}

// Evento para subir nuevas imágenes en el modal premium
document.getElementById('editPremiumImageUpload').addEventListener('change', function(event) {
    const files = Array.from(event.target.files);
    const imageContainer = document.getElementById('editPremiumImageContainer');
    const currentImages = imageContainer.children.length;

    files.forEach((file, index) => {
        if (currentImages + index >= 5) {
            alert('Has alcanzado el límite máximo de 5 imágenes.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            addImageToEditPremiumModal(e.target.result, currentImages + index);
        }
        reader.readAsDataURL(file);
    });
});

// Evento para guardar cambios en la tarjeta premium
document.getElementById('savePremiumEditButton').addEventListener('click', function () {
    const editModal = document.getElementById('editPremiumModal');
    const cardId = editModal.dataset.currentCard;
    const card = document.getElementById(cardId);

    const newTitle = document.getElementById('editPremiumTitle').value.trim();
    const newDescription = document.getElementById('editPremiumDescription').value.trim();
    const newCategory = document.getElementById('editPremiumCategory').value.trim();
    const newPrice = document.getElementById('editPremiumPrice').value.trim();
    const newImages = Array.from(document.getElementById('editPremiumImageContainer').children).map(wrapper => wrapper.querySelector('img').src);
    const newVideoFile = document.getElementById('editPremiumVideo').files[0];
    const newPhoneNumber = document.getElementById('editPremiumPhone').value.trim();

    if (newTitle && newDescription && newCategory && newPrice && newImages.length > 0) {
        card.querySelector('.card-title').textContent = newTitle;
        card.querySelector('.card-text:nth-child(2)').innerHTML = `<b>Categoría:</b> ${newCategory}`;
        card.querySelector('.card-text:nth-child(3)').innerHTML = `<b>Precio:</b> S/${newPrice}`;
        card.querySelector('.description-container').textContent = truncateDescription(newDescription, 3);
        card.setAttribute('data-full-description', newDescription);
        card.setAttribute('data-images', JSON.stringify(newImages));

        if (newVideoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                card.setAttribute('data-video', e.target.result);
                updateCardMedia(card, newImages, e.target.result);
            };
            reader.readAsDataURL(newVideoFile);
        } else {
            updateCardMedia(card, newImages, card.getAttribute('data-video'));
        }

        if (newPhoneNumber) {
            const phoneContent = `
              <p class="card-text" style="font-size: 0.9rem;">
                <a href="https://wa.me/${newPhoneNumber}" target="_blank" class="text-decoration-none">
                  <i class="fab fa-whatsapp text-success"></i> ${newPhoneNumber}
                </a>
              </p>
            `;
            const existingPhoneContent = card.querySelector('.card-text a[href^="https://wa.me/"]');
            if (existingPhoneContent) {
              existingPhoneContent.parentElement.outerHTML = phoneContent;
            } else {
              card.querySelector('.card-body').insertAdjacentHTML('afterbegin', phoneContent);
            }
        } else {
            const existingPhoneContent = card.querySelector('.card-text a[href^="https://wa.me/"]');
            if (existingPhoneContent) {
              existingPhoneContent.parentElement.remove();
            }
        }


        showConfirmationMessage(card);

        const modalInstance = bootstrap.Modal.getInstance(editModal);
        if (modalInstance) {
            modalInstance.hide();
        }
    } else {
        alert('Por favor, completa todos los campos y asegúrate de tener al menos una imagen.');
    }
});

// Función para actualizar el contenido multimedia de la tarjeta
function updateCardMedia(card, images, videoSrc) {
    const carouselInner = card.querySelector('.carousel-inner');
    carouselInner.innerHTML = '';
    const carouselIndicators = card.querySelector('.carousel-indicators');
    carouselIndicators.innerHTML = '';

    images.forEach((src, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        carouselItem.innerHTML = `<img src="${src}" class="d-block w-100" alt="Image ${index + 1}" style="height: 120px; object-fit: cover;">`;
        carouselInner.appendChild(carouselItem);

        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', `#carousel-${card.id}`);
        indicator.setAttribute('data-bs-slide-to', index.toString());
        if (index === 0) {
            indicator.className = 'active';
            indicator.setAttribute('aria-current', 'true');
        }
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        carouselIndicators.appendChild(indicator);
    });

    if (videoSrc) {
        const videoItem = document.createElement('div');
        videoItem.className = 'carousel-item';
        videoItem.innerHTML = `<video src="${videoSrc}" class="d-block w-100" style="height: 120px; object-fit: cover;" controls></video>`;
        carouselInner.appendChild(videoItem);

        const videoIndicator = document.createElement('button');
        videoIndicator.type = 'button';
        videoIndicator.setAttribute('data-bs-target', `#carousel-${card.id}`);
        videoIndicator.setAttribute('data-bs-slide-to', images.length.toString());
        videoIndicator.setAttribute('aria-label', 'Video');
        carouselIndicators.appendChild(videoIndicator);
    }

    // Actualizar el badge de imágenes
    const imageBadge = card.querySelector('.badge.bg-info');
    if (imageBadge) {
        imageBadge.textContent = images.length > 1 ? `${images.length} imágenes` : '1 imagen';
    } else if (images.length > 1) {
        const newBadge = document.createElement('span');
        newBadge.className = 'badge bg-info text-dark position-absolute top-0 start-0 m-2';
        newBadge.textContent = `${images.length} imágenes`;
        card.querySelector('.card').prepend(newBadge);
    }
}

// Agregar evento para previsualizar el video en el modal de creación
document.getElementById('premiumPostVideo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const videoPreview = document.getElementById('premiumPostVideoPreview');
    
    if (file) {
                const reader = new FileReader();
        reader.onload = function(e) {
            videoPreview.src = e.target.result;
                        videoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        videoPreview.src = '';
        videoPreview.style.display = 'none';
    }
});

// Agregar evento para previsualizar el video en el modal de edición
document.getElementById('editPremiumVideo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const videoPreview = document.getElementById('editPremiumVideoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            videoPreview.src = e.target.result;
            videoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        videoPreview.src = '';
        videoPreview.style.display = 'none';
    }
});

// Editar Datos de Perfil
document.addEventListener('DOMContentLoaded', () => {
    // Obtener los elementos de los campos de edición y los campos principales
    const editFormFields = {
        first_name: document.getElementById('edit_first_name'),
        last_name: document.getElementById('edit_last_name'),
        dni: document.getElementById('edit_dni'),
        birth_date: document.getElementById('edit_birth_date'),
        occupation: document.getElementById('edit_occupation'),
        education: document.getElementById('edit_education'),
        phone: document.getElementById('edit_phone'),
        email: document.getElementById('edit_email')
    };

    const mainFormFields = {
        first_name: document.getElementById('first_name'),
        last_name: document.getElementById('last_name'),
        dni: document.getElementById('dni'),
        birth_date: document.getElementById('birth_date'),
        occupation: document.getElementById('occupation'),
        education: document.getElementById('education'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email')
    };

    // Cargar los datos actuales del formulario principal en el formulario de edición al abrir el modal
    document.getElementById('editModal').addEventListener('show.bs.modal', () => {
        for (const field in editFormFields) {
            editFormFields[field].value = mainFormFields[field].value;
        }
    });

    // Guardar cambios y actualizar los campos en el formulario principal
    document.getElementById('saveChangesButton').addEventListener('click', () => {
        for (const field in editFormFields) {
            mainFormFields[field].value = editFormFields[field].value;
        }

        // Manejar la imagen de perfil
        const profileImageUpload = document.getElementById('profileImageUpload');
        const profileImagePreview = document.getElementById('profileImagePreview');
        const imageFiles = profileImageUpload.files;

        if (imageFiles.length > 0) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Actualiza la imagen de perfil en el modal
                profileImagePreview.src = e.target.result;
                // Actualiza la imagen de perfil del usuario
                updateProfilePicture(e.target.result);
            };

            reader.readAsDataURL(imageFiles[0]);
        }
    });

    // Manejar el cambio de imagen en el modal
    const modalImageUpload = document.getElementById('profileImageUpload');
    modalImageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                profileImagePreview.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    });
});

//Escoge tus Beneficios
// Seleccionar todos los checkboxes
const checkboxes = document.querySelectorAll('.custom-checkbox');
const totalPriceElement = document.getElementById('total-price');

// Función para actualizar el precio
function updatePrice() {
  let total = 0;
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      total += parseFloat(checkbox.value);
    }
  });
  totalPriceElement.textContent = `S/${total}`;
}

// Añadir evento a cada checkbox para actualizar el precio cuando se selecciona o deselecciona
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updatePrice);
});