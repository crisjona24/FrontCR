import React, { useState, useEffect } from 'react';
import "../../styles/Cabecera.css";
//import "../../styles/Nav.css";
//import "../../styles/Nav.css";
import "bootstrap/dist/css/bootstrap.min.css"
import { Button, Modal } from 'react-bootstrap';
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import {
    faAdjust, faGear, faMessage, faUser, faHome, faBell, faCamera, faPenNib,
    faPen, faBook, faPenToSquare, faBrush, faFile, faSnowman
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
// Metodos
import { LogoutNew } from './Logout'
import { cambiarColorFondo } from "../../controles/alert_user";
import { VerificarInscripcion } from "../../api/curso.api";
import {
    ContadorPeticiones, ReinicioContador,
    ContadorPeticionesAtendidas, ReinicioContadorAtendidas
} from "../../api/peticion.api";
import { ContadorSalas, ReinicioContadorSalas, ContadorSalasAtendida, ReinicioContadorSalasAtendidas } from "../../api/sala.api"


// Funciones
const dirigir_link = (link) => {
    // SweetAlert de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se dirigirá a la ventana con la actividad recreativa.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, abrir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(link, '_blank');
        }
    });
};

// Links externos
const link1 = 'https://www.google.com/search?q=jugar%20Snake&si=ALGXSlbfutuq-B7BDdtCoU16ZfJf1pvrrqddg7N879mALvyHU4dI3JFCCv11PMeNWuFSCwb9hhE40ud2ZNshBsTGyN6UxQiNmg==&biw=1366&bih=661&dpr=1';
const link2 = 'https://www.google.com/search?q=jugar%20al%20Buscaminas&si=ALGXSla9Qn5W_3r_le6kQWJ-JKIvIkBIJyQpXpFzjsQiZftc8UWjTEIiaO9FpENHQQJdaQfaTasKJHxYP1U_XNUNqFlbmRihuA==&biw=1366&bih=661&dpr=1';
const link3 = 'https://www.google.com/search?q=jugar%20al%20tres%20en%20l%C3%ADnea&si=ALGXSlYKHzbKbIXVuk-0ZWg8AxGUMl39jrKUFLgN1AOsbeyA-nrrVnFtExjWCstDTFyjnmC0Rcp9_nUul2hKCNjCLKIoeacRoA==&biw=1366&bih=661&dpr=1';
const link4 = 'https://www.google.com/search?q=juego%20de%20memoria%20de%20google&si=ALGXSlbaetklG3NTT4FgTpz45gwrnLS9HPCZ-n_Z2oOQK2i7TSUsq_UZ3iFbVoKyJKkDUBwmTaPIHjTNH7lT4ezknn7IeHcq2g==&biw=1366&bih=661&dpr=1';

