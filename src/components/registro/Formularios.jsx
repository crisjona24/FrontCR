// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
// Componentes
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from "@fortawesome/free-solid-svg-icons";
// Metodos
import { info__nivel, info__dominio } from '../../controles/controlador_registro';
import { CrearCurso } from '../../api/curso.api';
import { VerificarCuenta, CambiarClaveCuenta, EnvioNuevaClave, EnviarCodigoRecuperacion } from '../../api/usuario.api';
import { CrearNivelNew, EnviarCorreo } from '../../api/grado.api';
import { CrearPeticion, AtenderPeticion } from '../../api/peticion.api';
import { validarTamanoImagen } from '../../controles/alert_user';
import { CrearDominioNew } from '../../api/dominio.api';
import { CrearContenidoNew } from '../../api/contenido.api'
import { DominiosListadoSolo } from '../../api/dominio.api'
import { CrearSalaNueva } from '../../api/sala.api'

/* SELECCION DE ACTIVIDAD */
export function Actividad() {
    /* *** Form **** */
    const [actividad, setActividad] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            if (actividad === "Tecnico") {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                navigate('/usuario/registro');
            } else if (actividad === "Paciente") {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                navigate('/usuario/paciente/registro');
            } else if (actividad === "Comun") {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                navigate('/usuario/comun/registro');
            }
            else {
                mostrarError('Error al seleccionar actividad');
            }
        } catch (err) {
            mostrarError('Error al seleccionar actividad');
        }
        setHabilitado(false);
    };

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Validar espacios
    const isValidForm = () => {
        if (
            actividad.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <span>{error}</span>}
            <div className="form-group h-100">
                <label className='label' htmlFor="actividad">Selecciona su actividad:</label>
                <select className="form-control w-100 h-100" id="actividad"
                    name="actividad" value={actividad} onChange={e => setActividad(e.target.value)}>
                    <option value="none">----</option>
                    <option value="Tecnico">Técnico</option>
                    <option value="Paciente">Estudiante</option>
                    <option value="Comun">Común</option>
                </select>
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Seleccionando...' : 'Seleccionar'}
            </Button>
        </form>
    )
}


/* FORMULARIO CONTENIDO */
export function FormularioContenido({ slug }) {
    /* *** Form **** */
    const [nombre, setNombre] = useState("");
    const [dominio_tipo, setDominio] = useState("");
    const [portada, setPortada] = useState("");
    const [dominios, setDominios] = useState([]);
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    const enviar = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            const formData = new FormData(); // Crear un objeto FormData
            formData.append('nombre', nombre);
            formData.append('dominio_tipo', dominio_tipo);
            formData.append('portada', portada);
            // Guardar
            await guardar(formData);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar contenido');
            }
        }
        setHabilitado(false);
    };

    // Funcion para guardar datos
    const guardar = async (formData) => {
        try {
            // Realizar la petición POST al servidor
            const response = await CrearContenidoNew(formData);
            if (response.data.success) {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                navigate(`/contenido/all/${slug}/`);
            } else {
                if (response.data.error) {
                    Swal.fire(response.data.error, '', 'error')
                } else {
                    mostrarError('Error al registrar contenido');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar contenido');
            }
        }
    }

    // Obtener dominios
    useEffect(() => {
        async function cargarDominios() {
            try {
                const data = await DominiosListadoSolo();
                setDominios(data.data);
            } catch (error) {
                setError('Error al obtener datos de dominio', error);
                setTimeout(() => {
                    setError(""); // Esto limpiará el mensaje de error después de 5 segundos
                }, 5000);
            }
        };
        cargarDominios();
    }, []);

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre.trim() === "" ||
            dominio_tipo.trim() === "" ||
            !portada
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviar} encType='multipart/form-data'>
            <>
                {error && <p>{error}</p>}
            </>
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de contenido:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="dominio">Tipo de contenido:</label>
                <select className="form-control w-100" id="dominio"
                    name="dominio" value={dominio_tipo} onChange={e => setDominio(e.target.value)}>
                    <option value="none">None</option>
                    <>
                        {dominios.map((dominio) => (
                            <option key={dominio.id} value={dominio.nombre}>
                                {dominio.nombre}
                            </option>
                        ))}
                    </>
                </select>
            </div>
            <div className="form-group">
                <label className='label' htmlFor="portada_contenido">Portada:</label>
                <input className='form-control w-100' type="file" id="portada_contenido"
                    onChange={e => { setPortada(e.target.files[0]); validarTamanoImagen(e.target) }}
                    name='portada_contenido' accept="image/*" />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )
}


