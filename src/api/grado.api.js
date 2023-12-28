// IMPORTACION DE LA LISTA DE DOMINIOS
import axios from 'axios';
//import { useHistory } from 'react-router-dom';

// RUTA BASE DE REDIRECCIONAMIENTO
const baseurl = axios.create({
    baseURL: 'https://django-server-production-3a07.up.railway.app/',
})

// Listado de niveles a través de un mpéodo de la REST API
export const NivelListado = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get('wapiptdah/aplicacion/grado/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los niveles: " + error.message);
    }
}

// Crear nivel a través de un método de la REST API
export const NivelCrear = (grado) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.post('wapiptdah/aplicacion/grado/', grado,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede crear el grado: " + error.message);
    }
}

// Crear nivel a través de un método directo
export const CrearNivelNew = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/registro_nivel/', datos__post, {
            headers: {
                'Authorization': `Bearer ${token}`
                //'Authorization': `Token ${token}`
            }
        });
    } catch (error) {
        throw new Error("No se puede crear el nivel: " + error.message);
    }
}

// Nivel individual
// Obtener los datos del registro de nivel
export const NivelIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/grado/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder al registro del nivel: " + error.message);
    }
}

// Editar nivel
// Edicion de niveles mediante un método de la REST API
export const NivelEditar = (id, grado) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        const response = baseurl.put(`wapiptdah/aplicacion/grado/${id}/`, grado,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return response;
    } catch (error) {
        if (error.response) {
            // Manejar errores de respuesta del servidor
            if (error.response.data.nombre) {
                // Error de validación del nombre
                console.error("Error de nombre:", error.response.data.nombre);
            }
        } else if (error.message === "NOT_AUTHENTICATED") {
            // Manejar error de autenticación
            console.error("No autenticado. Inicie sesión para realizar esta acción.");
        } else {
            // Manejar otros errores desconocidos
            console.error("Error desconocido al editar el dominio:", error.message);
        }
    }
}

/* *** METODOS COMUNES *** */
// Verificación de la existencia de un registro de nivel
export const VerificarNivel = async (slug) => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/verificar/nivel/${slug}/`, {
            headers: {
                'Authorization': `Bearer ${tokenLocal}`
                //'Authorization': `Token ${tokenLocal}`
            }
        });
    } catch (error) {
        throw new Error("No se puede verificar el nivel: " + error.message);
    }
}

// Eliminar nivel
export const NivelEliminar = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.delete(`wapiptdah/aplicacion/grado/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede eliminar el nivel: " + error.message);
    }
}

// Contacto
// Envío de correo de contacto
export const EnviarCorreo = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/contacto/', datos__post, {
            headers: {
                'Authorization': `Bearer ${token}`
                //'Authorization': `Token ${token}`
            }
        });
    } catch (error) {
        throw new Error("No se pudo enviar el correo: " + error.message);
    }
}


// Verificación de la existencia de un registro de nivel
export const VerificarNumeronivel = async () => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/estudio/verificar/numero/niveles/', {
            headers: {
                'Authorization': `Bearer ${tokenLocal}`
            }
        });
    } catch (error) {
        throw new Error("No se puede verificar el nivel: " + error.message);
    }
}