// Navbar de Tecnico
export function Navbar_T() {
    const navigate = useNavigate();
    // Menu
    const [expandedMenu, setExpandedMenu] = useState(null);
    const toggleMenu = (menuName) => {
        if (expandedMenu === menuName) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(menuName);
        }
    };

    // Use Effect
    const [contador, setContador] = useState(0);
    const [verModal, setVerModal] = useState(false);
    const token = localStorage.getItem('token');

    // Verificar usuario
    const verificacion = async () => {
        try {
            const cont = await ContadorPeticiones();
            if (cont.data.contador) {
                setContador(cont.data);
            } else {
                if (cont.data.error) {
                    Swal.fire(cont.data.error, "", "error")
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Datos
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        verificacion();
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            verificacion();
        }, 300000); // 5 minutos
        return () => clearInterval(interval);
    }, []);

    // Reseteo de contador
    const reseteo = async () => {
        try {
            if (contador.contador > 0) {
                setVerModal(true);
                const response = await ReinicioContador();
                if (response.data.error) {
                    Swal.fire("Error al resetear el contador", "", "warning");
                }
            }
        } catch (error) {
            Swal.fire("Error al resetear el contador", "", "warning");
        }
    };

    // Modal
    const cerrarModal = () => {
        setVerModal(false);
    };

    // funcion de cierre
    const botonCerrar = () => {
        cerrarModal();
        setContador(0);
    }

    return (
        <nav id="sidebar__">
            <ul className="list-unstyled components">
                <li className="active">
                    <Link to={'/nivel/all'}><FontAwesomeIcon icon={faHome} style={{ marginRight: '4%' }} />Inicio</Link>
                </li>
                <li>
                    <Link to={'/perfil'}><FontAwesomeIcon icon={faUser} style={{ marginRight: '4%' }} />Perfil</Link>
                </li>
                <li>
                    <a href="#peticion" data-toggle="collapse" aria-expanded={expandedMenu === 'peticion'}
                        className="dropdown-toggle" onClick={() => toggleMenu('peticion')}>
                        <FontAwesomeIcon icon={faPenNib} style={{ marginRight: '4%' }} /> Peticiones</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'peticion' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/peticion/all'} className='text__'>Pendientes</Link>
                        </li>
                        <li>
                            <Link to={'/peticion/all/atendida'} className='text__'>Atendidas</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#niveles" data-toggle="collapse" aria-expanded={expandedMenu === 'niveles'}
                        className="dropdown-toggle" onClick={() => toggleMenu('niveles')}>
                        <FontAwesomeIcon icon={faPen} style={{ marginRight: '4%' }} /> Nivel TDAH</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'niveles' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/nivel/registro'} className='text__'>Agregar</Link>
                        </li>
                        <li>
                            <Link to={'/nivel/all'} className='text__'>Listado</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to={'/cursos/all'}><FontAwesomeIcon icon={faBook} style={{ marginRight: '4%' }} />Cursos</Link>
                </li>
                <li>
                    <Link to={'/sala/all'}><FontAwesomeIcon icon={faAdjust} style={{ marginRight: '4%' }} />Salas</Link>
                </li>
                <li>
                    <Link to={'/reporte/all'}><FontAwesomeIcon icon={faFile} style={{ marginRight: '4%' }} />Reportes</Link>
                </li>
                <li>
                    <a href="#dominios" data-toggle="collapse" aria-expanded={expandedMenu === 'dominios'}
                        className="dropdown-toggle" onClick={() => toggleMenu('dominios')}
                    ><FontAwesomeIcon icon={faPen} style={{ marginRight: '4%' }} />Dominio</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'dominios' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/dominio/registro'} className='text__'>Agregar</Link>
                        </li>
                        <li>
                            <Link to={'/dominio/all'} className='text__'>Listado</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to={'/resultado/all'} title='Resultados'> <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: '4%' }} />Resultados</Link>
                </li>
                <li>
                    <Link to={'/registro/contacto'} title='Contacto'> <FontAwesomeIcon icon={faMessage} style={{ marginRight: '4%' }} />Contacto</Link>
                </li>
                <hr />
                <li>
                    <>
                        <Button
                            onClick={reseteo}
                            className={`w-100 ${contador.contador > 0 ? 'boton-parpadeo' : ''}`}
                            style={{ textAlign: 'left', background: '#fff', border: '#fff', color: '#333' }}
                        >
                            <FontAwesomeIcon icon={faBell} style={{ marginRight: '4%' }} />
                            {contador.contador > 0 && contador.contador} Notificaciones
                        </Button>
                        {
                            contador.contador > 0 &&
                            <Modal show={verModal} onHide={cerrarModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Notificación</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Tiene {contador.contador} peticiones nuevas, acceda al listado de peticiones pendientes.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={botonCerrar}>
                                        Entendido
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </>
                </li>
                <hr />
                <li>
                    <a href="#opciones" data-toggle="collapse" aria-expanded={expandedMenu === 'opciones'}
                        className="dropdown-toggle" onClick={() => toggleMenu('opciones')}
                    ><FontAwesomeIcon icon={faGear} style={{ marginRight: '4%' }} />Opciones</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'opciones' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <LogoutNew />
                        </li>
                    </ul>
                </li>
            </ul>

            <ul className="list-unstyled CTAs">
                <li>
                    <a className="download">WAPIPTDAH</a>
                </li>
                <li>
                    <Link to="/ver/datos" className="article">Conocenos</Link>
                </li>
            </ul>
        </nav>

    )
}


