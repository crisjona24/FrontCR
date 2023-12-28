
/* *** Cierra la sesión del usuario *** */
export function cerrarSesion(token) {
    // Almacena el token y la hora actual en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('loginTimestamp', Date.now());

    // Redirige a la página de inicio
    salir();

}

function salir (){
    setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTimestamp'); // Elimina el token
        window.location = "/login";
    }, 3600000);
}

export function onPageLoad() {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    const elapsedTime = Date.now() - loginTimestamp;

    // Si han pasado más de 1 hora desde el inicio de sesión
    if (elapsedTime >= 3600000) {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTimestamp'); 
        window.location = "/login";
    } else {
        // Establece un temporizador para el tiempo restante
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('loginTimestamp');
            window.location = "/login";
        }, 3600000 - elapsedTime);
    }
}

