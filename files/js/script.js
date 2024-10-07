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
