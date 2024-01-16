/* ****** COMPONENTE CONTENIDOS INDIVIDUALES *** */
// Estilos
//import "../../styles/Cabecera.css";
import "../../styles/Contenido_individual.css";
import "../../styles/Varios.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { faBackward, faQuestion, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
// Metodos
import { FormularioUno } from '../registro/Formulario_individual_1';
import { FormularioDos } from '../registro/Formulario_individual_2';
import { FormularioTres } from '../registro/Formulario_individual_3';
import { Formulariocuatro } from '../registro/Formulario_individual_4';
import { FormularioCinco } from '../registro/Formulario_individual_5';
import { FormularioSeis } from '../registro/Formulario_individual_6';
import { FormularioSiete } from '../registro/Formulario_individual_7';
import { FormularioNueve } from '../registro/Formulario_individual_9';
import { FormularioDiez } from '../registro/Formulario_individual_10';
import { FormularioDefault } from '../registro/Formulario_default';
import { VerificarUsuario } from "../../api/usuario.api";
import { ContenidoIndividualTodo } from "../../api/contenidoindividual.api";

export function ContenidoCuerpo({ context, isActive, slugContenido, tipoUsuarioP }) {
    // Valores recuperados de context
    const {
        nombre__contenido,
    } = context;
    console.log(context)
    // Verificacion de usuario
    const [tipoUsuario, setTipo] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    let tipoFormulario;
    let mensajeAyuda;
    // NUEVO
    const [contenidosI, setContenidos] = useState([]);
    const [slugSiguiente, setSlugSiguiente] = useState("");
    const [slugAnterior, setSlugAnterior] = useState("");
    let { slug2 } = useParams();
    let { slug } = useParams();

    // Verificar usuario
    const VerificarUser = async () => {
        try {
            const tipouser = await VerificarUsuario();
            if (tipouser.data.success) {
                setTipo(tipouser.data);
            } else {
                navigate('/login');
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError("Error al verificar usuario")
            }
        }
    }

    // Estado de los datos del usuario
    useEffect(() => {
        VerificarUser();
    }, []);

    // Verificar tipo de contenido
    if (context.tipo) {
        // Usamos case para los casos de contenido
        switch (context.tipo) {
            case 'selecion_individual':
                tipoFormulario = <FormularioUno context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo1 />;
                break;
            case "verdadero_falso":
                tipoFormulario = <FormularioDos context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo2 />;
                break;
            case "selecion_multiple":
                tipoFormulario = <FormularioTres context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo3 />;
                break;
            case "responder_preguntas":
                tipoFormulario = <Formulariocuatro context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo4 />;
                break;
            case "pintar_imagen":
                tipoFormulario = <FormularioCinco context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo5 />;
                break;
            case "seleccionar_imagen":
                tipoFormulario = <FormularioSeis context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo6 />;
                break;
            case "cuento":
                tipoFormulario = <FormularioSiete context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo7 />;
                break;
            case 'selecion_multiple_img':
                tipoFormulario = <FormularioNueve context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo8 />;
                break;
            case 'pictograma':
                tipoFormulario = <FormularioDiez context={context} usuario={tipoUsuario} slugContenido={slugContenido} isActive={isActive} />;
                mensajeAyuda = <ModalContenidoTipo6 />;
                break;
            default:
                tipoFormulario = <FormularioDefault />;
                break;
        }
    }

    // Obtener datos
    const cargarContenidosI = async () => {
        try {
            // Verificar tipo de paciente
            if (tipoUsuarioP.tipo === "paciente") {
                const cont = await ContenidoIndividualTodo(slug2);
                setContenidos(cont.data);
                console.log(cont.data);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al cargar contenidos');
            }
        }
    }

    // Buscar el slug siguiente y anterior
    const buscarSlug = () => {
        // Uso de maping para recorrer la lista de contenido consultada
        contenidosI.map((contenido, i) => {
            // Si el slug del contenido es igual al slug de la url en el momento
            if (contenido.slug_contenido_individual === slug) {
                // Si el indice es 0 o es el primer elemento, no hay anterior
                if (i === 0) {
                    setSlugAnterior("");
                    setSlugSiguiente(contenidosI[i + 1].slug_contenido_individual);
                    // Si el indice es el ultimo, no hay siguiente
                } else if (i === contenidosI.length - 1) {
                    setSlugAnterior(contenidosI[i - 1].slug_contenido_individual);
                    setSlugSiguiente("");
                    // Si no es ninguno de los anteriores, hay anterior y siguiente
                } else {
                    setSlugAnterior(contenidosI[i - 1].slug_contenido_individual);
                    setSlugSiguiente(contenidosI[i + 1].slug_contenido_individual);
                }
            }
        });
    }

    // Cargar contenidos completos
    useEffect(() => {
        cargarContenidosI();
    }, [context]);

    // Buscar slug
    useEffect(() => {
        if (contenidosI.length > 1) {
            buscarSlug();
        } else {
            setSlugAnterior("");
            setSlugSiguiente("");
        }
    }, [contenidosI]);

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <div className="cabeza container">
            <div className="container pt-2">
                <div className="row col-md-12">
                    <div className="titulo__cabecera p-1">
                        <Link to={`/contenido/individual/all/${slugContenido}/`} className="btn_operacion btn btn-success">
                            <FontAwesomeIcon icon={faBackward} />
                        </Link>
                        <h2 className="display-6">
                            {nombre__contenido}
                        </h2>
                    </div>
                </div>
                <div className="row col-md-12">
                    <div className="titulo__ayuda">
                        {mensajeAyuda}
                    </div>
                </div>
                <div className="almacen__subtitulo row col-md-12 m-1">
                    <div className="subtitulo">
                        <h4 className="display-7">
                            {nombre__contenido}
                        </h4>
                    </div>
                </div>
                <div className="almacen__niveles row col-md-12">
                    <div className="contenedor__niveles mt-4 mb-4">
                    </div>
                </div>
                {/* Mostramos el error el error */}
                {
                    error &&
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                }
                {/* Componente formulario */}
                {tipoFormulario}
                {/* Fin componente formulario */}

                <div className="row col-md-12 mt-4 mb-2">
                    <>
                        {
                            tipoUsuario.tipo === "paciente" &&
                            <div className="bajo__cuerpo">
                                <div className="mt-1 mb-2">
                                    {
                                        slugAnterior !== "" &&
                                        <Link to={`/individual/${slugAnterior}/${slug2}/`} className="boton__regreso btn btn-success">
                                            <FontAwesomeIcon title="Anteior"
                                                icon={faArrowLeft} />
                                        </Link>
                                    }
                                </div>
                                <div className="mt-1 mb-2">
                                    {
                                        slugSiguiente !== "" &&
                                        <Link to={`/individual/${slugSiguiente}/${slug2}/`} className="boton__regreso btn btn-success">
                                            <FontAwesomeIcon title="Siguiente"
                                                icon={faArrowRight} />
                                        </Link>
                                    }

                                </div>
                            </div>
                        }
                    </>
                </div>
            </div>
        </div>
    )

}


