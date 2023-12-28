// IMPORTACION DE LA LISTA DE DOMINIOS
import axios from 'axios';
//import { useHistory } from 'react-router-dom';

// RUTA BASE DE REDIRECCIONAMIENTO
const baseurl = axios.create({
    baseURL: 'https://django-server-production-3a07.up.railway.app/',
})

// Lista de dominios obtenidos mediante un método de la REST API
export const DominiosListado = (page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/dominio/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a dominios: " + error.message);
    }
}

// Lista de dominios obtenidos mediante un método de la REST API
export const DominiosListadoSolo = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get('wapiptdah/aplicacion/dominios/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a dominios: " + error.message);
    }
}

// Crear dominio a través de un método de la REST API
export const DominiosCrear = (dominio) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.post('wapiptdah/aplicacion/dominio/', dominio,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede crear el dominio: " + error.message);
    }
}

// Crear dominio a través de un método directo
export const CrearDominioNew = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/registro_dominio/', datos__post, {
            headers: {
                'Authorization': `Bearer ${token}`
                //'Authorization': `Token ${token}`
            }
        });
    } catch (error) {
        throw new Error("No se puede crear el dominio: " + error.message);
    }
}

// Datos individuales de un dominio a través de un método de la REST API
export const DominioIndividual = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/aplicacion/dominio/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los datos del dominio: " + error.message);
    }
}

// Editar dominio a través de un método de la REST API
export const DominioEditar = async (id, dominio) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        const response = baseurl.put(`wapiptdah/aplicacion/dominio/${id}/`, dominio,
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
            if (error.response.data.portada_dominio) {
                // Error relacionado con la portada_dominio
                console.error("Error de portada_dominio:", error.response.data.portada_dominio);
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

// Método para verificar si el dominio existe
export const VerificarDominio = async (slug) => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/verificar/dominio/${slug}/`, {
            headers: {
                'Authorization': `Bearer ${tokenLocal}`
                //'Authorization': `Token ${tokenLocal}`
            }
        });
    } catch (error) {
        throw new Error("No se puede verificar el contenido: " + error.message);
    }
}

// Método para eliminar un registro de Dominio
export const DominioEliminar = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.delete(`wapiptdah/aplicacion/dominio/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede eliminar el dominio: " + error.message);
    }
}

// Edición de dominio manual
export const EditarDominioManual = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/editar/dominio/', datos__post, {
            headers: {
                'Authorization': `Bearer ${token}`
                //'Authorization': `Token ${token}`
            }
        });
    } catch (error) {
        throw new Error("No se puede editar el dominio: " + error.message);
    }
}
