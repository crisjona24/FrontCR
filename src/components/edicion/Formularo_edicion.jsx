// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
// Componentes
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
// Metodos
import { VerificarNivel, NivelIndividual, NivelEditar, NivelListado } from '../../api/grado.api';
import { VerificarDominio, DominioIndividual, DominioEditar } from '../../api/dominio.api';
import { VerificarContenido, ContenidoIndividual, ContenidoEditar } from '../../api/contenido.api';
import { VerificarCurso, CursoIndividual, CursoEditar } from '../../api/curso.api';
import {
    VerificarContenidoIndividual, ContenidoDatosIndividual, ContenidoIndividualEditar,
    EditarActividadManual
} from '../../api/contenidoindividual.api';
import { info__nivel, info__dominio, info__contenido, info__contenido__respuesta } from '../../controles/controlador_registro';
import { validarTamanoImagen } from '../../controles/alert_user';
import { ResultadoIndividual, ResultadoEditar } from '../../api/resultado.api';
import { SalaIndividual, EditarSala } from "../../api/sala.api";
import { ReporteIndividual, ReporteEditar } from "../../api/reporte.api";
import { EditarDominioManual } from "../../api/dominio.api";
import { EditarContenidoManual } from "../../api/contenido.api";

/* EDICION DE NIVEL*/
export function FormularioEdicionNivel() {
    /* *** Form **** */
    // Obtener el parametro de la URL
    let { slug } = useParams();
    const token = localStorage.getItem('token');
    const [datos, setDatos] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [nombre_nivel, setNombre] = useState("");
    const [descripcion_grado, setDescripcion] = useState("");
    const [numero_categorias, setNumeroCategorias] = useState(0);
    const [grado_dificultad, setGradoDificultad] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Datos
    const obtenerDatosNivel = async () => {
        try {
            const cont = await VerificarNivel(slug);
            if (cont.data.success && cont.data.identificador) {
                const datos__user = await NivelIndividual(cont.data.identificador);
                setDatos(datos__user.data)
                setNombre(datos__user.data.nombre_nivel);
                setDescripcion(datos__user.data.descripcion_grado);
                setNumeroCategorias(datos__user.data.numero_categorias);
                setGradoDificultad(datos__user.data.grado_dificultad);
            } else {
                if (cont.data.error) {
                    Swal.fire(cont.data.error, "", "warning");
                    navigate('/nivel/all')
                } else if (cont.data.errorSalida) {
                    console.log(cont.data.errorSalida)
                    navigate('/login')
                }
            }

        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de nivel');
            }
        }
    }

    const obtenerNiveles = async () => {
        try {
            const niveles = await NivelListado();
            setNiveles(niveles.data);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Editar nivel
    const enviarFNivel = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                // Obtenemos los datos
                const datos__post = {
                    nombre_nivel,
                    descripcion_grado,
                    numero_categorias,
                    grado_dificultad
                };
                // Llamamos a la función de editar nivel
                await confirmEdicion(datos__post);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al editar nivel');
            }
        }
        setHabilitado(false);
    };

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosNivel();
        }
    }, []);

    // Edicion
    const confirmEdicion = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el nivel?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await NivelEditar(datos.id, datos__post);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate('/nivel/all')
                } catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/nivel/all')
            }
        });
    };

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre_nivel.trim() === "" ||
            descripcion_grado.trim() === "" ||
            !numero_categorias || // asumiendo que 'numero_categorias' es un número o un valor que se evalúa como falsy cuando no es válido
            grado_dificultad.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviarFNivel}>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de nivel:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre_nivel} onChange={e => setNombre(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Descripción de nivel:</label>
                <textarea onClick={info__nivel} className='form-control w-100 tamanio-text-area' type="text"
                    placeholder="Ingrese una descripción corta**"
                    id="descripcion" name="descripcion"
                    value={descripcion_grado} onChange={e => setDescripcion(e.target.value)} />
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
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    )
}