/* FORMULARIO DE CURSO */
export function FormularioCurso() {
    /* *** Form **** */
    const [nombre_curso, setNombreCurso] = useState("");
    const [descripcion, setDescripcionCurso] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Operacion de guardado
    const enviarFC = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre_curso, descripcion)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                nombre_curso,
                descripcion
            };
            // Realizar la petición POST al servidor
            await guardar(datos__post);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar curso');
            }
        }
        setHabilitado(false);
    };

    // Funcion para guardar
    const guardar = async (datos__post) => {
        try {
            const response = await CrearCurso(datos__post);
            if (response.data.success) {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                Swal.fire("Curso registrado correctamente", "", "success");
                navigate('/cursos/all');
            } else {
                if (response.data.error) {
                    Swal.fire(response.data.error, '', 'error')
                } else {
                    mostrarError('Error al registrar curso');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar curso');
            }
        }
    }

    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviarFC}>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de curso:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre_curso} onChange={e => setNombreCurso(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Descripción de curso:</label>
                <textarea className='form-control w-100 tamanio-text-area' type="text" id="descripcion"
                    value={descripcion} onChange={e => setDescripcionCurso(e.target.value)}
                    name='descripcion'
                    placeholder="Ingrese una descripción corta**"
                />

            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    );

}


/* FORMULARIO DE NIVEL */
export function FormularioNivel() {
    /* *** Form **** */
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [numero_categorias, setNumeroCategorias] = useState(0);
    const [grado_dificultad, setGradoDificultad] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    const enviarN = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                nombre,
                descripcion,
                numero_categorias,
                grado_dificultad
            };
            console.log(datos__post);
            // Realizar la petición POST al servidor
            await guardar(datos__post);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar nivel');
            }
        }
        setHabilitado(false);
    };

    // Funcion para guardar
    const guardar = async (datos__post) => {
        try {
            const response = await CrearNivelNew(datos__post);
            if (response.data.success) {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                Swal.fire("Nivel registrado correctamente", "", "success");
                navigate('/nivel/all');
            } else {
                if (response.data.error) {
                    Swal.fire(response.data.error, '', 'error')
                } else {
                    mostrarError('Error al registrar nivel');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar nivel');
            }
        }
    }

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre.trim() === "" ||
            descripcion.trim() === "" ||
            !numero_categorias ||
            grado_dificultad.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviarN}>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de nivel:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Descripción de nivel:</label>
                <textarea onClick={info__nivel} className='form-control w-100 tamanio-text-area' type="text"
                    placeholder="Ingrese una descripción corta**"
                    id="descripcion" name="descripcion"
                    value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="categoria">Número de categorías:</label>
                <input className='form-control w-100' type="number" id="categoria" name='categoria'
                    min='1' max='10' placeholder="Ingrese el número de categorías**"
                    value={numero_categorias} onChange={e => setNumeroCategorias(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="grado">Grado de dificultad:</label>
                <select className="form-control w-100" id="grado"
                    name="grado" value={grado_dificultad} onChange={e => setGradoDificultad(e.target.value)}>
                    <option value="none">None</option>
                    <option value="Leve"> Nivel leve</option>
                    <option value="Medio">Nivel medio</option>
                    <option value="Moderado">Nivel moderado</option>
                </select>
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    );
}


