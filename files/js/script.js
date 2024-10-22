document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('main-content');
    const products = document.querySelectorAll('.product-item');
    const productCheckboxes = document.querySelectorAll('.product-checkbox'); // Seleccionar checkboxes
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const downloadExcelBtn = document.getElementById('downloadExcel');
    const downloadButton = document.getElementById('filterButton');
    const categories = document.querySelectorAll('#sidebar ul li ul li a:not(.no-highlight)'); // Excluir enlaces con .no-highlight

    // Función para mostrar productos de una categoría específica
    function showCategory(category) {
        products.forEach(function (product) {
            if (product.classList.contains(category)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        animateProducts(); // Aplicar la animación al cambiar de categoría
    }

    // Función para activar una categoría
    function activateCategory(selectedCategory) {
        categories.forEach(function (category) {
            category.classList.remove('active'); // Elimina 'active' de las categorías
        });
        selectedCategory.classList.add('active'); // Activa la categoría seleccionada
    }

    // Mostrar checkboxes cuando se pulsa descargar PDF o Excel
    function showCheckboxes() {
        productCheckboxes.forEach(checkbox => {
            checkbox.style.display = 'block';
        });
    }

    // Ocultar checkboxes después de descargar anuncios
    function hideCheckboxes() {
        productCheckboxes.forEach(checkbox => {
            checkbox.style.display = 'none';
            checkbox.checked = false; // Desmarcar todas las casillas
        });
    }

    // Evento para mostrar checkboxes al pulsar descargar PDF y cerrar sidebar
    downloadPdfBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showCheckboxes();
        hideSidebar();  // Cerrar el sidebar al pulsar descargar PDF
    });

    // Evento para mostrar checkboxes al pulsar descargar Excel y cerrar sidebar
    downloadExcelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showCheckboxes();
        hideSidebar();  // Cerrar el sidebar al pulsar descargar Excel
    });

    // Evento para ocultar checkboxes al pulsar "Descargar Anuncios"
    downloadButton.addEventListener('click', function (e) {
        e.preventDefault();
        hideCheckboxes();
        alert('Anuncios descargados');
    });

    // Agregar evento a cada enlace de categoría
    categories.forEach(function (category) {
        category.addEventListener('click', function (e) {
            e.preventDefault();
            const categoryClass = this.textContent.trim().toLowerCase(); // Convertir nombre de la categoría en clase
            showCategory(categoryClass);

            // Activar la categoría seleccionada
            activateCategory(this);

            // Ocultar el sidebar y overlay después de seleccionar una categoría
            hideSidebar();
        });
    });

    // Mostrar la primera categoría por defecto (Vehículos) y activar la vista de cuadrícula
    const defaultCategory = 'vehículos';
    showCategory(defaultCategory);
    activateCategory(categories[0]); // Asegúrate de que esto se corresponda con el elemento "Vehículos" correcto

    // Establecer la vista de cuadrícula como activa al cargar
    productContainer.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');

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

    // Funciones para mostrar y ocultar el sidebar
    function showSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
    }

    function hideSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    }

    // Evento para mostrar/ocultar el sidebar
    sidebarToggle.addEventListener('click', function () {
        if (sidebar.classList.contains('show')) {
            hideSidebar();
        } else {
            showSidebar();
        }
    });

    overlay.addEventListener('click', hideSidebar);

    // Función para animar la aparición de los productos
    function animateProducts() {
        products.forEach((product, index) => {
            product.classList.remove('show');
            setTimeout(() => {
                product.classList.add('show');
            }, index * 100);
        });
    }

    // Animar productos al cargar la página
    animateProducts();
});