/* EDICION DE DOMINIO */
export function FormularioEdicion() {
    // Obtener el parametro de la URL
    let { slug } = useParams();
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [datos, setDatos] = useState([]);
    const [nombre_dominio, setNombreDominio] = useState("");
    const [descripcion_dominio, setDescripcionDominio] = useState("");
    const [portada_dominio, setPortada] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Datos
    const obtenerDatosDominio = async () => {
        try {
            const contD = await VerificarDominio(slug);
            if (contD.data.success && contD.data.identificador) {
                const datos__user = await DominioIndividual(contD.data.identificador);
                setDatos(datos__user.data)
                setNombreDominio(datos__user.data.nombre);
                setDescripcionDominio(datos__user.data.descripcion);
            } else {
                if (contD.data.error) {
                    Swal.fire(contD.data.error, "", "warning");
                    navigate('/dominio/all')
                } else if (contD.data.errorSalida) {
                    navigate('/login')
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de dominio');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosDominio();
        }
    }, []);

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre_dominio.trim() === "" ||
            descripcion_dominio.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Editar dominio
    const enviarFDominio = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                //Flujo normal
                const formData = new FormData(); // Crear un objeto FormData
                // Verificamos que portada no sea vacio
                if (portada_dominio !== "") {
                    //formData.append('identificador', datos.id);
                    formData.append('portada_dominio', portada_dominio);
                    formData.append('nombre', nombre_dominio);
                    formData.append('descripcion', descripcion_dominio);
                    // Confirmamos edicion
                    //await confirmEdicionManual(formData);
                } else {
                    formData.append('nombre', nombre_dominio);
                    formData.append('descripcion', descripcion_dominio);
                    // Confirmamos edicion
                    //await confirmEdicion(formData);
                }
                await confirmEdicion(formData);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al editar dominio');
            }
        }
        setHabilitado(false);
    };

    // Edicion
    const confirmEdicion = async (formData) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el dominio?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await DominioEditar(datos.id, formData);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate('/dominio/all');
                    window.location.reload();
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        // Manejar errores de respuesta del servidor con código 400
                        if (error.response.data.nombre) {
                            Swal.fire(error.response.data.nombre[0], "", 'error');
                        }
                        if (error.response.data.portada_dominio) {
                            Swal.fire(error.response.data.portada_dominio[0], "", 'error');
                        }
                    } else if (error.message === "NOT_AUTHENTICATED") {
                        Swal.fire("No autenticado", "Inicie sesión para realizar esta acción.", 'error');
                    } else {
                        Swal.fire("Ups ocurrió un error", "", 'error');
                    }
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/dominio/all')
            }
        });
    };

    const confirmEdicionManual = async (formData) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el dominio?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    //await DominioEditar(datos.id, formData);
                    const edit_Domi = await EditarDominioManual(formData);
                    if (edit_Domi.data.success) {
                        Swal.fire("Datos actualizados", "", "success");
                        navigate('/dominio/all')
                    } else {
                        if (edit_Domi.data.error) {
                            Swal.fire(edit_Domi.data.error, '', 'error');
                        } else {
                            Swal.fire('Error al actualizar', '', 'error');
                        }
                    }
                } catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/dominio/all')
            }
        });
    };

    return (
        <form onSubmit={enviarFDominio} encType='multipart/form-data'>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de dominio:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre_dominio} onChange={e => setNombreDominio(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Descripción:</label>
                <textarea onClick={info__dominio} className='form-control w-100 tamanio-text-area' type="text"
                    placeholder="Ingrese una descripción corta**"
                    id="descripcion" name="descripcion"
                    value={descripcion_dominio} onChange={e => setDescripcionDominio(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="portada_dominio">Portada:</label>
                <input className='form-control w-100' type="file" id="portada_dominio"
                    onChange={e => { setPortada(e.target.files[0]); validarTamanoImagen(e.target) }} name='portada_dominio' accept="image/*" />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    )
}



/* EDICION DE CONTENIDO */
export function FormularioEdicionContenido({ slugDominio }) {
    // Obtener el parametro de la URL
    let { slug } = useParams();
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [datos, setDatos] = useState([]);
    const [nombre_contenido, setNombreContenido] = useState("");
    const [dominio_tipo, setTipo] = useState("");
    const [portada, setPortada] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Datos
    const obtenerDatosContenido = async () => {
        try {
            /* Flujo Contenido */
            const contCont = await VerificarContenido(slug);
            if (contCont.data.success && contCont.data.identificador) {
                const datos__user = await ContenidoIndividual(contCont.data.identificador);
                setDatos(datos__user.data);
                setNombreContenido(datos__user.data.nombre);
                setTipo(datos__user.data.dominio_tipo);
            } else {
                if (contCont.data.error) {
                    Swal.fire(contCont.data.error, "", "warning");
                    navigate('/contenido/all')
                } else if (contCont.data.errorSalida) {
                    navigate('/login')
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al mostrar datos de contenido');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosContenido();
        }
    }, []);

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre_contenido.trim() === "" ||
            dominio_tipo.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Envio de datos
    const enviarFContenido = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                // Flujo normal
                const formData = new FormData(); // Crear un objeto FormData
                // Verificamos que portaa no este vacio
                if (portada !== "") {
                    //formData.append('identificador', datos.id);
                    formData.append('portada', portada);
                    formData.append('nombre', nombre_contenido);
                    formData.append('dominio_tipo', dominio_tipo);
                    // Realizar la petición de edicion
                    //await confirmEdicionManual(formData);
                } else {
                    formData.append('nombre', nombre_contenido);
                    formData.append('dominio_tipo', dominio_tipo);
                    // Realizar la petición de edicion
                    //await confirmEdicion(formData);
                }
                await confirmEdicion(formData);
            }
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al editar contenido');
            }
        }
        setHabilitado(false);
    };

    // Edicion
    const confirmEdicion = async (formData) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el contenido?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ContenidoEditar(datos.id, formData);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate(`/contenido/all/${slugDominio}/`)
                    window.location.reload();
                } /*catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }*/
                catch (error) {
                    if (error.response && error.response.status === 400) {
                        // Manejar errores de respuesta del servidor con código 400
                        if (error.response.data.nombre) {
                            Swal.fire(error.response.data.nombre[0], "", 'error');
                        }
                        if (error.response.data.portada_dominio) {
                            Swal.fire(error.response.data.portada[0], "", 'error');
                        }
                    } else if (error.message === "NOT_AUTHENTICATED") {
                        Swal.fire("No autenticado", "Inicie sesión para realizar esta acción.", 'error');
                    } else {
                        Swal.fire("Ups ocurrió un error", "", 'error');
                    }
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate(`/contenido/all/${slugDominio}/`)
            }
        });
    };

    // Edicion
    const confirmEdicionManual = async (formData) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el contenido?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const edit_cont = await EditarContenidoManual(formData);
                    if (edit_cont.data.success) {
                        Swal.fire("Datos actualizados", "", "success");
                        navigate(`/contenido/all/${slugDominio}/`)
                    } else {
                        if (edit_cont.data.error) {
                            Swal.fire(edit_cont.data.error, '', 'error');
                        } else {
                            Swal.fire('Error al actualizar', '', 'error');
                        }
                    }
                } catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate(`/contenido/all/${slugDominio}/`)
            }
        });
    };


    return (
        <form onSubmit={enviarFContenido} encType='multipart/form-data'>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de contenido:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre_contenido} onChange={e => setNombreContenido(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="dominio">Tipo de contenido:</label>
                <select className="form-control w-100" id="dominio" name="dominio"
                    value={dominio_tipo} onChange={e => setTipo(e.target.value)}>
                    <option value="none">None</option>
                    <option value="Sensorial"> Tipo Sensorial</option>
                    <option value="Congnitivo">Tipo Congnitivo</option>
                    <option value="Escritura">Tipo Escritura</option>
                    <option value="Psicomotriz">Tipo Psicomotriz</option>
                </select>
            </div>
            <div className="form-group">
                <label className='label' htmlFor="portada_contenido">Portada:</label>
                <input className='form-control w-100' type="file" id="portada_contenido"
                    onChange={e => { setPortada(e.target.files[0]); validarTamanoImagen(e.target) }} name='portada_contenido' accept="image/*" />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    )
}