/* FORMULARIO DE DOMINIO */
export function FormularioDominio() {
    /* *** Form **** */
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [portada_dominio, setPortada] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Operacion de guardado
    const enviarD = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            const formData = new FormData(); // Crear un objeto FormData
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('portada_dominio', portada_dominio);
            // Realizar la petición POST al servidor
            await guardar(formData);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar dominio');
            }
        }
        setHabilitado(false);
    };

    // Funcion para guardar
    const guardar = async (formData) => {
        try {
            const response = await CrearDominioNew(formData);
            if (response.data.success) {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                navigate('/dominio/all');
            } else {
                if (response.data.error) {
                    Swal.fire(response.data.error, '', 'error')
                } else {
                    mostrarError('Error al registrar dominio');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar dominio');
            }
        }
    }

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre.trim() === "" ||
            descripcion.trim() === "" ||
            !portada_dominio
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviarD} encType='multipart/form-data'>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de dominio:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Descripción:</label>
                <textarea onClick={info__dominio} className='form-control w-100 tamanio-text-area' type="text"
                    placeholder="Ingrese una descripción corta**"
                    id="descripcion" name="descripcion"
                    value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="portada_dominio">Portada:</label>
                <input className='form-control w-100' type="file" id="portada_dominio"
                    onChange={e => { setPortada(e.target.files[0]); validarTamanoImagen(e.target) }} name='portada_dominio' accept="image/*" />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )
}


/* FORMULARIO PETICION */
export function FormularioPeticion() {
    /* *** Form **** */
    const [motivo, setMotivo] = useState("");
    const [tipo, setTipo] = useState("");
    const [peticion_cuerpo, setPeticionCuerpo] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Operacion de guardado
    const enviarPeticion = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                motivo,
                tipo,
                peticion_cuerpo
            };
            // Realizar la petición POST al servidor
            await guardar(datos__post);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar petición');
            }
        }
        setHabilitado(false);
    };

    // Funcion para guardar 
    const guardar = async (datos__post) => {
        try {
            const response = await CrearPeticion(datos__post);
            if (response.data.success) {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                Swal.fire("Peticion registrada correctamente", "", "success");
                navigate('/nivel/all');
            } else {
                if (response.data.error) {
                    Swal.fire(response.data.error, '', 'error')
                } else {
                    mostrarError('Error al registrar petición');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar petición');
            }
        }
    }

    // Campos vacios
    const isValidForm = () => {
        if (
            motivo.trim() === "" ||
            tipo.trim() === "" ||
            peticion_cuerpo.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviarPeticion} encType='multipart/form-data'>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="motivo">Motivo de petición:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el motivo**" id="motivo"
                    name="motivo" value={motivo} onChange={e => setMotivo(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="tipo">Selecciona el tipo:</label>
                <select className="form-control w-100" id="tipo"
                    name="tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
                    <option value="none">----</option>
                    <option value="Editar">Edición</option>
                    <option value="Eliminar">Eliminación</option>
                    <option value="Agregar">Agregación</option>
                </select>
            </div>
            {/*}
            <div className="form-group">
                <label className='label' htmlFor="peticion_cuerpo">Archivo de petición:</label>
                <input className='form-control w-100' type="file" id="peticion_cuerpo"
                    onChange={e => { setPeticionCuerpo(e.target.files[0]) }} name='peticion_cuerpo'
                    accept="application/pdf" />
            </div>
            */}
            <div className="form-group">
                <label className='label' htmlFor="peticion_cuerpo">Descripción de petición:</label>
                <textarea className='form-control w-100 tamanio-text-area' type="text" id="peticion_cuerpo"
                    value={peticion_cuerpo} onChange={e => setPeticionCuerpo(e.target.value)}
                    name='peticion_cuerpo'
                    placeholder="Mira detalles en el boton Detalle**"
                />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )
}


/* FORMULARIO SALA */
export function FormularioSala() {
    /* *** Form **** */
    const [nombre_sala, setNombre] = useState("");
    const [nombre_sala_n, setNombreN] = useState("");
    const [anotaciones, setAnotaciones] = useState("");
    const [codigo_identificador, setCodigo] = useState("");
    const [nombre_paciente, setNombrePaciente] = useState("");
    const [error, setError] = useState("");
    const [entradaValida, setEntradavaldia] = useState(true);
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Operacion de guardado
    const enviarFSala = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Entrada
        if (!entradaValida) {
            Swal.fire("Por favor ingrese el formato: Nombres Apellidos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                nombre_sala,
                nombre_sala_n,
                anotaciones,
                codigo_identificador,
                nombre_paciente
            };
            // Funcion de registro
            await confirmGuardado(datos__post);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar sala');
            }
        }
        setHabilitado(false);
    };

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre_sala.trim() === "" ||
            anotaciones.trim() === "" ||
            codigo_identificador.trim() === "" ||
            nombre_paciente.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Registro de sala
    const confirmGuardado = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea guardar los datos de sala?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Realizar la petición POST al servidor
                    const response = await CrearSalaNueva(datos__post);
                    if (response.data.success) {
                        // Redireccionar a la página principal si el inicio de sesión es exitoso
                        Swal.fire("Sala registrada correctamente", "", "success");
                        navigate('/sala/all');
                    } else {
                        if (response.data.error) {
                            Swal.fire(response.data.error, '', 'error');
                        } else {
                            Swal.fire('Error al registrar', '', 'error');
                        }
                    }
                } catch (error) {
                    Swal.fire('Error al registrar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los datos no se guardaron', '', 'info');
                navigate('/nivel/all')
            }
        });
    };

    // Funcion para validar la entreada
    const cambioEntrada = (e) => {
        const value = e.target.value;
        setNombrePaciente(value);

        if (!validarEntrada(value)) {
            setEntradavaldia(false);
        } else {
            setEntradavaldia(true);
        }
    };

    // Validacion de entrada
    const validarEntrada = (value) => {
        // Control de entrada para cuatro valores
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };

    // Normalizar texto
    function normalizeText(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const cambioNombre = (event) => {
        const valor = event.target.value;
        setNombre(valor);
        setNombreN(normalizeText(valor));
    };

    return (
        <form onSubmit={enviarFSala}>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de sala:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre de sala**" id="nombre"
                    name="nombre" value={nombre_sala} onChange={cambioNombre} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="anotacion">Descripción de actividad:</label>
                <textarea className='form-control w-100 tamanio-text-area' type="text" id="anotacion"
                    value={anotaciones} onChange={e => setAnotaciones(e.target.value)}
                    name='anotacion' />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="identificador">Identificador del contenido:</label>
                <textarea className='form-control w-100 h-100' type="text" id="identificador"
                    value={codigo_identificador} onChange={e => setCodigo(e.target.value)}
                    name='identificador'
                    placeholder="Ingrese el código/s de contenido. Ejm: 12145, 45578" />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="paciente">Nombre de estudiante:</label>
                <input className='form-control w-100' type="text"
                    placeholder="Ingrese el nombre ejm: Luis Luis Chavez Chavez**" id="paciente"
                    name="paciente" value={nombre_paciente} onChange={cambioEntrada} />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )

}


