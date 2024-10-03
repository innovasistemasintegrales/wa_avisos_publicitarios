document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productContainer = document.getElementById('productContainer');
    const innovaTrabajosContainer = document.getElementById('innovaTrabajosContainer');
    const vehiclesContainer = document.querySelectorAll('.product-item');

    function showVehicles() {
        // Muestra las tarjetas de vehículos y oculta InnovaTrabajos
        vehiclesContainer.forEach(item => item.style.display = 'block');
        if (innovaTrabajosContainer) innovaTrabajosContainer.classList.add('hide');
    }

    function showInnovaTrabajos() {
        // Oculta todas las tarjetas de vehículos
        vehiclesContainer.forEach(item => item.style.display = 'none');
        // Muestra las tarjetas de InnovaTrabajos
        if (innovaTrabajosContainer) {
            innovaTrabajosContainer.classList.remove('hide');
            innovaTrabajosContainer.style.display = 'flex';
        }
    }

    function animateProducts() {
        const products = document.querySelectorAll('.product-item');
        products.forEach((product, index) => {
            product.classList.remove('show');
            setTimeout(() => {
                product.classList.add('show');
            }, index * 100);
        });
    }

    // Agregar evento a los elementos del menú
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', function () {
            const category = this.textContent.trim();
            if (category === 'InnovaTrabajos') {
                showInnovaTrabajos();
            } else if (category === 'Vehículos') {
                showVehicles();
            }
            
            // Oculta el sidebar y overlay después de seleccionar una categoría
            hideSidebar();
            
            // Reiniciar y activar las animaciones de las tarjetas
            animateProducts();
        });
    });

    gridViewBtn.addEventListener('click', function () {
        productContainer.classList.remove('list-view');
        productContainer.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        
        // Ocultar el sidebar y aplicar animación
        hideSidebar();
        animateProducts(); // Animar productos al cambiar a vista de cuadrícula
    });

    listViewBtn.addEventListener('click', function () {
        productContainer.classList.remove('grid-view');
        productContainer.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        
        // Ocultar el sidebar y aplicar animación
        hideSidebar();
        animateProducts(); // Animar productos al cambiar a vista de lista
    });

    function showSidebar() {
        sidebar.classList.add('show');
        overlay.classList.add('show');
    }

    function hideSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    }

    sidebarToggle.addEventListener('click', function () {
        if (sidebar.classList.contains('show')) {
            hideSidebar();
        } else {
            showSidebar();
        }
    });

    overlay.addEventListener('click', hideSidebar);

    // Animar productos al cargar la página
    animateProducts();
});