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