/* FORMULARIO SALA */
export function FormularioPeticionRevision() {
    /* *** Form **** */
    const [vereficto, setVeredicto] = useState("");
    const [estadoR, setEstadoR] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();
    // Capturamos el id de la url
    let { slug } = useParams();

    // Operacion de guardado
    const enviarFRevision = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                vereficto,
                estadoR,
                slug
            };
            // Funcion de registro
            await confirmGuardado(datos__post);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar revisión de sala');
            }
        }
        setHabilitado(false);
    };

    // Campos vacios
    const isValidForm = () => {
        if (
            vereficto.trim() === "",
            estadoR.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Registro de sala
    const confirmGuardado = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea guardar la revisión de sala?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Realizar la petición POST al servidor
                    const response = await AtenderPeticion(datos__post);
                    if (response.data.success) {
                        // Redireccionar a la página principal si el inicio de sesión es exitoso
                        Swal.fire("Revisión registrada correctamente", "", "success");
                        navigate('/peticion/all');
                    } else {
                        if (response.data.error) {
                            Swal.fire(response.data.error, '', 'error');
                        } else if (response.data.errorSalida) {
                            navigate('/login');
                        } else {
                            Swal.fire('Error al registrar', '', 'error');
                        }
                    }
                } catch (error) {
                    Swal.fire('Error al registrar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('La revisión no se ha enviado', '', 'info');
                navigate('/peticion/all')
            }
        });
    };

    return (
        <form onSubmit={enviarFRevision}>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="veredicto">Ingrese la decisión de la revisión :</label>
                <textarea className='form-control w-100 tamanio-text-area' placeholder="Ingrese la decisión**" id="veredicto"
                    name="veredicto" value={vereficto} onChange={e => setVeredicto(e.target.value)}
                    cols="30" rows="20" autoFocus>

                </textarea>
            </div>
            <div className="form-group">
                <label className='label' htmlFor="estado">Estado de revisión:</label>
                <select className="form-control w-100" id="estado"
                    name="estado" value={estadoR} onChange={e => setEstadoR(e.target.value)}>
                    <option value="none">None</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                </select>
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Enviando...' : 'Enviar'}
            </Button>
        </form>
    )

}