/* EDICION DE CONTENIDO INDIVIDUAL */
export function FormularioEdicionIndividual({ slugContenido }) {
    // Obtener el parametro de la URL
    let { slug } = useParams();
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [niveles, setNiveles] = useState([]);
    const [nombre_nivel, setNombreNivel] = useState("");
    const [datos, setDatos] = useState([]);
    const [descripcion_individual, setDescripcion] = useState("");
    const [preguntas, setPreguntas] = useState("");
    const [tipo_contenido, setTipo] = useState("");
    //const [portada_individual, setPortada] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [color, setColor] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const [activo, setActivo] = useState(false);
    const [actColor, setActColor] = useState(false);
    const navigate = useNavigate();
    // Imágenes
    const [contenido_individual, setContenido] = useState("");
    const [img1, setImg1] = useState("");
    const [img2, setImg2] = useState("");
    const [img3, setImg3] = useState("");
    const [img4, setImg4] = useState("");
    const [img5, setImg5] = useState("");
    const [contador, setContador] = useState(0);

    const [nuevaDescripcion, setNuevaDescripcion] = useState("");
    const [nuevoRespuesta, setNuevaRespuesta] = useState("");

    // Datos
    const obtenerDatosInd = async () => {
        try {
            /* Flujo Nivel */
            const nivel = await NivelListado();
            setNiveles(nivel.data);
            /* Flujo de contenido */
            const contI = await VerificarContenidoIndividual(slug);
            if (contI.data.success && contI.data.identificador) {
                const datos__user = await ContenidoDatosIndividual(contI.data.identificador);
                setDatos(datos__user.data);
                setTipo(datos__user.data.tipo_contenido);
                //setRespuesta(datos__user.data.respuesta);
                setNombreNivel(datos__user.data.nivel);
                //setDescripcion(datos__user.data.descripcion_individual);
                // Verificacion de descripcion de actividad
                const descrip_completa = datos__user.data.descripcion_individual;
                // Corroborar la existencia de coma como divisor
                if (descrip_completa.includes(',')) {
                    // Para las comas
                    const particion = descrip_completa.split(',');
                    setDescripcion(particion[0].trim());
                    // Adjuntar asi sea 1 o mas restantes
                    setPreguntas(particion.slice(1).join(',').trim());
                } else {
                    // Si no hay comas, todo es parte de la descripción
                    setDescripcion(descrip_completa);
                }
                const respuesta_completa = datos__user.data.respuesta;
                // Verificar tipo de contenido
                if (datos__user.data.tipo_contenido === "pintar_imagen") {
                    // Corroborar la existencia de coma como divisor
                    if (respuesta_completa.includes(',')) {
                        // Para las comas
                        const particion_color = respuesta_completa.split(',');
                        // El ultimo valor sera setcolor
                        setColor(particion_color.pop().trim());
                        // El resto de valores seran setrespuesta
                        setRespuesta(particion_color.join(',').trim());
                    }
                } else {
                    // Si no hay comas, todo es parte de la descripción
                    setRespuesta(respuesta_completa);
                }
                // Conteo de imagenes
                if (datos__user.data.tipo_contenido === "seleccionar_imagen") {
                    if (datos__user.data.imagen3 !== "" && datos__user.data.imagen3 !== null) {
                        setContador(4);
                    }
                    if (datos__user.data.imagen5 !== "" && datos__user.data.imagen5 !== null) {
                        setContador(6);
                    }
                }
            } else {
                if (contI.data.error) {
                    Swal.fire(contI.data.error, "", "warning");
                    navigate('/contenido/individual/all')
                } else if (contI.data.errorSalida) {
                    navigate('/login')
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de contenido');
            }
        }
    }

    // Use Effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosInd();
        }
    }, []);

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Método para combinar descripcion_individual y preguntas
    const combinarDescripcionYPreguntas = () => {
        // Combinar los valores y regresar
        return `${descripcion_individual}, ${preguntas}`;
    }

    // Método para combinar respuesta y color
    const combinarRespuestayColor = () => {
        // Combinar los valores y regresar
        return `${respuesta}, ${color}`;
    }

    // Respuestas y preguntas
    useEffect(() => {
        if (datos.tipo_contenido === "responder_preguntas" ||
            datos.tipo_contenido === "pintar_imagen" ||
            datos.tipo_contenido === "cuento") {
            const com = combinarDescripcionYPreguntas();
            setNuevaDescripcion(com);
            setActivo(true);
        }
    }, [datos, descripcion_individual, preguntas]);

    // Control de tipo de contenido pinta imagen
    useEffect(() => {
        if (datos.tipo_contenido === "pintar_imagen") {
            const colornew = combinarRespuestayColor();
            setNuevaRespuesta(colornew);
            setActColor(true);
        }
    }, [datos, respuesta, color]);

    // Envio de datos
    const enviarFCont = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }

        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                const formData = new FormData(); // Crear un objeto FormData
                // Cambio y envío de descripcion
                if (activo) {
                    formData.append('descripcion_individual', nuevaDescripcion);
                } else {
                    formData.append('descripcion_individual', descripcion_individual);
                }
                // Cambio y envío de respuesta
                if (actColor) {
                    formData.append('respuesta', nuevoRespuesta);
                } else {
                    formData.append('respuesta', respuesta);
                }
                // Mas datos
                formData.append('tipo_contenido', tipo_contenido);
                formData.append('nivel', nombre_nivel);
                // Controlar el envio sin imágenes
                if (contenido_individual !== "" || img1 !== "" || img2 !== "" || img3 !== "" || img4 !== "" || img5 !== "") {
                    // Enviar id de la actividad
                    formData.append('identificador', datos.id);
                    // Controlar las imágenes por el tipo de contenido
                    if (tipo_contenido === "pintar_imagen") {
                        formData.append('contenido_individual', contenido_individual);
                        formData.append('img1', img1);
                    } else if (tipo_contenido === "selecion_multiple_img" || tipo_contenido === "pictograma") {
                        formData.append('contenido_individual', contenido_individual);
                        formData.append('img1', img1);
                        formData.append('img2', img2);
                        formData.append('img3', img3);
                    } else if (tipo_contenido === "seleccionar_imagen") {
                        // Controlar cuatro imagenes 
                        formData.append('contenido_individual', contenido_individual);
                        formData.append('img1', img1);
                        formData.append('img2', img2);
                        formData.append('img3', img3);
                        formData.append('img4', img4);
                        formData.append('img5', img5);
                    } else {
                        formData.append('contenido_individual', contenido_individual);
                    }
                    // Realizar la petición de edicion
                    await confirmarEdicionManual(formData);
                } else {
                    // Realizar la petición de edicion
                    await confirmEdicion(formData);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al editar contenido individual');
            }
        }
        setHabilitado(false);

    };

    // Edicion
    const confirmEdicion = async (formData) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el contenido?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ContenidoIndividualEditar(datos.id, formData);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate(`/contenido/individual/all/${slugContenido}/`)
                } catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate(`/contenido/individual/all/${slugContenido}/`)
            }
        });
    };

    // Edición manual de actividad
    const confirmarEdicionManual = async (formData) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el contenido?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const edic_manual = await EditarActividadManual(formData);
                    if (edic_manual.data.success) {
                        Swal.fire("Datos actualizados", "", "success");
                        navigate(`/contenido/individual/all/${slugContenido}/`)
                    } else {
                        if (edic_manual.data.error) {
                            Swal.fire(edic_manual.data.error, '', 'error');
                        } else {
                            Swal.fire('Error al actualizar', '', 'error');
                        }
                    }
                } catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate(`/contenido/individual/all/${slugContenido}/`)
            }
        });
    };

    // Control de campos de entrada y salida
    // Campos vacios
    const isValidForm = () => {
        if (
            descripcion_individual.trim() === "" ||
            tipo_contenido.trim() === "" || tipo_contenido === "none" ||
            nombre_nivel.trim() === "" || nombre_nivel === "none" ||
            respuesta.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    return (
        <form onSubmit={enviarFCont} encType='multipart/form-data'>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Indicación:</label>
                <textarea onClick={info__contenido} className='form-control w-100 tamanio-text-area'
                    type="text" id="descripcion"
                    value={descripcion_individual} onChange={e => setDescripcion(e.target.value)}
                    name='descripcion' autoFocus
                    placeholder="Ingresa la indicación de la actividad**"
                />
            </div>
            <>
                {
                    datos.tipo_contenido === "responder_preguntas" || datos.tipo_contenido === "pintar_imagen" ||
                        datos.tipo_contenido === "cuento" ? (
                        <div className="form-group">
                            <label className='label' htmlFor="preguntas">Preguntas:</label>
                            <textarea onClick={info__contenido} className='form-control w-100 tamanio-text-area'
                                type="text" id="preguntas"
                                value={preguntas} onChange={e => setPreguntas(e.target.value)}
                                name='preguntas'
                                placeholder="Ingresa la indicación de la actividad**"
                            />
                        </div>
                    ) : <> </>
                }
            </>

            <div className="form-group">
                <label className='label' htmlFor="respuesta">Respuesta:</label>
                <input onClick={info__contenido__respuesta} className='form-control w-100' type="text" placeholder="Ingresa la respuesta**" id="respuesta" name="respuesta"
                    value={respuesta} onChange={e => setRespuesta(e.target.value)} />
            </div>
            <>
                {
                    tipo_contenido === "pintar_imagen" &&
                    <>
                        <div className="form-group">
                            <label className='label' htmlFor="color">Color:</label>
                            <input className='form-control w-100' type="text" placeholder="Ingresa el color a completar en la imagen**" id="color" name="color"
                                value={color} onChange={e => setColor(e.target.value)} />
                        </div>
                    </>
                }
            </>
            <>
                {
                    !datos?.id &&
                    <div className="form-group">
                        <label className='label' htmlFor="contenido_individual">Contenido:</label>
                        <input className='form-control w-100' type="file" id="contenido_individual"
                            onChange={(e) => { setContenido(e.target.files[0]); validarTamanoImagen(e.target) }} name='contenido_individual' accept="image/*" />
                    </div>
                }
            </>
            <div className="form-group">
                <label className='label' htmlFor="contenido_individual">Contenido:</label>
                <input className='form-control w-100' type="file" id="contenido_individual"
                    onChange={(e) => { setContenido(e.target.files[0]); validarTamanoImagen(e.target) }} name='contenido_individual' accept="image/*" />
            </div>
            <>
                {
                    tipo_contenido === "selecion_multiple_img" || tipo_contenido === "pictograma" &&
                    <>
                        <div className='form-row row'>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img1">Contenido de opción 2:</label>
                                <input className='form-control w-100' type="file" id="img1"
                                    onChange={(e) => { setImg1(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img1' accept="image/*" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img2">Contenido de opción 3:</label>
                                <input className='form-control w-100' type="file" id="img2"
                                    onChange={(e) => { setImg2(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img2' accept="image/*" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className='label' htmlFor="img3">Contenido de opción 4:</label>
                            <input className='form-control w-100' type="file" id="img3"
                                onChange={(e) => { setImg3(e.target.files[0]); validarTamanoImagen(e.target) }}
                                name='img3' accept="image/*" />
                        </div>
                    </>

                }
                {
                    tipo_contenido === "seleccionar_imagen" &&
                    <>
                        <div className='form-row row'>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img1">Contenido de opción 2:</label>
                                <input className='form-control w-100' type="file" id="img1"
                                    onChange={(e) => { setImg1(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img1' accept="image/*" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img2">Contenido de opción 3:</label>
                                <input className='form-control w-100' type="file" id="img2"
                                    onChange={(e) => { setImg2(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img2' accept="image/*" />
                            </div>
                        </div>
                        <div className='form-row row'>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img3">Contenido de opción 4:</label>
                                <input className='form-control w-100' type="file" id="img3"
                                    onChange={(e) => { setImg3(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img3' accept="image/*" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img4">Contenido de opción 5:</label>
                                <input className='form-control w-100' type="file" id="img4"
                                    onChange={(e) => { setImg4(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img4' accept="image/*"
                                    disabled={contador === 4 ? true : false}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className='label' htmlFor="img5">Contenido de opción 6:</label>
                            <input className='form-control w-100' type="file" id="img5"
                                onChange={(e) => { setImg5(e.target.files[0]); validarTamanoImagen(e.target) }}
                                name='img5' accept="image/*"
                                disabled={contador === 4 ? true : false}
                            />
                        </div>
                    </>
                }
                {
                    tipo_contenido === "pintar_imagen" &&
                    <>
                        <div className="form-group">
                            <label className='label' htmlFor="img1">Contenido de opción 2:</label>
                            <input className='form-control w-100' type="file" id="img1"
                                onChange={(e) => { setImg1(e.target.files[0]); validarTamanoImagen(e.target) }}
                                name='img1' accept="image/*" />
                        </div>
                    </>
                }
            </>
            <div className="form-group">
                <label className='label' htmlFor="grado">Grado:</label>
                <select className="form-control w-100" id="grado"
                    name="grado" value={nombre_nivel} onChange={e => setNombreNivel(e.target.value)}>
                    <option value="none">None</option>
                    <>
                        {niveles.map((nivel) => (
                            <option key={nivel.id} value={nivel.nombre_nivel}>
                                {nivel.nombre_nivel}
                            </option>
                        ))}
                    </>
                </select>
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    )
}



/* EDICION DE CURSO */
export function FormularioEdicionCurso() {
    // Obtener el parametro de la URL
    let { slug } = useParams();
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [datosCurso, setDatosCurso] = useState([]);
    const [nombre_curso, setNombreCurso] = useState("");
    const [descripcion_curso, setDescripcionCurso] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Datos
    const obtenerDatosCurso = async () => {
        try {
            const contC = await VerificarCurso(slug);
            if (contC.data.identificador && contC.data.success) {
                const datos__user = await CursoIndividual(contC.data.identificador);
                setDatosCurso(datos__user.data)
                setNombreCurso(datos__user.data.nombre_curso);
                setDescripcionCurso(datos__user.data.descripcion_curso);
            } else {
                if (contC.data.error) {
                    Swal.fire(contC.data.error, "", "warning");
                    navigate('/cursos/all')
                } else if (contC.data.errorSalida) {
                    navigate('/login')
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de curso');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosCurso();
        }
    }, []);

    // Envio de datos
    const enviarFCurso = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                // Obtenemos los datos
                const datos__post = {
                    nombre_curso,
                    descripcion_curso
                };
                // Llamamos a la función de editar nivel
                await confirmEdicion(datos__post);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al editar curso');
            }
        }
        setHabilitado(false);
    };

    // Edicion
    const confirmEdicion = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el curso?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await CursoEditar(datosCurso.id, datos__post);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate('/cursos/all');
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        // Manejar errores de respuesta del servidor con código 400
                        if (error.response.data.nombre) {
                            Swal.fire(error.response.data.nombre[0], "", 'error');
                        }
                    } else if (error.message === "NOT_AUTHENTICATED") {
                        Swal.fire("No autenticado", "Inicie sesión para realizar esta acción.", 'error');
                    } else {
                        Swal.fire("Ups ocurrió un error", "", 'error');
                    }
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/cursos/all')
            }
        });
    };


    // Campos vacios
    const isValidForm = () => {
        if (
            nombre_curso.trim() === "" ||
            descripcion_curso.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <form onSubmit={enviarFCurso}>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de curso:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" id="nombre"
                    value={nombre_curso} onChange={e => setNombreCurso(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Descripción de curso:</label>
                <textarea className='form-control w-100 tamanio-text-area' type="text" id="descripcion"
                    value={descripcion_curso} onChange={e => setDescripcionCurso(e.target.value)}
                    name='descripcion'
                    placeholder="Ingrese una descripción corta**"
                />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    );
}



/* EDICION DE RESULTADO */
export function FormularioEdicionResultado() {
    // Obtener el parametro de la URL
    let { id } = useParams();
    // Parametros de form
    const token = localStorage.getItem('token');
    const [datosResultado, setDatosResultado] = useState([]);
    const [observacion, setObservacion] = useState("");
    //const [fecha, setFecha] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Datos
    const obtenerDatosResultado = async () => {
        try {
            const datos__resultado = await ResultadoIndividual(id);
            setDatosResultado(datos__resultado.data);
            setObservacion(datos__resultado.data.observacion);
            //setFecha(datos__resultado.data.fecha_registro_resultado);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de resultado');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosResultado();
        }
    }, []);

    // Envio de datos
    const enviarFResultado = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                // Obtenemos los datos
                const datos__post = {
                    observacion
                };
                // Llamamos a la función de editar nivel
                await confirmEdicion(datos__post);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al editar resultado');
            }
        }
        setHabilitado(false);
    };

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Edicion
    const confirmEdicion = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el resultado?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ResultadoEditar(datosResultado.id, datos__post);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate('/resultado/all')
                } catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/resultado/all')
            }
        });
    };

    // Campos vacios
    const isValidForm = () => {
        if (
            observacion.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    return (
        <form onSubmit={enviarFResultado}>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="resultado">Observación de resultado:</label>
                <textarea class="form-control tamanio-text-area w-100" placeholder="Ingrese las observaciones**"
                    id="resultado" required autoFocus
                    value={observacion}
                    onChange={e => setObservacion(e.target.value)}>
                </textarea>
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    );
}


/* EDICION DE SALA */
export function FormularioEdicionSala() {
    // Obtener el parametro de la URL
    let { id } = useParams();
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [datosSala, setDatosSala] = useState([]);
    const [nombre_sala, setNombre] = useState("");
    const [anotaciones, setAnotaciones] = useState("");
    const [codigo_identificador, setCodigoIdentificador] = useState("");
    const [identificador_sala, setIdentificadorSala] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Datos
    const obtenerDatosSala = async () => {
        try {
            const datos__sala = await SalaIndividual(id);
            setDatosSala(datos__sala.data);
            setNombre(datos__sala.data.nombre_sala);
            setAnotaciones(datos__sala.data.anotaciones);
            setCodigoIdentificador(datos__sala.data.codigo_identificador);
            setIdentificadorSala(datos__sala.data.id);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de la sala');
            }
        }
    }

    // Traida de datos
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosSala();
        }
    }, []);

    // Operacion de guardado
    const enviarFSala = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                // Obtenemos los datos
                const datos__post = {
                    nombre_sala,
                    anotaciones,
                    codigo_identificador,
                    identificador_sala
                };
                // Funcion de registro
                confirmEdicion(datos__post);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al actualizar sala');
            }
        }
        setHabilitado(false);
    };

    // Campos vacios
    const isValidForm = () => {
        if (
            nombre_sala.trim() === "" ||
            anotaciones.trim() === "" ||
            codigo_identificador.trim() === ""
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
    const confirmEdicion = async (datos__post) => {
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
                    const response = await EditarSala(datos__post);
                    if (response.data.success) {
                        // Redireccionar a la página principal si el inicio de sesión es exitoso
                        Swal.fire("Sala actualizada correctamente", "", "success");
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
                navigate('/sala/all')
            }
        });
    };

    return (
        <form onSubmit={enviarFSala}>
            {error && <span>{error}</span>}
            <div className="form-group">
                <label className='label' htmlFor="nombre">Nombre de sala:</label>
                <input className='form-control w-100' type="text" placeholder="Ingrese el nombre de sala**" id="nombre"
                    name="nombre" value={nombre_sala} onChange={e => setNombre(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="anotacion">Descripción de actividad:</label>
                <textarea className='form-control w-100 tamanio-text-area' type="text" id="anotacion"
                    value={anotaciones} onChange={e => setAnotaciones(e.target.value)}
                    name='anotacion' />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="codigo">Código/s de actividad:</label>
                <textarea className='form-control w-100 h-100' type="text" id="codigo"
                    value={codigo_identificador} onChange={e => setCodigoIdentificador(e.target.value)}
                    name='codigo'
                    placeholder="Ingrese el código/s de contenido. Ejm: 12145, 45578" />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    )

}



/* EDICION DE REPORTE */
export function FormularioEdicionReporte() {
    // Obtener el parametro de la URL
    let { id } = useParams();
    // Parametros de form
    const token = localStorage.getItem('token');
    const [datosReporte, setDatosReporte] = useState([]);
    const [descripcion_reporte, setDescripcionReporte] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();

    // Datos
    const obtenerDatosReporte = async () => {
        try {
            const datos__reporte = await ReporteIndividual(id);
            setDatosReporte(datos__reporte.data);
            setDescripcionReporte(datos__reporte.data.descripcion_reporte);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de reporte');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosReporte();
        }
    }, []);

    // Envio de datos
    const enviarFormReporte = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                // Obtenemos los datos
                const datos__post = {
                    descripcion_reporte
                };
                // Llamamos a la función de editar nivel
                await confirmEdicion(datos__post);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al editar el reporte');
            }
        }
        setHabilitado(false);
    };

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Edicion
    const confirmEdicion = async (datos__post) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en el reporte?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ReporteEditar(datosReporte.id, datos__post);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate(`/ver/reporte/${id}/`)
                } catch (error) {
                    Swal.fire('Error al actualizar', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate(`/ver/reporte/${id}/`)
            }
        });
    };

    // Campos vacios
    const isValidForm = () => {
        if (
            descripcion_reporte.trim() === ""
        ) {
            return false;
        }
        return true;
    }

    return (
        <form onSubmit={enviarFormReporte}>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="reporte">Observación de reporte:</label>
                <textarea class="form-control w-100 tamanio-text-area"
                    placeholder="Ingrese las observaciones**"
                    id="reporte" required autoFocus
                    value={descripcion_reporte}
                    onChange={e => setDescripcionReporte(e.target.value)}>
                </textarea>
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Actualizando...' : 'Actualizar'}
            </Button>
        </form>
    );
}
