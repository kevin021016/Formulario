document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const registroExitoso = urlParams.get('registro');

    if (registroExitoso === 'exitoso') {
        Swal.fire({
            title: 'Registro exitoso',
            text: 'El usuario ha sido registrado correctamente',
            icon: 'success',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false
        }).then(() => {
            window.location.href = '/';  // Recargar la página en el formulario
        });
    }
});