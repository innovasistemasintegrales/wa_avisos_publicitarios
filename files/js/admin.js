// Obtén referencias a los elementos del menú y las secciones
const usuariosTab = document.getElementById('usuarios-tab');
const categoriasTab = document.getElementById('categorias-tab');
const reportesTab = document.getElementById('reportes-tab');

const usuariosSection = document.getElementById('usuarios-section');
const categoriasSection = document.getElementById('categorias-section');
const reportesSection = document.getElementById('reportes-section');

// Función para ocultar todas las secciones
function hideAllSections() {
    usuariosSection.style.display = 'none';
    categoriasSection.style.display = 'none';
    reportesSection.style.display = 'none';
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