document.addEventListener('DOMContentLoaded', function() {
    // Selector de inputs
    const inputs = document.querySelectorAll(".login-input");

    // Agregar listeners a cada input
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Añade la clase 'focus' al contenedor padre cuando el input tiene foco
            let parent = this.parentNode;
            parent.classList.add('focus');
        });

        input.addEventListener('blur', function() {
            // Si el input está vacío al perder el foco, quita la clase 'focus'
            if (this.value === "") {
                let parent = this.parentNode;
                parent.classList.remove('focus');
            }
        });
    });

    // Validación del formulario de registro
    const registrationForm = document.getElementById('registrationForm');
    const birthdateInput = document.getElementById('birthdate');

    // Establecer la fecha máxima permitida para ser mayor de 18 años
    const today = new Date();
    const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );
    const maxDate = eighteenYearsAgo.toISOString().split('T')[0];
    birthdateInput.setAttribute('max', maxDate);

    // Validación del formulario de registro
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!registrationForm.checkValidity()) {
            alert('Por favor, completa el formulario correctamente.');
        } else {
            alert('¡Registro exitoso!');
            registrationForm.reset();
            const registrationModal = bootstrap.Modal.getInstance(
                document.getElementById('registrationModal')
            );
            registrationModal.hide();
        }
        registrationForm.classList.add('was-validated');
    });
});