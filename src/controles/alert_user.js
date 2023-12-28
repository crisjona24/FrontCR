/* ********** Importaciones ********** */
import Swal from "sweetalert2";

/* ********** Funcion para controlar tamaño de imagen subida ********** */

export function validarTamanoImagen(input) {
    const maxTamanoMB = 2; // Tamaño máximo permitido en MB
    const minTamanoMB = 0.01; // Tamaño mínimo permitido en MB

    if (input.files && input.files[0]) {
        const tamanoMB = input.files[0].size / 1024 / 1024; // Convertir tamaño de bytes a MB
        if (tamanoMB > maxTamanoMB) {
            let mensaje =
                "La imagen es demasiado grande. El tamaño máximo permitido es de " +
                maxTamanoMB +
                " MB.";
            alerta__contenido(mensaje);
            input.value = ""; // Limpiar el campo de entrada para evitar que se envíe el archivo incorrecto
        } else if (tamanoMB < minTamanoMB) {
            let mensaje =
                "La imagen es demasiado pequeña. El tamaño mínimo permitido es de " +
                minTamanoMB +
                " MB.";
            alerta__contenido(mensaje);
            input.value = ""; // Limpiar el campo de entrada para evitar que se envíe el archivo incorrecto
        }
    }
}

function alerta__contenido(mensaje) {
    Swal.fire({
        title: "Atención",
        html: '<div style="font-size: 1.3rem;">' + mensaje + "</div>",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        showClass: {
            popup: "animated fadeInDownBig", // Clase de animación personalizada para mostrar el SweetAlert
        },
        hideClass: {
            popup: "animated fadeOutUpBig", // Clase de animación personalizada para ocultar el SweetAlert
        },
        timer: 4000, // Duración en milisegundos
        timerProgressBar: true, // Agregar una barra de progreso
    });
}

/* Funcion para cambiar el color de fondo */
export function cambiarColorFondo() {
    var select = document.getElementById("colorSelect");
    var colorSeleccionado = select.value;
    /* cargar color al local storge*/
    localStorage.setItem("color", colorSeleccionado);
    var section = document.getElementById("mysection");
    //var section2 = document.getElementById("mysection2");
    section.style.backgroundColor = colorSeleccionado;
    //section2.style.backgroundColor = colorSeleccionado;
}

/* Descarga de archivos */
export function handleDownload(url) {
    fetch(url)
        .then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Peticion_Archivo.pdf';  // proporciona el nombre que deseas

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        })
        .catch(() => alert('Hubo un error al intentar descargar el archivo'));
}