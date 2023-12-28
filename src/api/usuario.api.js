import axios from 'axios';

const baseurl = axios.create({
    baseURL: 'https://django-server-production-3a07.up.railway.app/',
})

/* ****  TECNICO **** */
export const UsuarioListado = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get('wapiptdah/aplicacion/usuario/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

// Creacion de usuario mediante método de API REST
export const UsuarioCrear = (usuario) => baseurl.post('wapiptdah/aplicacion/usuario/', usuario)

// Creacion de usuario con rol tecnico en la base de datos
export const UsuarioCrearNuevo = async (datos__post) => {
    return await baseurl.post('wapiptdah/registro_usuario/', datos__post);
};

// Editar usuario mediante método de API REST
export const UsuarioEditar = (id, usuario) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.put(`wapiptdah/aplicacion/usuario/${id}/`, usuario,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

// Obtención de datos de usuario mediante método de API REST
export const UsuarioIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/usuario/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};


/* ****  PACIENTE **** */

// Obtención de todos los registros de usuario con rol paciente mediante método de API REST
export const PacienteListado = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get('wapiptdah/aplicacion/paciente/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

// Creacion de usuario mediante método de API REST
export const PacienteCrear = (paciente) => baseurl.post('wapiptdah/aplicacion/paciente/', paciente)

// Crear paciente en la base de datos
export const CrearPaciente = async (datos__post) => {
    return await baseurl.post('wapiptdah/registro_paciente/', datos__post);
};

// Editar paciente mediante método de API REST
export const PacienteEditar = (id, usuario) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.put(`wapiptdah/aplicacion/paciente/${id}/`, usuario,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

// Obtención de datos de usuario mediante método de API REST
export const PacienteIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/paciente/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

// Busqueda de pacientes inscritos en un curso por nombre y apeliido para conocer
// quienes se encuentran registrados en un mismo curso
export const BusquedaPacientesCurso = (nombre, slug, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/busqueda/paciente/curso/${encodeURIComponent(nombre)}/${slug}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los pacientes: " + error.message);
    }
};

/* ****  COMUN **** */

// Obtención de todos los registros de usuario con rol comun mediante método de API REST
export const ComunListado = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get('wapiptdah/aplicacion/comun/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

// Creacion de usuario mediante método de API REST
export const ComunCrear = (paciente) => baseurl.post('wapiptdah/aplicacion/comun/', paciente)

// Crear usuario comun en la base de datos
export const CrearComunNew = async (datos__post) => {
    return await baseurl.post('wapiptdah/registro_comun/', datos__post);
};

// Editar usuario comun mediante método de API REST
export const ComunEditar = (id, usuario) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.put(`wapiptdah/aplicacion/comun/${id}/`, usuario,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

// Datos individuales de usuario comun mediante método de API REST
export const ComunIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/comun/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

/* *** METODOS COMUNES *** */

// Método para la verificación de inicio de sesión de un usuario específico
// a traves de su respuesta request al servidor Backend
export const VerificarUsuario = async () => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/verificar/usuario/', {
            headers: {
                'Authorization': `Bearer ${tokenLocal}`
            }
        });
    } catch (error) {
        throw new Error("No se puede verificar al usuario: " + error.message);
    }
};

// Datos de usuario logueado
export const DatosUser = async () => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/datos/usuario/', {
            headers: {
                'Authorization': `Bearer ${tokenLocal}`
                //'Authorization': `Token ${tokenLocal}`
            }
        });
    } catch (error) {
        throw new Error("No se puede acceder al usuario: " + error.message);
    }
};

// Eliminar usuario comun mediante método de API REST
export const UsuarioEliminar = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.delete(`wapiptdah/aplicacion/user/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};

/* INSCRIPCIONES A CURSO*/

// Método para el registro o inscripción de un estudiante en un curso específico
export const InscripcionCurso = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/registro/curso/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede inscribir en un curso: " + error.message);
    }
};

// Método para obtener la fecha de inscripción de un estudiante en un curso específico
export const FechaInscripcionCurso = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/obtener/fecha/inscripcion/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede obtener la fecha de inscripción: " + error.message);
    }
};

// Verificacion de cuenta
export const VerificarCuenta = async (datos__post) => {
    return await baseurl.post('wapiptdah/verificar/cuenta/', datos__post);
};

// Cambiar clave de cuenta
export const CambiarClaveCuenta = async (datos__post) => {
    return await baseurl.post('wapiptdah/cambiar/clave/', datos__post);
};

// Cambiar clave de cuenta
export const EnviarCodigoRecuperacion = async (datos__post) => {
    return await baseurl.post('wapiptdah/verificar/codigo/cuenta/', datos__post);
};

// Envio de nuevas claves
export const EnvioNuevaClave = async (datos__post) => {
    return await baseurl.post('wapiptdah/registro/nueva/clave/', datos__post);
};


// Llamar ejecucion de juegos
export const EjecutarJuego_1 = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/juegos/juego/invasion/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los usuarios: " + error.message);
    }
};