// Creamos los modales de información para cada tipo de contenido
// Modal de información para contenido de tipo 1
export function ModalContenidoTipo1() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes seleccionar <strong><u>una sola respuesta</u> </strong>
                            de acuerdo a la indicación para resolver la actividad del docente.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

// Modal de información para contenido de tipo 2
export function ModalContenidoTipo2() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes seleccionar <strong><u>verdadero o falso</u> </strong>
                            según creas conveniente, de acuerdo a la indicación para resolver
                            la actividad del docente.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// Modal de información para contenido de tipo 3
export function ModalContenidoTipo3() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes seleccionar <strong><u>diferentes respuestas</u> </strong>
                            según creas conveniente, de acuerdo a la indicación para resolver
                            la actividad del docente.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// Modal de información para contenido de tipo 4
export function ModalContenidoTipo4() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes <strong><u>responder a las preguntas</u> </strong>mostradas
                            de acuerdo a la indicación para resolver la actividad.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// Modal de información para contenido de tipo 5
export function ModalContenidoTipo5() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes seleccionar el <strong><u>color adecuado</u> </strong>
                            de acuerdo a la indicación para resolver la actividad.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// Modal de información para contenido de tipo 6
export function ModalContenidoTipo6() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes mover las <strong><u>imágenes</u> </strong>
                            hasta formar una figura de acuerdo a la indicación para resolver la actividad.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// Modal de información para contenido de tipo 7
export function ModalContenidoTipo7() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes leer el <strong><u>cuento</u> </strong> y responder las
                            <strong><u>interrogantes</u> </strong>
                            de acuerdo a la indicación para resolver la actividad.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// Modal de información para contenido de tipo 8
export function ModalContenidoTipo8() {
    // Variables de abrir y cerrar modal
    const [verModal, setVerModal] = useState(false);
    const abrirModal = () => setVerModal(true);
    const cerrarModal = () => setVerModal(false);

    return (
        <>
            <Button variant="sucess" onClick={abrirModal}>
                <span className="p-2">Necesitas ayuda</span>
                <FontAwesomeIcon title="Ayuda" className="boton__regreso btn btn-success" icon={faQuestion} />
            </Button>

            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Indicación para contenido</Modal.Title>
                </Modal.Header>
                {/* Contenido del modal */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Parte izquierda (GIF) */}
                    <div style={{ flex: '1', width: '25%', marginRight: '5px', marginLeft: '5px' }}>
                        {/* Insertar tu gif animado */}
                        <img
                            src="/gif/NNJugando.gif"
                            alt="GIF animado"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    {/* Parte derecha (Texto) */}
                    <div style={{ flex: '3', width: '75%', marginRight: '10px', marginLeft: '5px' }}>
                        <p style={{ fontSize: '1.1rem', textAlign: 'justify', color: '#333', marginTop: '10px' }}>
                            Debes seleccionar la <strong><u>imagen</u> </strong>
                            apropiada de acuerdo a la indicación para resolver la actividad.
                            LLama a tu docente si tienes dudas.
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="success" onClick={cerrarModal}>
                        Entenidido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}