// Formulario de confirmacion de cuenta
export function FormularioConfirmacion() {
    /* *** Form **** */
    const [tokenVerificacion, setToken] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Operacion de guardado
    const enviarFConfirmacion = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!valoresValidos()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                tokenVerificacion
            };
            // Funcion de registro
            await confirmGuardado(datos__post);
        } catch (err) {
            mostrarError('Error al verificar cuenta');
        }
        setHabilitado(false);
    };

    // Campos vacios
    const valoresValidos = () => {
        if (
            tokenVerificacion.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Registro de sala
    const confirmGuardado = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea verificar el registro de cuenta?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            denyButtonText: 'No verificar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Realizar la petición POST al servidor
                    const response = await VerificarCuenta(datos__post);
                    if (response.data.success) {
                        // Redireccionar a la página principal si el inicio de sesión es exitoso
                        Swal.fire("Verificación registrada correctamente", "", "success");
                        navigate('/login');
                    } else {
                        if (response.data.error) {
                            Swal.fire(response.data.error, '', 'error');
                            navigate('/login')
                        } else {
                            Swal.fire('Error al verificar', '', 'error');
                            navigate('/login')
                        }
                    }
                } catch (err) {
                    Swal.fire('Error al verificar', '', 'error');
                    navigate('/login')
                }
            } else if (result.isDenied) {
                Swal.fire('La verificación no se ha enviado', '', 'info');
                navigate('/login')
            }
        });
    };

    return (
        <form onSubmit={enviarFConfirmacion}>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="codigo">Ingrese el código proporcionado :</label>
                <textarea class="form-control w-100 tamanio-text-area" placeholder="Ingrese el código**"
                    id="codigo" required autoFocus
                    name="codigo"
                    value={tokenVerificacion}
                    onChange={e => setToken(e.target.value)}>
                </textarea>
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Verificando...' : 'Verificar'}
            </Button>
        </form>
    )

}


