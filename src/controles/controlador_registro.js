/* ********** Importaciones ********** */
import Swal from "sweetalert2";

/* ********** Funciones para enviar mensajes ********** */
var isInfoShown = false
export function info__dominio() {
    if (!isInfoShown) {
        Swal.fire({
            title: "Atencion!",
            text: "Ingresa una descripción corta",
            icon: "info",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Lo entiendo!",
            showClass: {
                popup: "animated fadeInDownBig", // Clase de animación personalizada para mostrar el SweetAlert
            },
            hideClass: {
                popup: "animated fadeOutUpBig", // Clase de animación personalizada para ocultar el SweetAlert
            },
        });
        isInfoShown = false;
    }
}

export function info__nivel() {
    if (!isInfoShown) {
        Swal.fire({
            title: "Atencion!",
            text: "Ingresa una descripción que identifique el nivel",
            icon: "info",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Lo entiendo!",
            showClass: {
                popup: "animated fadeInDownBig", // Clase de animación personalizada para mostrar el SweetAlert
            },
            hideClass: {
                popup: "animated fadeOutUpBig", // Clase de animación personalizada para ocultar el SweetAlert
            },
        });
        isInfoShown = false;
    }
}

export function info__contenido() {
    if (!isInfoShown) {
        Swal.fire({
            title: "Atencion!",
            text: "Ingresa la indicación para la actividad.\nSi son preguntas multiples previo a una pregunta usa ',' para separarlas.",
            icon: "info",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Lo entiendo!",
            showClass: {
                popup: "animated fadeInDownBig", // Clase de animación personalizada para mostrar el SweetAlert
            },
            hideClass: {
                popup: "animated fadeOutUpBig", // Clase de animación personalizada para ocultar el SweetAlert
            },
        });
        isInfoShown = true;
    }
}
var isInfoShown_two = false
export function info__contenido__respuesta() {
    if (!isInfoShown_two) {
        Swal.fire({
            title: "Atencion!",
            text: "Ingresa las respuestas para la actividad.\nSi son respuestas multiples previo a una usa ',' para separarlas.",
            icon: "info",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Lo entiendo!",
            showClass: {
                popup: "animated fadeInDownBig", // Clase de animación personalizada para mostrar el SweetAlert
            },
            hideClass: {
                popup: "animated fadeOutUpBig", // Clase de animación personalizada para ocultar el SweetAlert
            },
        });
        isInfoShown_two = true;
    }
}

