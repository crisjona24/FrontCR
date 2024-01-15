/* ****** COMPONENTE CONTENIDOS INDIVIDUALES *** */
// Estilos
import "../../styles/Cabecera.css";
import "../../styles/Contenido_individual.css";
import "bootstrap/dist/css/bootstrap.min.css";
// Contenidos
import React, { useState, useRef, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
// Metodos
import { CrearResultadoNew } from "../../api/resultado.api"

// Funciones
// Convertir milisegundos a minutos y segundos
const convertirMilisegundosAMinutosYSegundos = (milisegundos) => {
    const segundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return { minutos, segundos: segundosRestantes };
};

export function FormularioNueve({ context, isActive, usuario, slugContenido }) {
    /* *** Valores recuperados */
    const {
        url__contenido, descripcion__contenido,
        identificador, tipo__contenido, slug, url_c1, url_c2,
        url_c3
    } = context;
    const tipo = usuario.tipo;

    // Control de minutos
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);
    // Control de tiempo
    const [tiempoDeCarga, setTiempoDeCarga] = useState(null);
    let tiempoActual;
    // Controles de contenido de estudio
    const empezarBtnRef = useRef(null);
    const verificarRef = useRef(null);
    const miContainerRef = useRef(null);
    const [contenidoHabilitado, setContenidoHabilitado] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [verificarBtnD, setVerificarBtnD] = useState(true);
    // Respuesta
    const [respuesta, setRespuesta] = useState("");
    const [tiempoTranscurrido__minutos, setMinutos] = useState(0);
    const [tiempoTranscurrido__segundos, setSegundos] = useState(0);
    // Formulario
    const [slug__, setSlug] = useState(slug);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Captura de valores para la respuesta
    useEffect(() => {
        // Controlar el botón "Empezar"
        setupEmpezarButton();
        // Controlar los input checkbox
        const checkboxes = document.querySelectorAll('input[type="radio"]');
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("click", () => {
                // Verificar si al menos uno de los checkboxes está seleccionado
                const isChecked = Array.from(checkboxes).some(
                    (checkbox) => checkbox.checked
                );
                // Habilitar o deshabilitar el botón "Verificar" según el resultado
                if (isChecked) {
                    checkbox.addEventListener("change", obtenerRespuestaSeleccionada);
                    setVerificarBtnD(false);
                } else {
                    setVerificarBtnD(true);
                }
            });
        });
        return () => {
            if (empezarBtnRef.current) {
                empezarBtnRef.current.removeEventListener("click", botnEmpezar);
            };
            checkboxes.forEach((checkbox) => {
                checkbox.removeEventListener("change", obtenerRespuestaSeleccionada);
            });
        };

    }, [usuario]);

    // Controlar el botón "Empezar"
    const setupEmpezarButton = () => {
        // vericiar si el contdor es igual a 0
        if (empezarBtnRef.current) {
            empezarBtnRef.current.addEventListener("click", botnEmpezar);
        }
    };

    // Controlar el botón "Verificar"
    const botnEmpezar = () => {
        setTiempoDeCarga(new Date());
        setContenidoHabilitado(true);
        setBtnDisabled(true);

        // Control de minutos
        setStartTime(new Date());
    };

    // Capturar la respuesta seleccionada
    const obtenerRespuestaSeleccionada = () => {
        const radios = document.getElementsByName('gridRadios');
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                setRespuesta(radios[i].value);
                break;
            }
        }
    };

    // Cptura de tiempo
    const tiempo = () => {
        if (!tiempoDeCarga) return;
        tiempoActual = new Date();
        let tiempoTranscurrido = tiempoActual - tiempoDeCarga;
        // Convertir el tiempo a minutos y segundos
        let { minutos, segundos } = convertirMilisegundosAMinutosYSegundos(tiempoTranscurrido);
        setMinutos(minutos);
        setSegundos(segundos);
        setVerificarBtnD(false);
    }

    // CONTROL DE FUERA DE TIEMPO
    useEffect(() => {
        if (startTime) {
            console.log("startTime: ", startTime);
            console.log("elapsedTime: ", elapsedTime);
            const interval = setInterval(() => {
                const now = Date.now();
                const timeDiff = now - startTime; // en milisegundos
                const secondsElapsed = Math.floor(timeDiff / 1000);
                const minutesElapsed = Math.floor(secondsElapsed / 60);
                setElapsedTime(minutesElapsed);
            }, 1000); // cada segundo
            return () => clearInterval(interval);
        }
    }, [startTime]);

    useEffect(() => {
        if (elapsedTime >= 40) {
            console.log("Tiempo de resolución agotado: ", elapsedTime);
            // Enviar el formulario
            enviarForm(new Event('submit'));
            Swal.fire("Tiempo de resolución agotado", "", "warning");
            clearInterval(intervalRef.current);
        }
    }, [elapsedTime]);

    // Enviar los datos del formulario
    const enviarForm = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const datos__post = {
                slug__,
                respuesta,
                tiempoTranscurrido__minutos,
                tiempoTranscurrido__segundos
            };
            console.log(datos__post);
            setVerificarBtnD(true);
            // Realizar la petición POST al servidor
            const response = await CrearResultadoNew(datos__post);
            if (response.data.success) {
                // Redireccionar a la página principal de contenido individual
                Swal.fire("Respuesta registrada", "", "success");
                navigate(`/contenido/individual/all/${slugContenido}/`);
            } else {
                if (response.data.error) {
                    mostrarError(response.data.error);
                } else {
                    mostrarError("Error al registrar resultado");
                }
            }
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError("Error al registrar resultado");
            }
        }
    };

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <div style={{ margin: '0', padding: '0' }}>
            <div className="container row col-md-12">
                <div className="opciones__cuerpo">
                    <div className="alineacion__etiquetas d-flex flex-column justify-content-between">
                        <h5 className="card-title ml-2">
                            Ejercicio
                        </h5>
                        <h6 className="card-subtitle text-muted span mb-2" style={{ paddingLeft: '20px' }}>
                            Identificador: {identificador}</h6>
                        <h6 className="card-subtitle text-muted span mb-2" style={{ paddingLeft: '20px' }}>
                            Nivel: {tipo__contenido}</h6>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                        <>
                            {
                                tipo === "paciente" &&
                                <button ref={empezarBtnRef} disabled={btnDisabled} id="empezarBtn" type="button"
                                    className="btn_resolver_act btn btn-success"
                                >
                                    Resolver
                                </button>
                            }
                        </>
                        <span>
                            <Link className="tam_actividad btn btn-success" style={{ backgroundColor: '#0C2342' }}>
                                <FontAwesomeIcon icon={faStar} />
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
            {error &&
                <div id="alert" className="alert alert-success" role="alert">
                    <h5 className="alert-heading">!Atención!</h5>
                    <p className="mb-0">{error}</p>
                </div>
            }
            <div className="container row col-md-12 mt-4">
                <div className="contenedor__cuerpo_tipo9" id="miContainer" ref={miContainerRef} style={{
                    pointerEvents: contenidoHabilitado ? 'auto' : 'none',
                    opacity: contenidoHabilitado ? 1 : 0.5
                }}>
                    <div className="contenedor__cuerpo__division_t9">
                        <div className="alineacion__etiquetas d-flex">
                            <span className={`mt-3 ${isActive ? 'span-2_' : 'span-2'}`} style={{ color: 'rgb(0, 146, 99)' }}>
                                Indicación: {descripcion__contenido} </span>
                        </div>
                        <div className="contenido-imagen_9">
                            <form onSubmit={enviarForm} className="formulario_acti_9">
                                <div className="ml-3 pl-3">
                                    <fieldset className="form-group">
                                        <div className="contenedor-division_CI">
                                            <div className="card_CI form-check">
                                                <div className="textos__">
                                                    <div className="container mt-3">
                                                        <input className="form-check-input border border-dark mt-5" type="radio" name="gridRadios"
                                                            id="gridRadios1" value="Correcto" onChange={e => setRespuesta(e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <img src={url__contenido} alt="Imagen de selección"
                                                            className={isActive ? 'imagen_selcmulti_' : 'imagen_selcmulti'} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card_CI form-check">
                                                <div className="textos__">
                                                    <div className="container mt-3">
                                                        <input className="form-check-input border border-dark mt-5" type="radio" name="gridRadios"
                                                            id="gridRadios2" value="Incorrecto" onChange={e => setRespuesta(e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <img src={url_c1} alt="Imagen de selección" className={isActive ? 'imagen_selcmulti_' : 'imagen_selcmulti'} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card_CI form-check">
                                                <div className="textos__">
                                                    <div className="container mt-3">
                                                        <input className="form-check-input border border-dark mt-5" type="radio" name="gridRadios"
                                                            id="gridRadios3" value="Incorrecto" onChange={e => setRespuesta(e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <img src={url_c2} alt="Imagen de selección" className={isActive ? 'imagen_selcmulti_' : 'imagen_selcmulti'} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card_CI form-check">
                                                <div className="textos__">
                                                    <div className="container mt-3">
                                                        <input className="form-check-input border border-dark mt-5" type="radio" name="gridRadios"
                                                            id="gridRadios4" value="Incorrecto" onChange={e => setRespuesta(e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <img src={url_c3} alt="Imagen de selección" className={isActive ? 'imagen_selcmulti_' : 'imagen_selcmulti'} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                {/* Eñ input que se envia */}
                                <input type="hidden" id="slug" name="slug" value={slug__} onChange={e => setSlug(e.target.value)} />
                                <div className="d-flex flex-column justify-content-between align-items-center mt-3">
                                    <button type="submit" className="btn btn-success tam_listo"
                                        id="verificarBtn" ref={verificarRef} disabled={verificarBtnD} onClick={tiempo}>
                                        !Listo!
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}