// Variables globales
let beneficiosSeleccionados = [];
let currentPlan = "Gratis";

// Definición de los beneficios disponibles
const beneficios = [
    { id: 'checkTitle', label: 'Colocar un video por cada aviso', precio: 10 },
    { id: 'checkDescription', label: 'Colocar un máximo de 5 imágenes por Aviso', precio: 5 },
    { id: 'checkImage', label: 'Mayor tiempo de Publicación', precio: 8 },
    { id: 'checkWhatsapp', label: 'Acceso Directo a Whatsapp', precio: 8 },
    { id: 'checkDuration', label: 'Búsquedas Avanzadas', precio: 6 }
];

// Función para crear una tarjeta de publicación
function createCard(title, description, imageSrcs, category, price, id, beneficiosAplicados = []) {
    const card = document.createElement('div');
    card.classList.add('col-6', 'col-sm-4', 'col-md-3', 'product-item');
    card.id = id || 'card-' + Date.now();
    card.setAttribute('data-full-description', description);
    card.setAttribute('data-images', JSON.stringify(imageSrcs));

    const isPremium = beneficiosAplicados.length > 0 || currentPlan === "Plus";
    const premiumBadge = isPremium ? '<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">Premium</span>' : '';
    const imageCount = Array.isArray(imageSrcs) ? imageSrcs.length : 1;
    const imageBadge = imageCount > 1 ? `<span class="badge bg-info text-dark position-absolute top-0 start-0 m-2">${imageCount} imágenes</span>` : '';
    const videoBadge = beneficiosAplicados.includes('checkTitle') ? '<span class="badge bg-primary text-white position-absolute top-0 start-0 m-2">Video</span>' : '';

    let imageContent;
    if (isPremium && imageCount > 1) {
        imageContent = createImageCarousel(imageSrcs, card.id);
    } else {
        imageContent = `<img src="${Array.isArray(imageSrcs) ? imageSrcs[0] : imageSrcs}" class="card-img-top" alt="${title}" style="height: 120px; object-fit: cover;">`;
    }

    const whatsappButton = beneficiosAplicados.includes('checkWhatsapp') ? 
        `<a href="https://wa.me/1234567890" class="btn btn-success btn-sm mt-2" target="_blank">Contactar por WhatsApp</a>` : '';

    card.innerHTML = `
    <div class="card h-100" style="width: 100%;">
        ${premiumBadge}
        ${imageBadge}
        ${videoBadge}
        ${imageContent}
        <div class="card-body p-2">
            <h5 class="card-title" style="font-size: 1rem;">${title}</h5>
            <p class="card-text" style="font-size: 0.9rem;"><b>Categoría:</b> ${category}</p>
            <p class="card-text" style="font-size: 0.9rem;"><b>Precio:</b> S/${price}</p>
            <div class="description-wrapper">
                <p class="card-text description-container" style="font-size: 0.8rem;">${truncateDescription(description, 3)}</p>
            </div>
            ${whatsappButton}
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
            fillPremiumEditModal(card.id, beneficiosAplicados);
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

// Función para crear un carrusel de imágenes
function createImageCarousel(imageSrcs, cardId) {
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

    return `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                ${carouselIndicators}
            </div>
            <div class="carousel-inner">
                ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;
}

// Función para actualizar el botón "Añadir Publicación"
function actualizarBotonAnadirPublicacion() {
    const addPostButton = document.querySelector('.add-post-button');
    if (addPostButton) {
        if (beneficiosSeleccionados.length > 0 || currentPlan === "Plus") {
            addPostButton.textContent = 'Añadir Publicación Premium';
            addPostButton.setAttribute('data-bs-target', '#addCustomPostModal');
        } else {
            addPostButton.textContent = 'Añadir Publicación';
            addPostButton.setAttribute('data-bs-target', '#addPostModal');
        }
    }
}

// Función para cambiar el plan
function changePlan(newPlan) {
    currentPlan = newPlan;
    updatePlanButtons();
    actualizarBotonAnadirPublicacion();
    if (newPlan !== "Personalizado") {
        beneficiosSeleccionados = [];
        document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        actualizarPrecioTotal();
    }
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
        button.disabled = isCurrentPlan;
    });

    // Actualizar el botón "Escoge tus beneficios"
    const customPlanButton = document.querySelector('.custom-plan-button');
    if (customPlanButton) {
        customPlanButton.classList.toggle('btn-success', currentPlan === "Personalizado");
        customPlanButton.classList.toggle('btn-secondary', currentPlan !== "Personalizado");
    }
}

