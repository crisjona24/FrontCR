// IMPORTACION DE LA LISTA DE CONTENIDO
import axios from 'axios';

// RUTA BASE DE REDIRECCIONAMIENTO
const baseurl = axios.create({
    baseURL: 'https://django-server-production-3a07.up.railway.app/',
})

// Listados
// Listado de reportes mediante un método de la REST API
export const ReporteListado = (page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/reporte/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};

// Listado de reportes pertenecientes a un usuario comun
export const ReporteListadoUsuarioComun = (id, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/lista/reporte/usuario/${id}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};

// Creacion 
// Crear reportes mediante un método de la REST API
export const ReporteCrear = (reporte) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.post('wapiptdah/aplicacion/reporte/', reporte,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede crear el reporte: " + error.message);
    }
};

// Crear reportes mediante un método directo en la base de datos
export const CrearReporteNuevo = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/registro/reporte/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            });
    } catch (error) {
        throw new Error("No se puede crear el reporte: " + error.message);
    }
};

// Generación de reportes de forma general es decir de todos los resultados disponibles 
export const GenerarReporteAll = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/generar/reporte/all/', datos__post,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    } catch (error) {
        throw new Error("No se puede crear el reporte: " + error.message);
    }
};

// Acceso a datos individuales

// Acceso a datos individuales de un reporte
export const ReporteIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/reporte/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder al reporte: " + error.message);
    }
};


// Edicion

// Edicion de reportes mediante un método de la REST API
export const ReporteEditar = (id, reporte) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.put(`wapiptdah/aplicacion/reporte/${id}/`, reporte,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede editar el registro de reporte: " + error.message);
    }
};

/* *** METODOS COMUNES *** */

// Método para la verificación de la existencia de registro de un reporte
export const VerificarReporte = async (slug) => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/verificar/reporte/${slug}/`,
            {
                headers: {
                    'Authorization': `Bearer ${tokenLocal}`
                    //'Authorization': `Token ${tokenLocal}`
                }
            });
    } catch (error) {
        throw new Error("No se puede verificar el reporte: " + error.message);
    }
};

// Método para la eliminación de un registro de un reporte
export const ReporteEliminar = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.delete(`wapiptdah/aplicacion/reporte/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede eliminar el reporte : " + error.message);
    }
};

// METODOS VARIOS

// Método para la modificación del estado de un reporte
export const ModificarEstadoResultado = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/modificar/estado/resultado/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    } catch (error) {
        throw new Error("No se puede modificar el estado del resultado." + error.message);
    }
};

// Resultados por paciente
export const ReportesPaciente = async (nombre, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/reportes/${encodeURIComponent(nombre)}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};


// Buscar reportes por fecha para usuario comun
export const ReporteporFecha = async (fecha, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/reporte/fecha/${fecha}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};

// Buscar reportes por fecha para usuario comun
export const ReporteporFechaTecnico = async (fecha, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/reporte/fecha/tecnico/${fecha}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};

// Buscar reportes por fecha para usuario comun
export const ReporteporRango = async (fecha, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/reporte/rango/${fecha}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};

// Buscar reportes por fecha para usuario comun
export const ReporteporRangoTecnico = async (fecha, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/reporte/rango/tecnico/${fecha}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};

// Buscar reportes por cedula de estudiante para usuario comun y tecnico
export const ReporteporCedula = async (cedula, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/reportes/cedula/${cedula}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los reportes: " + error.message);
    }
};
