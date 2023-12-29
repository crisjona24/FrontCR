// METODOS PARA SALAS
import axios from 'axios';

const baseurl = axios.create({
    baseURL: 'https://serverapi-production-c8a1.up.railway.app/',
})


// LISTADO DE SALAS
// Obtener la lista de salas registradas mediante un método REST API
export const SalaListado = (page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/sala/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a las salas: " + error.message);
    }
};

// Creación de un registro de sala mediante un método de la REST API
export const SalaCrear = (sala) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.post('wapiptdah/aplicacion/sala/', sala,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede crear la sala: " + error.message);
    }
};

// Creación de un registro de sala en la base de datos
export const CrearSalaNueva = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/registro_sala/', datos__post,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            });
    } catch (error) {
        throw new Error("No se puede crear la sala : " + error.message);
    }
};


// DETALLE DE SALA
// Obtener el detalle de una sala mediante un método REST API
export const SalaIndividual = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/aplicacion/sala/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los datos de la sala: " + error.message);
    }
};


// ACTUALIZAR SALA
// Actualizar un registro de sala mediante un método de la REST API
export const SalaActualizar = (id, sala) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.put(`wapiptdah/aplicacion/sala/${id}/`, sala,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede editar la sala: " + error.message);
    }
};

// Actualizar un registro de sala en la base de datos
export const EditarSala = async (datos__post) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.post('wapiptdah/estudio/edicion_sala/', datos__post,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            });
    } catch (error) {
        throw new Error("No se puede crear la sala : " + error.message);
    }
};

/* *** METODOS COMUNES *** */
// Verificar si existe una sala
export const VerificarSala = async (slug) => {
    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/verificar/sala/${slug}/`,
            {
                headers: {
                    'Authorization': `Bearer ${tokenLocal}`
                    //'Authorization': `Token ${tokenLocal}`
                }
            });
    } catch (error) {
        throw new Error("No se puede verificar la sala : " + error.message);
    }
};


// ELIMINAR SALA
// Método para eliminar un registro de sala mediante un método de la REST API
export const SalaEliminar = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.delete(`wapiptdah/aplicacion/sala/${id}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede eliminar la sala : " + error.message);
    }
};

// LISTA DE SALAS DE UN USUARIO COMUN
// Obtener la lista de salas de un usuario comun mediante un método REST API
export const SalasUsuarioComun = (id, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/lista/salas/${id}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a las salas: " + error.message);
    }
};

// LISTA DE SALAS DE UN USUARIO COMUN ATENDIDAS
// Obtener la lista de salas atendidas de un usuario comun mediante un método REST API
export const SalasUsuarioComunAtendidas = (id, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/lista/salas/atendidas/${id}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a las salas: " + error.message);
    }
};

// LISTA DE SALAS DE UN PACIENTE
// Obtener la lista de salas de un estudiante mediante un método REST API
export const SalasPaciente = (id, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/lista/salas/paciente/${id}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a las salas: " + error.message);
    }
};

// Busqueda de salas
// Método de busqueda de un registro de sala mediante el nombre de estudiante
export const BusquedaSalas = (nombre, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/estudio/busqueda/salas/${encodeURIComponent(nombre)}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a las salas: " + error.message);
    }
};

// Contador de nuevas peticiones
export const ContadorSalas = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/contador/sala/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede controlar el contador de salas: " + error.message);
    }
};

// Reinicio de contador de nuevas peticiones
export const ReinicioContadorSalas = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/contador/sala/reinicio/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede reiniciar el contador: " + error.message);
    }
};

// Atender sala
// Método para registrar la atención de una sala
export const AtenderSala = (slug) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return baseurl.get(`wapiptdah/atender/sala/${slug}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede atender a la sala: " + error.message);
    }
};


// Acceder a sala
export const AccederSala = async (codigo) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/codigo/contenido/${codigo}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a la sala: " + error.message);
    }
};

// Contador de salas atenddas
export const ContadorSalasAtendida = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/contador/sala/atendida/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede obtener el contador de salas atendidas: " + error.message);
    }
};

// Reinicio de contador de nuevas peticiones
export const ReinicioContadorSalasAtendidas = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get('wapiptdah/contador/sala/atendida/reinicio/',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede reinicar el contador de salas atendidas: " + error.message);
    }
};

// Buscar salas por fecha para usuario comun
export const SalaporFecha = async (fecha, id, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/sala/fecha/${fecha}/${id}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                    //'Authorization': `Token ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los registros de sala: " + error.message);
    }
};

// Buscar salas por fecha para usuario tecnico
export const SalaFecha = async (fecha, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/sala/fecha/tecnico/${fecha}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los registros de sala: " + error.message);
    }
};

// Buscar salas atendidas por fecha para usuario comun
export const SalaporFechaAtendida = async (fecha, id, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("NOT_AUTHENTICATED");
    }
    try {
        return await baseurl.get(`wapiptdah/estudio/lista/sala/fecha/atendida/${fecha}/${id}/?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    } catch (error) {
        throw new Error("No se puede acceder a los registros de sala: " + error.message);
    }
};
