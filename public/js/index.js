/* Script para frontend */
const socket = io('/index');

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
        const productName = product.querySelector('.card-title').textContent;
        const productDescription = product.querySelector('.card-text').textContent;
        const productImage = product.querySelector('img').src;
        const productPrice = product.querySelector('.card-price').textContent;

        modalTitle.textContent = productName || 'Sin título';
        modalDescription.textContent = productDescription || 'Sin descripción';
        modalImage.src = productImage || 'https://via.placeholder.com/150';
        modalImage.alt = productName || 'Sin título';
        modalPrice.textContent = productPrice || 'Sin precio';

        productModal.show();
    }

    function showCheckboxes() {
        productCheckboxes.forEach(checkbox => {
            checkbox.style.display = 'block';
        });
    }

    function hideCheckboxes() {
        productCheckboxes.forEach(checkbox => {
            checkbox.style.display = 'none';
            checkbox.checked = false;
        });
    }

    function showCategory(category) {
        products.forEach(function (product) {
            product.style.display = product.classList.contains(category) ? 'block' : 'none';
        });
        animateProducts();
    }

    function activateCategory(selectedCategory) {
        categories.forEach(category => category.classList.remove('active'));
        selectedCategory.classList.add('active');
    }

    function animateProducts() {
        products.forEach((product, index) => {
            product.classList.remove('show');
            setTimeout(() => product.classList.add('show'), index * 100);
        });
    }

    function disableBodyScroll() {
        document.body.style.overflow = 'hidden';
    }

    function enableBodyScroll() {
        document.body.style.overflow = '';
    }

    function showSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        disableBodyScroll();
    }

    function hideSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        enableBodyScroll();
    }

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.contains('show') ? hideSidebar() : showSidebar();
    });

    overlay.addEventListener('click', hideSidebar);

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

    downloadPdfBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showCheckboxes();
        hideSidebar();
    });

    downloadExcelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showCheckboxes();
        hideSidebar();
    });

    downloadButton.addEventListener('click', function (e) {
        e.preventDefault();
        hideCheckboxes();
        alert('Anuncios descargados');
    });

    categories.forEach(function (category) {
        category.addEventListener('click', function (e) {
            e.preventDefault();
            const categoryClass = this.textContent.trim().toLowerCase();
            showCategory(categoryClass);
            activateCategory(this);
            hideSidebar();
        });
    });

    const defaultCategory = 'vehículos';
    showCategory(defaultCategory);
    activateCategory(categories[0]);
    productContainer.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    animateProducts();

    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    products.forEach(product => {
        const productTitle = product.querySelector('.product-title');
        const productImg = product.querySelector('.product-img');

        productTitle.addEventListener('click', function () {
            showModal(product);
        });

        productImg.addEventListener('click', function () {
            showModal(product);
        });
    });
});