// Función para crear el modal de beneficios
function crearModalBeneficios() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'beneficiosModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'beneficiosModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="beneficiosModalLabel">Beneficios Escogidos</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Estos son los beneficios que has seleccionado para tu plan personalizado:</p>
                    <div id="beneficiosSeleccionados"></div>
                    <div class="mt-3">
                        <strong>Precio Total: </strong><span id="precioTotalModal" class="text-success fs-4">S/0</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="confirmarBeneficios" data-bs-dismiss="modal" >Confirmar Selección</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Función para actualizar el modal con los beneficios seleccionados
function actualizarModalBeneficios() {
    const beneficiosSeleccionados = document.querySelectorAll('.custom-checkbox:checked');
    const contenedorBeneficios = document.getElementById('beneficiosSeleccionados');
    const precioTotalModal = document.getElementById('precioTotalModal');
    
    contenedorBeneficios.innerHTML = '';
    let precioTotal = 0;

    beneficiosSeleccionados.forEach(checkbox => {
        const beneficio = beneficios.find(b => b.id === checkbox.id);
        if (beneficio) {
            const beneficioElement = document.createElement('div');
            beneficioElement.className = 'form-check';
            beneficioElement.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${beneficio.precio}" id="modal${beneficio.id}" checked>
                <label class="form-check-label" for="modal${beneficio.id}">${beneficio.label}</label>
            `;
            contenedorBeneficios.appendChild(beneficioElement);
            precioTotal += beneficio.precio;

            beneficioElement.querySelector('input').addEventListener('change', (e) => {
                if (e.target.checked) {
                    precioTotal += beneficio.precio;
                } else {
                    precioTotal -= beneficio.precio;
                }
                precioTotalModal.textContent = `S/${precioTotal}`;
                
                document.getElementById(beneficio.id).checked = e.target.checked;
                actualizarPrecioTotal();
            });
        }
    });

    precioTotalModal.textContent = `S/${precioTotal}`;
}

// Función para actualizar el precio total en la tarjeta principal
function actualizarPrecioTotal() {
    const checkboxes = document.querySelectorAll('.custom-checkbox');
    let total = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total += parseFloat(checkbox.value);
        }
    });
    document.getElementById('total-price').textContent = `S/${total}`;
}

// Crear un nuevo modal para publicaciones con beneficios personalizados
function crearModalPublicacionPersonalizada() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'addCustomPostModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'addCustomPostModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCustomPostModalLabel">Nueva Publicación Premium</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="customPostForm">
                        <div class="mb-3">
                            <label for="customPostTitle" class="form-label">Título</label>
                            <input type="text" class="form-control" id="customPostTitle" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="customPostDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="customPostDescription" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="customPostCategory" class="form-label">Categoría</label>
                            <select class="form-select" id="customPostCategory" required>
                                <option value="" disabled selected>Selecciona una categoría</option>
                                <option value="vehiculos">Vehículos</option>
                                <option value="inmuebles">Inmuebles</option>
                                <option value="trabajo">Trabajo</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="customPostPrice" class="form-label">Precio</label>
                            <input type="number" class="form-control" id="customPostPrice" required>
                        </div>
                        <div id="customBenefitsContainer"></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="saveCustomPostButton">Guardar Publicación</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Función para actualizar el contenido del modal de publicación personalizada
function actualizarModalPublicacionPersonalizada() {
    const benefitsContainer = document.getElementById('customBenefitsContainer');
    benefitsContainer.innerHTML = '';

    const beneficiosActivos = currentPlan === "Plus" ? beneficios.map(b => b.id) : beneficiosSeleccionados;

    beneficiosActivos.forEach(beneficioId => {
        const beneficio = beneficios.find(b => b.id === beneficioId);
        if (beneficio) {
            if (beneficio.id === 'checkDescription') {
                benefitsContainer.innerHTML += `
                    <div class="mb-3">
                        <label for="customPostImages" class="form-label">Imágenes (máximo 5)</label>
                        <input type="file" class="form-control" id="customPostImages" accept="image/*" multiple>
                        <div id="imagePreviewContainer" class="d-flex flex-wrap mt-2"></div>
                    </div>
                `;
            } else if (beneficio.id === 'checkTitle') {
                benefitsContainer.innerHTML += `
                    <div class="mb-3">
                        <label for="customPostVideo" class="form-label">Video</label>
                        <input type="file" class="form-control" id="customPostVideo" accept="video/*">
                    </div>
                `;
            }
        }
    });

    // Agregar evento para previsualización de imágenes
    const imageInput = document.getElementById('customPostImages');
    if (imageInput) {
        imageInput.addEventListener('change', function(event) {
            const previewContainer = document.getElementById('imagePreviewContainer');
            previewContainer.innerHTML = '';
            const files = event.target.files;
            for (let i = 0; i < Math.min(files.length, 5); i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'img-thumbnail m-1';
                    img.style.width = '100px';
                    img.style.height = '100px';
                    img.style.objectFit = 'cover';
                    previewContainer.appendChild(img);
                }
                reader.readAsDataURL(file);
            }
        });
    }
}

// Evento para guardar una publicación personalizada
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveCustomPostButton').addEventListener('click', function() {
        const title = document.getElementById('customPostTitle').value;
        const description = document.getElementById('customPostDescription').value;
        const category = document.getElementById('customPostCategory').value;
        const price = document.getElementById('customPostPrice').value;
        const imageFiles = document.getElementById('customPostImages')?.files || [];
        const videoFile = document.getElementById('customPostVideo')?.files[0];

        if (title && description && category && price) {
            const imageSrcs = [];
            let loadedFiles = 0;
            const totalFiles = imageFiles.length + (videoFile ? 1 : 0);

            const processFile = (file, isVideo = false) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (isVideo) {
                        // Aquí puedes manejar el video si es necesario
                    } else {
                        imageSrcs.push(e.target.result);
                    }
                    loadedFiles++;
                    if (loadedFiles === totalFiles) {
                        const postContainer = document.getElementById('postContainer');
                        const beneficiosActivos = currentPlan === "Plus" ? beneficios.map(b => b.id) : beneficiosSeleccionados;
                        const card = createCard(title, description, imageSrcs, category, price, null, beneficiosActivos);
                        postContainer.appendChild(card);
                        updateNoPostsMessage();
                        document.getElementById('customPostForm').reset();

                        const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomPostModal'));
                        modal.hide();
                    }
                };
                reader.readAsDataURL(file);
            };

            if (imageFiles.length > 0) {
                Array.from(imageFiles).forEach(file => processFile(file));
            }
            if (videoFile) {
                processFile(videoFile, true);
            }
            if (totalFiles === 0) {
                // Si no hay archivos, crear la tarjeta inmediatamente
                const postContainer = document.getElementById('postContainer');
                const beneficiosActivos = currentPlan === "Plus" ? beneficios.map(b => b.id) : beneficiosSeleccionados;
                const card = createCard(title, description, [], category, price, null, beneficiosActivos);
                postContainer.appendChild(card);
                updateNoPostsMessage();
                document.getElementById('customPostForm').reset();

                const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomPostModal'));
                modal.hide();
            }
        } else {
            alert('Por favor, completa todos los campos requeridos.');
        }
    });
});

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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    crearModalBeneficios();
    crearModalPublicacionPersonalizada();
    actualizarBotonAnadirPublicacion();

    const botonEscogidos = document.querySelector('.custom-plan-button');
    botonEscogidos.setAttribute('data-bs-toggle', 'modal');
    botonEscogidos.setAttribute('data-bs-target', '#beneficiosModal');
    botonEscogidos.addEventListener('click', actualizarModalBeneficios);

    document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            actualizarPrecioTotal();
            actualizarModalBeneficios();
        });
    });

    document.getElementById('confirmarBeneficios').addEventListener('click', () => {
        beneficiosSeleccionados = Array.from(document.querySelectorAll('.custom-checkbox:checked')).map(cb => cb.id);
        actualizarBotonAnadirPublicacion();
        changePlan('Personalizado');
        const modal = bootstrap.Modal.getInstance(document.getElementById('beneficiosModal'));
        modal.hide();
    });

    document.querySelector('.add-post-button').addEventListener('click', () => {
        if (beneficiosSeleccionados.length > 0 || currentPlan === "Plus") {
            actualizarModalPublicacionPersonalizada();
        }
    });

    document.querySelectorAll('.plan-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const newPlan = this.closest('.card').querySelector('.plan-title').textContent;
            changePlan(newPlan);
        });
    });

    actualizarPrecioTotal();
    updatePlanButtons();
    updateNoPostsMessage();
    handleProfileImageUpload();
});

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
                updateProfilePicture(e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
}

// Función para actualizar la foto de perfil
function updateProfilePicture(imageSrc) {
    const profilePicture = document.getElementById('profilePicture');
    if (profilePicture) {
        profilePicture.src = imageSrc;
    }
}

// Agregar modal de edición al DOM
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
                            <label class="form-label">Imágenes (máximo 5)</label>
                            <div id="editPremiumImageContainer" class="d-flex flex-wrap gap-2 mb-2"></div>
                            <input type="file" class="form-control" id="editPremiumImageUpload" accept="image/*" multiple>
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
function fillPremiumEditModal(cardId, beneficiosAplicados) {
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

    editModal.dataset.currentCard = cardId;
    editModal.dataset.beneficiosAplicados = JSON.stringify(beneficiosAplicados);
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
    const beneficiosAplicados = JSON.parse(editModal.dataset.beneficiosAplicados || '[]');

    const newTitle = document.getElementById('editPremiumTitle').value.trim();
    const newDescription = document.getElementById('editPremiumDescription').value.trim();
    const newCategory = document.getElementById('editPremiumCategory').value.trim();
    const newPrice = document.getElementById('editPremiumPrice').value.trim();
    const newImages = Array.from(document.getElementById('editPremiumImageContainer').children).map(wrapper => wrapper.querySelector('img').src);

    if (newTitle && newDescription && newCategory && newPrice && newImages.length > 0) {
        card.querySelector('.card-title').textContent = newTitle;
        card.querySelector('.card-text:nth-child(2)').innerHTML = `<b>Categoría:</b> ${newCategory}`;
        card.querySelector('.card-text:nth-child(3)').innerHTML = `<b>Precio:</b> S/${newPrice}`;
        card.querySelector('.description-container').textContent = truncateDescription(newDescription, 3);
        card.setAttribute('data-full-description', newDescription);
        card.setAttribute('data-images', JSON.stringify(newImages));

        // Actualizar el carrusel de imágenes
        const carouselInner = card.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';
        const carouselIndicators = card.querySelector('.carousel-indicators');
        carouselIndicators.innerHTML = '';

        newImages.forEach((src, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            carouselItem.innerHTML = `<img src="${src}" class="d-block w-100" alt="Image ${index + 1}" style="height: 120px; object-fit: cover;">`;
            carouselInner.appendChild(carouselItem);

            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', `#carousel-${cardId}`);
            indicator.setAttribute('data-bs-slide-to', index.toString());
            if (index === 0) {
                indicator.className = 'active';
                indicator.setAttribute('aria-current', 'true');
            }
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);
        });

        // Actualizar el badge de imágenes
        const imageBadge = card.querySelector('.badge.bg-info');
        if (imageBadge) {
            imageBadge.textContent = newImages.length > 1 ? `${newImages.length} imágenes` : '1 imagen';
        } else if (newImages.length > 1) {
            const newBadge = document.createElement('span');
            newBadge.className = 'badge bg-info text-dark position-absolute top-0 start-0 m-2';
            newBadge.textContent = `${newImages.length} imágenes`;
            card.querySelector('.card').prepend(newBadge);
        }

        // Actualizar otros badges y botones según los beneficios aplicados
        const premiumBadge = card.querySelector('.badge.bg-warning');
        if (!premiumBadge) {
            const newPremiumBadge = document.createElement('span');
            newPremiumBadge.className = 'badge bg-warning text-dark position-absolute top-0 end-0 m-2';
            newPremiumBadge.textContent = 'Premium';
            card.querySelector('.card').prepend(newPremiumBadge);
        }

        const videoBadge = card.querySelector('.badge.bg-primary');
        if (beneficiosAplicados.includes('checkTitle') && !videoBadge) {
            const newVideoBadge = document.createElement('span');
            newVideoBadge.className = 'badge bg-primary text-white position-absolute top-0 start-0 m-2';
            newVideoBadge.textContent = 'Video';
            card.querySelector('.card').prepend(newVideoBadge);
        } else if (!beneficiosAplicados.includes('checkTitle') && videoBadge) {
            videoBadge.remove();
        }

        const whatsappButton = card.querySelector('.btn-success');
        if (beneficiosAplicados.includes('checkWhatsapp') && !whatsappButton) {
            const newWhatsappButton = document.createElement('a');
            newWhatsappButton.href = 'https://wa.me/1234567890';
            newWhatsappButton.className = 'btn btn-success btn-sm mt-2';
            newWhatsappButton.target = '_blank';
            newWhatsappButton.textContent = 'Contactar por WhatsApp';
            card.querySelector('.card-body').insertBefore(newWhatsappButton, card.querySelector('.card-body').lastElementChild);
        } else if (!beneficiosAplicados.includes('checkWhatsapp') && whatsappButton) {
            whatsappButton.remove();
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

// Editar Datos de Perfil
document.addEventListener('DOMContentLoaded', () => {
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

    document.getElementById('editModal').addEventListener('show.bs.modal', () => {
        for (const field in editFormFields) {
            editFormFields[field].value = mainFormFields[field].value;
        }
    });

    document.getElementById('saveChangesButton').addEventListener('click', () => {
        for (const field in editFormFields) {
            mainFormFields[field].value = editFormFields[field].value;
        }

        const profileImageUpload = document.getElementById('profileImageUpload');
        const profileImagePreview = document.getElementById('profileImagePreview');
        const imageFiles = profileImageUpload.files;

        if (imageFiles.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImagePreview.src = e.target.result;
                updateProfilePicture(e.target.result);
            };
            reader.readAsDataURL(imageFiles[0]);
        }
    });

    const modalImageUpload = document.getElementById('profileImageUpload');
    modalImageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileImagePreview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

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