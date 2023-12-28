// Objective: API for the course module
import axios from 'axios';

// RUTA BASE DE REDIRECCIONAMIENTO
const baseurl = axios.create({
    baseURL: 'http://localhost:8000/',
})

/* Listado de cursos */
// Listado de cursos mediante un método de la REST API
export const CursoListado = (page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/curso/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a cursos: " + error.message);
    }
};

// LISTA DE CURSOS DE UN USUARIO
// Listado de cursos para el usuario comun mediante un método de la REST API
export const CursosUsuarioComun = (page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/lista/cursos/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los cursos del usuario: " + error.message);
    }
};

// Listado de cursos para el usuario comun mediante un método de la REST API
export const CursoCrear = (curso) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.post('wapiptdah/aplicacion/curso/', curso,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede crear el curso: " + error.message);
    }
};

// Listado de cursos para el usuario comun  mediante un método directo
export const CrearCurso = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/registro_curso/', datos__post, {
            headers: {
                'Authorization': `Bearer ${token}`
                //'Authorization': `Token ${token}`
            }
        });
    } catch (error) {
        throw new Error("No se puede crear el curso: " + error.message);
    }
};

// Obtener los datos individuales del registro de un curso
export const CursoIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/curso/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder al curso: " + error.message);
    }
};

// Edición del registro de curso mediante un método de la REST API
export const CursoEditar = (id, curso) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        const response = baseurl.put(`wapiptdah/aplicacion/curso/${id}/`, curso,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
        /*if (error.response) {
            throw new Error("No se puede editar el curso: " + error.response.data.detail);
        } else if (error.message === "NOT_AUTHENTICATED") {
            throw new Error("No autenticado. Inicie sesión para realizar esta acción.");
        } else {
            throw new Error("Error desconocido al editar el curso: " + error.message);
        }*/
    }
};

// Eliminación del registro de curso mediante un método de la REST API
export const CursoEliminar = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.delete(`wapiptdah/aplicacion/curso/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede eliminar el curso: " + error.message);
    }
};

// Método para verificar la existencia del registro de un curso mediante un slug
export const VerificarCurso = async (slug) => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/verificar/curso/${slug}/`, {
            headers: {
                'Authorization': `Bearer ${tokenLocal}`
                //'Authorization': `Token ${tokenLocal}`
            }
        });
    } catch (error) {
        throw new Error("No se puede verificar el curso: " + error.message);
    }
}

// Método para verificar la inscripción de un estudiante en un curso
export const VerificarInscripcion = () => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get('wapiptdah/verificar/inscripcion/', {
            headers: {
                'Authorization': `Bearer ${tokenLocal}`
                //'Authorization': `Token ${tokenLocal}`
            }
        });
    } catch (error) {
        throw new Error("No se puede verificar la inscripción: " + error.message);
    }
}

// Listado de los estudiantes que se están inscritos en un curso
export const PacientesInscritos = (id, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/lista/pacientes/${id}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los pacientes: " + error.message);
    }
};

// Obtener slug de curso
export const ObtenerSlugCurso = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/obtener/curso/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los pacientes: " + error.message);
    }
};

// Busqueda de curso
export const BusquedaCurso = (nombre, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/busqueda/curso/${encodeURIComponent(nombre)}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a las salas: " + error.message);
    }
};

// Buscar cursos por fecha para usuario comun
export const CursoporFecha = async (fecha, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/curso/fecha/${fecha}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los cursos: " + error.message);
    }
};

// Buscar cursos por fecha para usuario comun
export const CursoporFechaTecnico = async (fecha, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/curso/fecha/tecnico/${fecha}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los cursos: " + error.message);
    }
};

// Buscar estudiante por cedula
export const EstudianteporCedula = async (cedula, slug, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/estudiante/cedula/${cedula}/${slug}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder al registro de estudiante por esa cédula: " + error.message);
    }
};