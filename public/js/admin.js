const socket = io('/admin');

// Obtén referencias a los elementos del menú y las secciones
const usuariosTab = document.getElementById('usuarios-tab');
const categoriasTab = document.getElementById('categorias-tab');
const reportesTab = document.getElementById('reportes-tab');
const perfilTab = document.getElementById('perfil-tab');  // Nuevo enlace para perfil

const usuariosSection = document.getElementById('usuarios-section');
const categoriasSection = document.getElementById('categorias-section');
const reportesSection = document.getElementById('reportes-section');
const perfilSection = document.getElementById('perfil-section');  // Nueva sección de perfil

// Función para ocultar todas las secciones
function hideAllSections() {
    usuariosSection.style.display = 'none';
    categoriasSection.style.display = 'none';
    reportesSection.style.display = 'none';
    perfilSection.style.display = 'none';  // Ocultar también la sección de perfil
}

// Mostrar la sección de Usuarios al cargar la página
hideAllSections();
usuariosSection.style.display = 'block';

// Event Listeners para cambiar entre secciones
usuariosTab.addEventListener('click', function () {
    hideAllSections();
    usuariosSection.style.display = 'block';
});

categoriasTab.addEventListener('click', function () {
    hideAllSections();
    categoriasSection.style.display = 'block';
});

reportesTab.addEventListener('click', function () {
    hideAllSections();
    reportesSection.style.display = 'block';
});

// Nuevo listener para mostrar la sección de "Ajustes del Perfil"
perfilTab.addEventListener('click', function () {
    hideAllSections();
    perfilSection.style.display = 'block';  // Mostrar la sección de perfil
});

// Selecciona todos los enlaces de la navegación
const navLinks = document.querySelectorAll("nav ul li a");

// Recorre cada enlace y añade un evento de clic
navLinks.forEach((link) => {
  link.addEventListener("click", function() {
    // Elimina la clase 'active' de todos los enlaces
    navLinks.forEach((navLink) => navLink.classList.remove("active"));
    
    // Agrega la clase 'active' al enlace en el que se hizo clic
    this.classList.add("active");
  });
});

// Función para manejar el clic en el botón de guardar en el modal (Categorías)
const saveCategoryButton = document.getElementById('save-category');
saveCategoryButton.addEventListener('click', function() {
    // Obtener los valores de los campos del formulario
    const categoryName = document.getElementById('category-name').value;
    const categoryDescription = document.getElementById('category-description').value;
    const categoryCount = document.getElementById('category-count').value; // Valor de la cantidad de anuncios
    const categoryDate = document.getElementById('category-date').value;   // Valor de la fecha de creación

    // Mostrar los datos en la consola (o hacer lo que sea necesario con ellos)
    console.log('Nueva Categoría:', {
        name: categoryName,
        description: categoryDescription,
        count: categoryCount,
        date: categoryDate
    });

    // Cerrar el modal
    const modal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    modal.hide();
});