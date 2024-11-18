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
});
function validateForm() {
    const form = document.getElementById('registrationForm');
    if (!form.checkValidity()) {
        alert('Por favor, completa el formulario correctamente.');
    } else {
        alert('¡Registro exitoso!');
        // Aquí puedes enviar el formulario con Ajax o redirigir al usuario.
    }
    form.classList.add('was-validated');
}
document.addEventListener('DOMContentLoaded', () => {
    const birthdateInput = document.getElementById('birthdate');
    const today = new Date();
    const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );

    // Formatear la fecha como "YYYY-MM-DD"
    const maxDate = eighteenYearsAgo.toISOString().split('T')[0];

    // Establecer el atributo `max` dinámicamente
    birthdateInput.setAttribute('max', maxDate);
});
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('main-content');
    const products = document.querySelectorAll('.product-item');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const downloadExcelBtn = document.getElementById('downloadExcel');
    const downloadButton = document.getElementById('filterButton');
    const categories = document.querySelectorAll('#sidebar ul li ul li a:not(.no-highlight)');
    
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));

    // Selección de elementos del modal
    const modalTitle = document.getElementById('productModalLabel');
    const modalImage = document.getElementById('productModalImage');
    const modalDescription = document.getElementById('productModalDescription');
    const modalPrice = document.getElementById('productModalPrice');

    // Función para mostrar el modal con los datos extraídos de los elementos internos de la tarjeta
    function showModal(product) {
        // Extraer datos directamente de los elementos internos
        const productName = product.querySelector('.card-title').textContent;
        const productDescription = product.querySelector('.card-text').textContent;
        const productImage = product.querySelector('img').src;
        const productPrice = product.querySelector('.card-price').textContent;

        // Actualizar el contenido del modal
        modalTitle.textContent = productName || 'Sin título';
        modalDescription.textContent = productDescription || 'Sin descripción';
        modalImage.src = productImage || 'https://via.placeholder.com/150';
        modalImage.alt = productName || 'Sin título';
        modalPrice.textContent = productPrice || 'Sin precio';

        // Mostrar el modal
        productModal.show();
    }

    // Mostrar checkboxes solo cuando se elige descargar
    function showCheckboxes() {
        productCheckboxes.forEach(checkbox => {
            checkbox.style.display = 'block';
        });
    }

    // Ocultar checkboxes después de descargar anuncios
    function hideCheckboxes() {
        productCheckboxes.forEach(checkbox => {
            checkbox.style.display = 'none';
            checkbox.checked = false;
        });
    }

    // Función para mostrar productos de una categoría específica
    function showCategory(category) {
        products.forEach(function (product) {
            product.style.display = product.classList.contains(category) ? 'block' : 'none';
        });
        animateProducts();
    }

    // Activar una categoría
    function activateCategory(selectedCategory) {
        categories.forEach(category => category.classList.remove('active'));
        selectedCategory.classList.add('active');
    }

    // Funciones de vista de cuadrícula y lista
    gridViewBtn.addEventListener('click', function () {
        productContainer.classList.remove('list-view');
        productContainer.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        hideSidebar();
        animateProducts();
    });

    listViewBtn.addEventListener('click', function () {
        productContainer.classList.remove('grid-view');
        productContainer.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        hideSidebar();
        animateProducts();
    });

    // Mostrar/ocultar el sidebar
    function showSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
    }

    function hideSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    }

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.contains('show') ? hideSidebar() : showSidebar();
    });

    overlay.addEventListener('click', hideSidebar);

    // Animación de productos
    function animateProducts() {
        products.forEach((product, index) => {
            product.classList.remove('show');
            setTimeout(() => product.classList.add('show'), index * 100);
        });
    }

    // Mostrar checkboxes al pulsar descargar PDF y cerrar sidebar
    downloadPdfBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showCheckboxes();
        hideSidebar();
    });

    // Mostrar checkboxes al pulsar descargar Excel y cerrar sidebar
    downloadExcelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showCheckboxes();
        hideSidebar();
    });

    // Evento para ocultar checkboxes al finalizar la descarga
    downloadButton.addEventListener('click', function (e) {
        e.preventDefault();
        hideCheckboxes();
        alert('Anuncios descargados');
    });

    // Evento para cada enlace de categoría
    categories.forEach(function (category) {
        category.addEventListener('click', function (e) {
            e.preventDefault();
            const categoryClass = this.textContent.trim().toLowerCase();
            showCategory(categoryClass);
            activateCategory(this);
            hideSidebar();
        });
    });

    // Establecer la vista de cuadrícula y activar "Vehículos" por defecto
    const defaultCategory = 'vehículos';
    showCategory(defaultCategory);
    activateCategory(categories[0]);
    productContainer.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    animateProducts();

    // Prevenir apertura del modal al hacer clic en checkbox
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // Añadir evento a cada tarjeta para abrir el modal solo al hacer clic en el título o la imagen
    products.forEach(product => {
        const productTitle = product.querySelector('.product-title');
        const productImg = product.querySelector('.product-img');

        // Asociar la función showModal al clic en el título y la imagen
        productTitle.addEventListener('click', function () {
            showModal(product);
        });

        productImg.addEventListener('click', function () {
            showModal(product);
        });
    });
});

// Seleccionar el botón de reportar anuncio y el modal de reporte
const reportButton = document.getElementById('reportButton');
const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));

// Añadir evento al botón de reportar anuncio
reportButton.addEventListener('click', function () {
    // Mostrar el modal de reporte cuando se hace clic en el botón
    reportModal.show();
});

document.getElementById('addProductForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productImage = document.getElementById('productImage').files[0];
    
    // Redes sociales seleccionadas
    const socialLinks = {
        whatsapp: document.getElementById('socialWhatsApp').checked,
        facebook: document.getElementById('socialFacebook').checked,
        twitter: document.getElementById('socialTwitter').checked,
    };

    // Crear el contenedor del anuncio
    const newProduct = document.createElement('div');
    newProduct.classList.add('col-12', 'col-md-4', 'col-sm-6', 'col-lg-3', 'product-item', 'vehículos');

    // Crear la tarjeta de anuncio
    const card = `
        <div class="card h-100">
            <img src="${URL.createObjectURL(productImage)}" class="card-img-top product-img" alt="${productName}">
            <div class="card-body">
                <input type="checkbox" class="product-checkbox form-check-input">
                <p class="card-price fw-bold text-success">${productPrice}</p>
                <h5 class="card-title product-title">${productName}</h5>
                <p class="card-text">${productDescription}</p>
                <div class="d-flex justify-content-between">
                    ${socialLinks.whatsapp ? `<a href="#" class="btn btn-sm btn-outline-success bi bi-whatsapp" title="WhatsApp"></a>` : ''}
                    ${socialLinks.facebook ? `<a href="#" class="btn btn-sm btn-outline-primary bi bi-facebook" title="Facebook"></a>` : ''}
                    ${socialLinks.twitter ? `<a href="#" class="btn btn-sm btn-outline-dark bi bi-twitter" title="Twitter"></a>` : ''}
                </div>
            </div>
        </div>
    `;
    newProduct.innerHTML = card;

    // Agregar el anuncio al contenedor principal
    document.getElementById('VehicleContainer').appendChild(newProduct);

    // Cerrar el modal y limpiar el formulario
    const addProductModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    addProductModal.hide();
    document.getElementById('addProductForm').reset();
});