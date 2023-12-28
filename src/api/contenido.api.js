// IMPORTACION DE LA LISTA DE CONTENIDO
import axios from 'axios';

// RUTA BASE DE REDIRECCIONAMIENTO cambio ala ruta nueva
const baseurl = axios.create({
    baseURL: 'https://django-server-production-3a07.up.railway.app/',
})

// Listado de contenido mediante un método de la REST API
export const ContenidoListado = (page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/contenido/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a contenidos: " + error.message);
    }
};

export const ContenidoListadoSolo = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get('wapiptdah/aplicacion/contenidos/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a contenidos: " + error.message);
    }
};

export const ContenidoListEspecifico = (slug, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/contenidos/${slug}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a contenidos: " + error.message);
    }
};

// Metodo para crear contenido mediante un método de la REST API
export const contenidoCrear = (contenido) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.post('wapiptdah/aplicacion/contenido/', contenido,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede crear el contenido: " + error.message);
    }
};

export const CrearContenidoNew = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/registro_contenido/', datos__post,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            });
    } catch (error) {
        throw new Error("No se puede crear el contenido: " + error.message);
    }
}

// Método para obtener los datos de un registro de contenido mediante un método de la REST API
export const ContenidoIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/contenido/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder al registro de contenido: " + error.message);
    }
}

// Método para editar un registro de contenido mediante un método de la REST API
export const ContenidoEditar = (id, contenido) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        const respons = baseurl.put(`wapiptdah/aplicacion/contenido/${id}/`, contenido,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return respons;
    } catch (error) {
        if (error.response) {
            // Manejar errores de respuesta del servidor
            if (error.response.data.nombre) {
                // Error de validación del nombre
                console.error("Error de nombre:", error.response.data.nombre);
            }
            if (error.response.data.portada_dominio) {
                // Error relacionado con la portada
                console.error("Error de portada:", error.response.data.portada);
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

// Método para verificar la existencia de un registro de contenido mediante un método de la REST API
export const VerificarContenido = async (slug) => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/verificar/contenido/${slug}/`,
            {
                headers: {
                    'Authorization': `Bearer ${tokenLocal}`
                    //'Authorization': `Token ${tokenLocal}`
                }
            });
    } catch (error) {
        throw new Error("No se puede verificar el contenido: " + error.message);
    }
}

// Método para eliminar un registro de contenido mediante un método de la REST API
export const ContenidoEliminar = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.delete(`wapiptdah/aplicacion/contenido/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede eliminar el contenido : " + error.message);
    }
}


// Busqueda de contenido
export const BusquedaContenidos = (nombre, slug, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/busqueda/contenido/${encodeURIComponent(nombre)}/${slug}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los registros de contenido: " + error.message);
    }
};

// Edición de contenido manual
export const EditarContenidoManual = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/editar/contenido/', datos__post, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        throw new Error("No se puede editar el contenido: " + error.message);
    }
}