// Navbar de Comun
export function Navbar_C() {
    const navigate = useNavigate();

    // Menu
    const [expandedMenu, setExpandedMenu] = useState(null);
    const toggleMenu = (menuName) => {
        if (expandedMenu === menuName) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(menuName);
        }
    };

    // Use Effect
    const [contadorAtendidas, setContador] = useState(0);
    const [verModal, setVermodal] = useState(false);
    const [contadorSaAtendidas, setContadorSaAtendidas] = useState(0);
    const [verModal2, setVerModal2] = useState(false);
    const [activo1, setActivo1] = useState(false);
    const [activo2, setActivo2] = useState(false);

    // Verificacion de contador para peticiones atendidas
    const verificacionAtendidas = async () => {
        // Flujo normal
        try {
            const cont = await ContadorPeticionesAtendidas();
            setContador(cont.data);
            if (cont.data.contador > 0) {
                setActivo1(true);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Verificacion de contador para salas atendidas
    const verificacionSalasAtendidas = async () => {
        // Flujo normal
        try {
            const contSa = await ContadorSalasAtendida();
            setContadorSaAtendidas(contSa.data);
            if (contSa.data.contador > 0) {
                setActivo2(true);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Verificacion de peticiones que han sido atendidas atendidas
    useEffect(() => {
        verificacionAtendidas();
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            verificacionAtendidas();
        }, 300000); // 5 minutos
        return () => clearInterval(interval);
    }, []);

    // Verificacion de salas que han sido atendidas 
    useEffect(() => {
        if (!activo1) {
            verificacionSalasAtendidas();
            //Controla el tiempo de actualizacion de la pagina
            const interval = setInterval(() => {
                verificacionSalasAtendidas();
                // 6 minutos
            }, 360000);
            return () => clearInterval(interval);
        }
    }, [activo1]);

    // Reseteo de contador de peticiones atendidas
    const reseteoSAtendidas = async () => {
        try {
            if (contadorSaAtendidas.contador > 0) {
                setVerModal2(true);
                setActivo2(false);
                await ReinicioContadorSalasAtendidas();
            }
        } catch (error) {
            Swal.fire("Error al resetear el contador salas atendidas", "", "warning");
        }
    };

    // Reseteo de contador de peticiones atendidas
    const reseteoPAtendidas = async () => {
        try {
            if (contadorAtendidas.contador > 0) {
                setVermodal(true);
                setActivo1(false);
                await ReinicioContadorAtendidas();
            }
        } catch (error) {
            Swal.fire("Error al resetear el contador de peticiones", "", "warning");
        }
    };

    // Modal
    const cerrarModal = () => {
        setVermodal(false);
    };

    // funcion de cierre
    const botonCerrarModal1 = () => {
        cerrarModal();
        setContador(0);
    }

    // Modal
    const cerrarModal2 = () => {
        setVerModal2(false);
    };

    // funcion de cierre
    const botonCerrarModal2 = () => {
        cerrarModal2();
        setContadorSaAtendidas(0);
    }


    return (
        <nav id="sidebar__">
            <ul className="list-unstyled components">
                <li className="active">
                    <Link to={'/nivel/all'}><FontAwesomeIcon icon={faHome} style={{ marginRight: '4%' }} />Inicio</Link>
                </li>
                <li>
                    <Link to={'/perfil'}><FontAwesomeIcon icon={faUser} style={{ marginRight: '4%' }} />Perfil</Link>
                </li>
                <li>
                    <Link to={'/peticion/all/usuario'} title='Peticiones'>
                        <FontAwesomeIcon icon={faPenNib} style={{ marginRight: '4%' }} />
                        Peticiones
                    </Link>
                    
                </li>
                <li>
                    <a href="#salas" data-toggle="collapse" aria-expanded={expandedMenu === 'salas'}
                        className="dropdown-toggle" onClick={() => toggleMenu('salas')}>
                        <FontAwesomeIcon icon={faCamera} style={{ marginRight: '4%' }} /> Sala </a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'salas' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/sala/all'} className='text__'>Listado Pendientes</Link>
                        </li>
                        <li>
                            <Link to={'/sala/atendida/all'} className='text__'>Listado Atendidas</Link>
                        </li>
                        <li>
                            <Link to={'/sala/registro'} className='text__'>Agregar</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#dominios" data-toggle="collapse" aria-expanded={expandedMenu === 'dominios'}
                        className="dropdown-toggle" onClick={() => toggleMenu('dominios')}
                    ><FontAwesomeIcon icon={faPen} style={{ marginRight: '4%' }} />Dominio</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'dominios' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/dominio/all'} className='text__'>Listado</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#curso" data-toggle="collapse" aria-expanded={expandedMenu === 'curso'}
                        className="dropdown-toggle" onClick={() => toggleMenu('curso')}
                    ><FontAwesomeIcon icon={faBook} style={{ marginRight: '4%' }} />Cursos</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'curso' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/curso/registro'} className='text__'>Agregar</Link>
                        </li>
                        <li>
                            <Link to={'/cursos/all'} className='text__'>Listado</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to={'/resultado/all'} title='Resultados'> <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: '4%' }} />Resultados</Link>
                </li>
                <li>
                    <Link to={'/reporte/all'}><FontAwesomeIcon icon={faFile} style={{ marginRight: '4%' }} />Reportes</Link>
                </li>
                <li>
                    <Link to={'/registro/contacto'} title='Contacto'> <FontAwesomeIcon icon={faMessage} style={{ marginRight: '4%' }} />Contacto</Link>
                </li>
                <hr />
                <li>
                    <>
                        <Button
                            onClick={
                                contadorAtendidas.contador > 0
                                    ? reseteoPAtendidas
                                    : contadorSaAtendidas.contador > 0
                                        ? reseteoSAtendidas
                                        : () => { } // Esto es para evitar una función vacía
                            }
                            className={`w-100 ${contadorAtendidas.contador > 0 || contadorSaAtendidas.contador > 0 ? 'boton-parpadeo' : ''}`}
                            style={{ textAlign: 'left', background: '#fff', border: '#fff', color: '#333' }}
                        >
                            <FontAwesomeIcon icon={faBell} style={{ marginRight: '4%' }} />
                            {contadorAtendidas.contador > 0 || contadorSaAtendidas.contador > 0} Notificaciones
                        </Button>
                        {
                            contadorAtendidas.contador > 0 &&
                            <Modal show={verModal} onHide={cerrarModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Notificación</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Tiene {contadorAtendidas.contador} peticiones atendidas, acceda a su listado de peticiones.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={botonCerrarModal1} >
                                        Entendido
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        {
                            contadorSaAtendidas.contador > 0 &&
                            <Modal show={verModal2} onHide={cerrarModal2}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Notificación</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Una o varia de las salas creadas ha sido atendida, acceda a su listado de salas.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={botonCerrarModal2} >
                                        Entendido
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </>
                </li>
                <hr />
                <li>
                    <a href="#opciones" data-toggle="collapse" aria-expanded={expandedMenu === 'opciones'}
                        className="dropdown-toggle" onClick={() => toggleMenu('opciones')}
                    ><FontAwesomeIcon icon={faAdjust} style={{ marginRight: '4%' }} />Opciones</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'opciones' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <LogoutNew />
                        </li>
                    </ul>
                </li>
            </ul>

            <ul className="list-unstyled CTAs">
                <li>
                    <a className="download">WAPIPTDAH</a>
                </li>
                <li>
                    <Link to="/ver/datos" className="article">Conocenos</Link>
                </li>
            </ul>
        </nav>

    )
}


// Navbar de Paciente
export function Navbar_Paci() {

    // General
    const navigate = useNavigate();
    const [verificacion, setVerificacion] = useState([]);
    const [expandedMenu, setExpandedMenu] = useState(null);
    const token = localStorage.getItem('token');
    const toggleMenu = (menuName) => {
        if (expandedMenu === menuName) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(menuName);
        }
    };

    // Contador
    const [contador, setContador] = useState(0);
    const [verModal, setVerModal] = useState(false);

    // Verificar inscripcion de estudiante en curso 
    const verificar = async () => {
        try {
            // Verificar si esta inscrito
            const cont = await VerificarInscripcion();
            if (cont.data.success) {
                setVerificacion(cont.data);
            } else {
                if (cont.data.error) {
                    Swal.fire(cont.data.error, "", "error")
                } else if (cont.data.errorSalida) {
                    Swal.fire(cont.data.errorSalida, "", "error")
                    navigate('/login');
                } else {
                    Swal.fire("Error", "No se pudo verificar la inscripción", "error");
                }
            }

        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Verifiar contador de salas nuevas para estudiante
    const verificar_contador = async () => {
        try {
            // Contador de salas
            const contSalas = await ContadorSalas();
            setContador(contSalas.data);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Datos de inscripcion: Verificacion
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        verificar();
    }, []);

    // Verificacion de contador de salas
    useEffect(() => {
        if (verificacion.inscrito === "1") {
            verificar_contador();
            //Controla el tiempo de actualizacion de la pagina
            const interval = setInterval(() => {
                verificar_contador();
            }, 300000); // 5 minutos
            return () => clearInterval(interval);
        }
    }, [verificacion]);

    // Reseteo de contador
    const reseteo = async () => {
        try {
            if (contador.contador > 0) {
                setVerModal(true);
                await ReinicioContadorSalas();
            }
        } catch (err) {
            Swal.fire("Error al resetear el contador", "", "warning");
        }
    };

    // Modal
    const cerrarModal = () => {
        setVerModal(false);
    };

    // funcion de cierre
    const bontonCerrar = () => {
        cerrarModal();
        setContador(0);
    }

    return (
        <nav id="sidebar__">
            <ul className="list-unstyled components">
                <>
                    {
                        verificacion.inscrito === "1" &&
                        <li className="active">
                            <Link to={'/nivel/all'}><FontAwesomeIcon icon={faHome} style={{ marginRight: '4%' }} />Inicio</Link>
                        </li>
                    }
                    {
                        verificacion.inscrito === "1" &&
                        <li>
                            <Link to={'/perfil'}><FontAwesomeIcon icon={faUser} style={{ marginRight: '4%' }} />Perfil</Link>
                        </li>
                    }
                    {
                        verificacion.inscrito === "1" &&
                        <li>
                            <Link to={'/sala/paciente/all'}><FontAwesomeIcon icon={faPenNib} style={{ marginRight: '4%' }} />Salas</Link>
                        </li>
                    }
                    {

                        verificacion.inscrito === "0" &&
                        <li>
                            <a href="#cursos" data-toggle="collapse" aria-expanded={expandedMenu === 'cursos'}
                                className="dropdown-toggle" onClick={() => toggleMenu('cursos')}
                            ><FontAwesomeIcon icon={faBook} style={{ marginRight: '4%' }} />Cursos</a>
                            <ul className={`collapse list-unstyled ${expandedMenu === 'cursos' ? 'show' : ''}`} id="pageSubmenu">
                                <li>
                                    <Link to={'/cursos/all'} className='text__'>Listado</Link>
                                </li>
                            </ul>
                        </li>
                    }
                </>
                <li>
                    <a href="#fondo" data-toggle="collapse" aria-expanded={expandedMenu === 'fondo'}
                        className="dropdown-toggle" onClick={() => toggleMenu('fondo')}
                    ><FontAwesomeIcon icon={faBrush} style={{ marginRight: '4%' }} />Fondo</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'fondo' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <select id="colorSelect" className="form-select" onChange={cambiarColorFondo}>
                                <option value="#D9DBF1">Base</option>
                                <option value="#F9D0D0">Crema</option>
                                <option value="#7F92B2">Azul</option>
                                <option value="#A2D9CE">Verde</option>
                                <option value="#FFDF79">Amarillo</option>
                                <option value="#ABB2B9">Oscuro</option>
                                <option value="#E8DAEF">Violeta</option>
                            </select>
                        </li>
                    </ul>
                </li>
                {
                    verificacion.inscrito === "1" &&
                    <li>
                        <a href="#juego" data-toggle="collapse" aria-expanded={expandedMenu === 'juego'}
                            className="dropdown-toggle" onClick={() => toggleMenu('juego')}
                        ><FontAwesomeIcon icon={faSnowman} style={{ marginRight: '4%' }} />Juegos</a>
                        <ul className={`collapse list-unstyled ${expandedMenu === 'juego' ? 'show' : ''}`} id="pageSubmenu">
                            <li>
                                <a href="#" onClick={() => dirigir_link(link1)} className='text__'>La culebrita</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => dirigir_link(link2)} className='text__'>Buscaminas</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => dirigir_link(link3)} className='text__'>Tres en raya</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => dirigir_link(link4)} className='text__'>Juego de memoria</a>
                            </li>
                        </ul>
                    </li>
                }
                <li>
                    <Link to={'/registro/contacto'} title='Contacto'> <FontAwesomeIcon icon={faMessage} style={{ marginRight: '4%' }} />Contacto</Link>
                </li>
                <hr />
                <li>
                    <>
                        <Button
                            onClick={reseteo}
                            className={`w-100 ${contador.contador > 0 ? 'boton-parpadeo' : ''}`}
                            style={{ textAlign: 'left', background: '#fff', border: '#fff', color: '#333' }}
                        >
                            <FontAwesomeIcon icon={faBell} style={{ marginRight: '4%' }} />
                            {contador.contador > 0 && contador.contador} Notificaciones
                        </Button>
                        {
                            contador.contador > 0 &&
                            <Modal show={verModal} onHide={cerrarModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Notificación</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Tiene un total de {contador.contador} salas nuevas, acceda al listado de salas.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={bontonCerrar}>
                                        Entendido
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </>
                </li>
                <hr />
                <li>
                    <a href="#opciones" data-toggle="collapse" aria-expanded={expandedMenu === 'opciones'}
                        className="dropdown-toggle" onClick={() => toggleMenu('opciones')}
                    ><FontAwesomeIcon icon={faGear} style={{ marginRight: '4%' }} />Opciones</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'opciones' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <LogoutNew />
                        </li>
                    </ul>
                </li>
            </ul>

            <ul className="list-unstyled CTAs">
                <li>
                    <a className="download">WAPIPTDAH</a>
                </li>
                <li>
                    <Link to="/ver/datos" className="article">Conocenos</Link>
                </li>
            </ul>
        </nav>

    )
}


// Navbar Defecto
export function Navbar_Defect() {
    const [expandedMenu, setExpandedMenu] = useState(null);
    const toggleMenu = (menuName) => {
        if (expandedMenu === menuName) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(menuName);
        }
    };

    return (
        <nav id="sidebar__">
            <ul className="list-unstyled components">
                <li>
                    <a href="#niveles" data-toggle="collapse" aria-expanded={expandedMenu === 'niveles'}
                        className="dropdown-toggle" onClick={() => toggleMenu('niveles')}>
                        <FontAwesomeIcon icon={faPen} style={{ marginRight: '4%' }} /> Nivel TDAH</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'niveles' ? 'show' : ''}`} id="dominios">
                        <li>
                            <Link to={'/nivel/all'} className='text__'>Listado</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#dominios" data-toggle="collapse" aria-expanded={expandedMenu === 'dominios'}
                        className="dropdown-toggle" onClick={() => toggleMenu('dominios')}
                    ><FontAwesomeIcon icon={faPen} style={{ marginRight: '4%' }} />Dominio</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'dominios' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/dominio/all'} className='text__'>Listado</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#curso" data-toggle="collapse" aria-expanded={expandedMenu === 'curso'}
                        className="dropdown-toggle" onClick={() => toggleMenu('curso')}
                    ><FontAwesomeIcon icon={faBook} style={{ marginRight: '4%' }} />Cursos</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'curso' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <Link to={'/cursos/all'} className='text__'>Listado</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to={'/registro/contacto'} title='Contacto'> <FontAwesomeIcon icon={faMessage} style={{ marginRight: '4%' }} />Contacto</Link>
                </li>
                <hr />
                <li>
                    <a href="#opciones" data-toggle="collapse" aria-expanded={expandedMenu === 'opciones'}
                        className="dropdown-toggle" onClick={() => toggleMenu('opciones')}
                    ><FontAwesomeIcon icon={faGear} style={{ marginRight: '4%' }} />Opciones</a>
                    <ul className={`collapse list-unstyled ${expandedMenu === 'opciones' ? 'show' : ''}`} id="pageSubmenu">
                        <li>
                            <LogoutNew />
                        </li>
                    </ul>
                </li>
            </ul>

            <ul className="list-unstyled CTAs">
                <li>
                    <a className="download">WAPIPTDAH</a>
                </li>
                <li>
                    <Link to="/ver/datos" className="article">Conocenos</Link>
                </li>
            </ul>
        </nav>

    )
}