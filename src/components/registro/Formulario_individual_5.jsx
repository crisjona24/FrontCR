/* ****** COMPONENTE CONTENIDOS INDIVIDUALES *** */
// Estilos
import "../../styles/Cabecera.css";
import "../../styles/Contenido_individual.css";
import "../../styles/Varios.css";
import "bootstrap/dist/css/bootstrap.min.css";
// Componentes
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
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

// Verificar si contenedor tiene un formato palabra1, palabra2 y retorne palabra2
const obtenerColor = (contenedor) => {
    let palabra_color = "";
    if (typeof contenedor === 'string') { // Verifica que contenedor sea una cadena
        const pal = contenedor.split(",");
        if (pal.length > 1) {
            // Seleccionar siempre el ultimo item
            palabra_color = pal[pal.length - 1].trim();
        }
    } else {
        // Recorrer contenedor y seleccionar el ultimo valor
        for (let i = 0; i < contenedor.length; i++) {
            if (contenedor.length > 1) {
                // Seleccionar siempre el ultimo item
                palabra_color = contenedor[contenedor.length - 1].trim();
            }
        }
    }
    return palabra_color;
};

export function FormularioCinco({ context, isActive, usuario, slugContenido }) {
    /* *** Valores recuperados *** */
    const {
        url__contenido, descripcion__contenido, identificador,
        tipo__contenido, slug, url_c1, contenedor
    } = context;
    const tipo = usuario.tipo;

    // Control de minutos
    const [startTime, setStartTime] = useState(null);
    const [tiempoDuracion, setTiempoDuracion] = useState(0);
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
    // Respuestas
    const [respuestas, setRespuestas] = useState([]);
    const [tiempoTranscurrido__minutos, setMinutos] = useState(0);
    const [tiempoTranscurrido__segundos, setSegundos] = useState(0);
    const imagenRef = useRef(null);
    const [color, setColor] = useState(obtenerColor(contenedor));
    // Formulario    
    const [slug__, setSlug] = useState(slug);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Captura de valores para la respuesta
    useEffect(() => {
        // Controlar el botón "Empezar"
        setupEmpezarButton();
        // Controlar los input checkbox
        const inputs = document.querySelectorAll('input[name="respuesta"]');
        inputs.forEach((input) => {
            input.addEventListener("input", () => {
                // Verificar si al menos uno de los checkboxes está seleccionado
                const isChecked = Array.from(inputs).some(
                    (input) => input.value != ""
                );
                // Habilitar o deshabilitar el botón "Verificar" según el resultado
                if (isChecked) {
                    setVerificarBtnD(false);
                } else {
                    setVerificarBtnD(true);
                }
            });
        });
        return () => {
            if (empezarBtnRef.current) {
                empezarBtnRef.current.removeEventListener("click", botonEmpezar);
            };
        };

    }, [usuario]);

    // Controlar el botón "Empezar"
    const setupEmpezarButton = () => {
        if (empezarBtnRef.current) {
            empezarBtnRef.current.addEventListener("click", botonEmpezar);
        }
    };

    // Controlar el botón "Verificar"
    const botonEmpezar = () => {
        setTiempoDeCarga(new Date());
        setContenidoHabilitado(true);
        setBtnDisabled(true);

        // Control de minutos
        setStartTime(new Date());
    };

    // Capturar los valores de los input
    const handleInputChange = (index, e) => {
        console.log(`Index: ${index}`, `Value: ${e.target.value}`);
        setRespuestas(prev => {
            const newRespuestas = [...prev];
            newRespuestas[index] = e.target.value;
            return newRespuestas;
        });
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
    };

    // CONTROL DE FUERA DE TIEMPO
    useEffect(() => {
        if (startTime) {
            console.log("startTime: ", startTime);
            console.log("elapsedTime: ", tiempoDuracion);
            const interval = setInterval(() => {
                const now = Date.now();
                const timeDiff = now - startTime; // en milisegundos
                const secondsElapsed = Math.floor(timeDiff / 1000);
                const minutesElapsed = Math.floor(secondsElapsed / 60);
                setTiempoDuracion(minutesElapsed);
            }, 1000); // cada segundo

            return () => clearInterval(interval);
        }
    }, [startTime]);

    useEffect(() => {
        if (tiempoDuracion >= 40) {
            console.log("Tiempo de resolución agotado: ", tiempoDuracion);
            // Enviar el formulario
            enviarForm(new Event('submit'));
            Swal.fire("Tiempo de resolución agotado", "", "warning");
            clearInterval(intervalRef.current);
        }
    }, [tiempoDuracion]);

    // Enviar los datos del formulario
    const enviarForm = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const datos__post = {
                slug__,
                respuestas,
                tiempoTranscurrido__minutos,
                tiempoTranscurrido__segundos
            };
            console.log("Datos a enviar");
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

    // Función para manejar el evento de soltar el color en la imagen
    const pintar = (e) => {
        e.preventDefault();
        const color_arrastre = e.dataTransfer.getData('color');
        // Verificar si color es el mismo del color obtenido de contenedor
        if (color_arrastre === color) {
            // Mostrar un gif
            Swal.fire("Correcto!", "", "success");
            // Cambiar la img
            imagenRef.current.src = url_c1;
        } else {
            //Swal.fire("Ese no es el color adecuado!", "", "info");
            Swal.fire({
                imageUrl: '/gif/Error-Respuesta.gif',
                imageHeight: 350,
                // tiempo de duracin
                timer: 1500, // 1.5 segundos
                imageAlt: 'A tall image'
            })
        }
    };

    // Evitar el comportamiento predeterminado de arrastrar y soltar
    const arrastrar = (e) => {
        e.preventDefault();
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
                <div className="contenedor__cuerpo_tipo5" id="miContainer" ref={miContainerRef}
                    style={{
                        pointerEvents: contenidoHabilitado ? 'auto' : 'none',
                        opacity: contenidoHabilitado ? 1 : 0.5
                    }}>
                    <div className="contenedor__cuerpo__division_t5">
                        <div className="alineacion__etiquetas d-flex">
                            <>
                                {descripcion__contenido && descripcion__contenido.length > 1 && descripcion__contenido[0] &&
                                    <span className={`mt-3 ${isActive ? 'span-2_' : 'span-2'}`} style={{ color: 'rgb(0, 146, 99)' }}>
                                        Indicación: {descripcion__contenido[0]}</span>
                                }
                            </>
                        </div>
                        {/* <!-- Contenido de url--> */}
                        <div className="contenedor__imagen_tipo5">
                            <div className="conten__tipo4 mt-4">
                                <div className="contenedor__colorear">
                                    <div
                                        className={`mt-1 mb-1 d-flex justify-content-center ${isActive ? 'imagen_tipo5_' : 'imagen_tipo5'}`}

                                    >
                                        <img src={url__contenido} alt="Imagen para colorear"
                                            ref={imagenRef}
                                            onDrop={pintar}
                                            onDragOver={arrastrar}
                                        />
                                    </div>
                                    <div className="alineacion__paleta">
                                        <ul
                                            className={`list-unstyled mt-3 ${isActive ? 'lista-paleta_' : 'lista-paleta'}`}
                                        >
                                            <li style={{ padding: '5px 0' }}>
                                                <div className="color-box" style={{ backgroundColor: 'red' }} draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('color', 'Rojo');
                                                    }}></div>
                                                <div className="color-box" style={{ backgroundColor: 'yellow' }} draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('color', 'Amarillo');
                                                    }}></div>
                                                <div className="color-box" style={{ backgroundColor: 'blue' }} draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('color', 'Azul');
                                                    }}></div>
                                                <div className="color-box" style={{ backgroundColor: 'green' }} draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('color', 'Verde');
                                                    }}></div>
                                                <div className="color-box" style={{ backgroundColor: 'brown' }} draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('color', 'Rojo bajo');
                                                    }}></div>
                                                <div className="color-box" style={{ backgroundColor: 'violet' }} draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('color', 'Violeta');
                                                    }}></div>
                                                <div className="color-box" style={{ backgroundColor: 'salmon' }} draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('color', 'Cobrizo');
                                                    }}></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card__cuerpo mt-2 d-flex justify-content-left ubi_refe_5">
                                    <span className="referencia-2">
                                        Actividad: Desarrollo de habilidades en niños
                                    </span>
                                </div>
                            </div>
                        </div>
                        <br />
                        {/* <!-- Contenido de url--> */}
                        <div >
                            <form onSubmit={enviarForm} className="formulario_acti_5">
                                <div className="ml-3 pl-3">
                                    <fieldset>
                                        <>
                                            {
                                                descripcion__contenido && descripcion__contenido.length > 1 &&
                                                descripcion__contenido[1].trim().startsWith("¿") &&
                                                descripcion__contenido.map((item, index) => {
                                                    if (index > 0) {
                                                        return (
                                                            <div className="d-flex flex-column justify-content-between" key={index}>
                                                                <div className="form-group row ml-2">
                                                                    <label htmlFor={`respuesta-${index}`}
                                                                        className="d-flex justify-content-center etiqueta col-sm-5 col-form-label"
                                                                    >
                                                                        {item}
                                                                    </label>
                                                                    <div className="col-sm-7 mt-2">
                                                                        <input autoComplete="off" type="text" className="form-control inp_acti_5"
                                                                            id={`respuesta-${index}`}
                                                                            name="respuesta" style={{ border: '1px solid #0C2342' }}
                                                                            onChange={(e) => handleInputChange(index - 1, e)} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </>
                                    </fieldset>
                                </div>
                                {/* Eñ input que se envia */}
                                <input type="hidden" id="slug" name="slug" value={slug__} onChange={e => setSlug(e.target.value)} />

                                <div className="d-flex flex-column justify-content-center align-items-center" >
                                    <button type="submit" className="btn btn-success tam_listo_5"
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