// Contacto
export function FormularioContacto() {
    /* *** Form **** */
    const [motivo, setMotivo] = useState("");
    const [cuerpo, setCuerpo] = useState("");
    const [correo, setCorreo] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    const enviarContacto = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                motivo,
                cuerpo,
                correo
            };
            // Realizar la petición POST al servidor
            await guardar(datos__post);
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al enviar correo de contacto');
            }
        }
        setHabilitado(false);
    };

    // Funcion para guardar
    const guardar = async (datos__post) => {
        try {
            const response = await EnviarCorreo(datos__post);
            if (response.data.success) {
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                Swal.fire("Correo enviado correctamente", "", "success");
                navigate('/nivel/all');
            } else {
                if (response.data.error) {
                    Swal.fire(response.data.error, '', 'error')
                } else {
                    mostrarError('Error al enviar el correo');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al enviar el correo');
            }
        }
    }

    // Campos vacios
    const isValidForm = () => {
        if (
            motivo.trim() === "" ||
            cuerpo.trim() === "" ||
            correo.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviarContacto}>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="correo">Correo personal:</label>
                <input className='form-control w-100' type="email" placeholder="Ingrese su correo**" id="correo"
                    value={correo} onChange={e => setCorreo(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="motivo">Motivo de contacto:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el motivo del contacto**" id="motivo"
                    value={motivo} onChange={e => setMotivo(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="cuerpo">Mensaje:</label>
                <textarea className='form-control w-100 tamanio-text-area' type="text" placeholder="Ingrese el mensaje**" id="cuerpo"
                    value={cuerpo} onChange={e => setCuerpo(e.target.value)} />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Enviando...' : 'Enviar'}
            </Button>
        </form>
    );
}


// Formulario de recuperacoón de cuenta
export function FormularioRecuperacion() {
    /* *** Form **** */
    const [correo, setCorreo] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const [recuperar, setRecuperar] = useState(false);
    // Recuperar clave
    const [codigo, setCodigo] = useState("");
    const navigate = useNavigate();

    // Operacion de guardado
    const enviarFRecuperacion = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!valoresValidos()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                correo
            };
            // Funcion de registro
            await confirmGuardado(datos__post);
        } catch (err) {
            mostrarError('Error al enviar correo de recuperación');
        }
        setHabilitado(false);
    };

    // Operacion de cambio de clave
    const enviarCodigo = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!valoresValidos2()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                codigo
            };
            // Funcion de registro
            await confirmGuardadoRecuperacion(datos__post);
        } catch (err) {
            mostrarError('Error al enviar código de recuperación');
        }
        setHabilitado(false);
    };

    // Campos vacios
    const valoresValidos = () => {
        if (
            correo.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Campos vacios
    const valoresValidos2 = () => {
        if (
            codigo.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 9000);
    };

    // Envio de correo de confirmacion
    const confirmGuardado = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea enviar el correo de recuperación?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            denyButtonText: 'No enviar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Realizar la petición POST al servidor
                    const responseRecup = await CambiarClaveCuenta(datos__post);
                    if (responseRecup.data.success) {
                        // Redirigir a la pagina de recuperacion
                        Swal.fire("Correo de recuperación enviado correctamente", "", "success");
                        setRecuperar(true);
                    } else {
                        if (responseRecup.data.error) {
                            Swal.fire(responseRecup.data.error, '', 'error');
                        } else {
                            Swal.fire('Error al enviar correo de recuperación', '', 'error');
                        }
                    }
                } catch (err) {
                    Swal.fire('Error al enviar correo de recuperación', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('La verificación no se ha enviado', '', 'info');
            }
        });
    };

    // Registro de nueva clave
    const confirmGuardadoRecuperacion = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea enviar el código de recuperación?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            denyButtonText: 'No enviar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Realizar la petición POST al servidor
                    const responseR = await EnviarCodigoRecuperacion(datos__post);
                    if (responseR.data.success) {
                        // Redirigir al login
                        Swal.fire("Código correcto", "", "success");
                        navigate('/cambio/clave/cuenta');
                    } else {
                        if (responseR.data.error) {
                            Swal.fire(responseR.data.error, '', 'error');
                        } else {
                            Swal.fire('Error al enviar el código de recuperación o es inválido', '', 'error');
                        }
                    }
                } catch (err) {
                    Swal.fire('Error al enviar el código de recuperación o es inválido', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Error al enviar el código de recuperación o es inválido', '', 'info');
            }
        });
    };

    return (
        <form onSubmit={
            recuperar === true ? enviarCodigo : enviarFRecuperacion
        }>
            {error && <span>{error}</span>}
            {
                recuperar === false ? (
                    <>
                        <div className="form-group">
                            <label className='label' htmlFor="correo">Ingrese su dirección de correo electrónico :</label>
                            <textarea class="form-control w-100 tamanio-text-area"
                                placeholder="Ingrese su correo electrónico**"
                                id="correo" required autoFocus
                                name="correo"
                                value={correo}
                                onChange={e => setCorreo(e.target.value)}>
                            </textarea>
                        </div>
                        <Button type="submit" variant="success" disabled={habilitado}>
                            {habilitado ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label className='label' htmlFor="codigo">Ingrese el código proporcionado :</label>
                            <textarea class="form-control w-100 tamanio-text-area" placeholder="Ingrese el código**"
                                id="codigo" required
                                name="codigo"
                                value={codigo}
                                onChange={e => setCodigo(e.target.value)}>
                            </textarea>
                        </div>

                        <Button type="submit" variant="success" disabled={habilitado}>
                            {habilitado ? 'Verificando...' : 'Verificar'}
                        </Button>
                    </>
                )
            }

        </form>
    )

}


// Formulario de cambio de clave
export function FormularioCambio() {
    /* *** Form **** */
    const [correo, setCorreo] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    // Recuperar clave
    const [clave2, setClave2] = useState("");
    const [clave3, setClave3] = useState("");
    // Mostrar clave
    const [mostrarC2, setVerClave2] = useState(false);
    const [mostrarC3, setVerClave3] = useState(false);
    const navigate = useNavigate();

    // Operacion de cambio de clave
    const enviarNuevaClave = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!valoresValidos2()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Verificar que las claves sean similares
        if (!compararclavesIngresada(clave2, clave3)) {
            Swal.fire("Las claves de recuperación no coinciden", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                clave2,
                correo
            };
            // Funcion de registro
            await confirmGuardadoRecuperacion(datos__post);
        } catch (err) {
            mostrarError('Error al enviar correo de recuperación');
        }
        setHabilitado(false);
    };


    // Campos vacios
    const valoresValidos2 = () => {
        if (
            clave2.trim() === "" ||
            clave3.trim() === "" ||
            correo.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 9000);
    };


    // Registro de nueva clave
    const confirmGuardadoRecuperacion = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea enviar la nueva clave?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            denyButtonText: 'No enviar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Realizar la petición POST al servidor
                    const responseCambio = await EnvioNuevaClave(datos__post);
                    if (responseCambio.data.success) {
                        // Redirigir al login
                        Swal.fire("Cambio de clave correcto", "", "success");
                        navigate('/login');
                    } else {
                        if (responseCambio.data.error) {
                            Swal.fire(responseCambio.data.error, '', 'error');
                        } else if (responseCambio.data.clave) {
                            Swal.fire(responseCambio.data.clave, '', 'error');
                            mostrarError('La clave debe tener mínimo 8 caracteres que incluye una letra mayúscula, un número y un símbolo');
                        } else {
                            Swal.fire('Error al cambiar la clave', '', 'error');
                        }
                    }
                } catch (err) {
                    Swal.fire('Error al cambiar la clave', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Error al cambiar la clave', '', 'info');
            }
        });
    };

    // Comprobar que clave 2 y 3 sean similares
    const compararclavesIngresada = (ob1, ob2) => {
        if (ob1 === ob2) {
            return true;
        } else {
            return false;
        }
    };

    // Visibilidad de la clave
    const observarC2 = () => {
        setVerClave2(!mostrarC2);
    }
    const observarC3 = () => {
        setVerClave3(!mostrarC3);
    }

    return (
        <form onSubmit={enviarNuevaClave}>
            {error && <span>{error}</span>}
            <div className="form-group mt-1">
                <label className='label' htmlFor="correo">Ingrese su dirección de correo electrónico :</label>
                <input className='form-control w-100' type="email"
                    placeholder="Ingrese su correo electrónico**"
                    id="correo" required autoFocus
                    name="correo"
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                />
            </div>
            <div className='form-row row'>
                <div className="form-group col-md-10">
                    <label className='label' htmlFor="clave2">Ingrese su nueva clave :</label>
                    <input className='form-control w-100' type={mostrarC2 ? "text" : "password"}
                        placeholder="Ingrese su nueva clave**"
                        id="clave2" required
                        name="clave2"
                        value={clave2}
                        onChange={e => setClave2(e.target.value)}
                    />
                </div>
                <div className="form-group col-md-2 mt-4 d-flex justify-content-center">
                    <Button variant="success" onClick={observarC2} className={mostrarC2 ? "opaco" : "no-opaco"}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                </div>
            </div>
            <div className='form-row row'>
                <div className="form-group col-md-10">
                    <label className='label' htmlFor="clave3">Confirme su nueva clave :</label>
                    <input className='form-control w-100' type={mostrarC3 ? "text" : "password"}
                        placeholder="Confirme su nueva clave**"
                        id="clave3" required
                        name="clave3"
                        value={clave3}
                        onChange={e => setClave3(e.target.value)}
                    />
                </div>
                <div className="form-group col-md-2 mt-4 d-flex justify-content-center">
                    <Button variant="success" onClick={observarC3} className={mostrarC3 ? "opaco" : "no-opaco"}>
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                </div>
            </div>

            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Enviando...' : 'Enviar'}
            </Button>
        </form>
    )

}
