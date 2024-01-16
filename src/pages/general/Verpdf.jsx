// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
//import "../../styles/Cabecera.css";
//import "../../styles/Nav.css";
import { Image } from "react-bootstrap";

// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
// Metodos
import { onPageLoad } from "../../controles/logout";
import { PdfViewer } from '../../components/general/Descarga';
import { TarjetaPeticion } from '../../components/general/TarjetaDatos';
import { VerificarUsuario, EjecutarJuego_1 } from "../../api/usuario.api";
import { Navbar_Paci, Navbar_C, Navbar_T, Navbar_Defect } from "../../components/partes/NavbarPrueba";

export function Ver() {
    // Pre loader
    const [loading, setLoading] = useState(true);

    // Establecer estado para saber si sidebar está activo
    const [isActive, setIsActive] = useState(false);
    // Controlador para el evento de clic
    const handleSidebarToggle = () => {
        setIsActive(!isActive);
    };
    onPageLoad();

    /* *** Control de usuario *** */
    const [tipoUsuario, setTipo] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Obtener datos
    async function verificacion() {
        if (!token) {
            navigate('/');
        }
        try {
            const cont = await VerificarUsuario();
            setTipo(cont.data);
            setLoading(false);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            }
        }
    }

    // Obtener datos
    useEffect(() => {
        verificacion();
    }, []);

    /* *** Control de usuario *** */
    let navbar;
    if (tipoUsuario) {
        switch (tipoUsuario.tipo) {
            case 'tecnico':
                navbar = <Navbar_T />;
                break;
            case 'paciente':
                navbar = <Navbar_Paci />;
                break;
            case 'comun':
                navbar = <Navbar_C />;
                break;
            default:
                navbar = <Navbar_Defect />;
                break;
        }
    }

    return (
        <div className="w-100 h-100">
            <CabeceraRegister />
            <div className="container-fluid p-0 m-0 w-100 h-100">
                <div className="almacenador ml-0">
                    <>
                        {loading ? (
                            <div className="preloader">
                                <Image src="/gif/loader.gif" fluid />
                            </div>
                        ) : (
                            <>
                                <aside id="sidebar" className={isActive ? 'active' : ''}>
                                    {/* COMPONENTE NAVBAR */}
                                    {navbar}
                                </aside>
                            </>
                        )}
                    </>
                    <section className="section col-9" id="mysection" style={{ border: '1px solid gray' }}>
                        <div id="content">
                            <button type="button" id="sidebarCollapse" onClick={handleSidebarToggle}
                                className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                                title="Menú">
                                <i className="fas fa-align-left"></i>
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            {/* COMPONENTE DEL CUERPO */}
                            <PdfViewer />
                        </div>
                    </section>
                </div>
            </div>
            <PieRegister />
        </div>
    )
}

// Ver información de petición
export function VerPeticion() {
    // Pre loader
    const [loading, setLoading] = useState(true);
    // Establecer estado para saber si sidebar está activo
    const [isActive, setIsActive] = useState(false);
    // Controlador para el evento de clic
    const activarSidebar = () => {
        setIsActive(!isActive);
    };

    /* *** Control de usuario *** */
    const [tipoUsuario, setTipo] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Obtener datos
    const verificacion = async () => {
        if (!token) {
            navigate('/login');
        } else {
            try {
                const cont = await VerificarUsuario();
                if (cont.data.success) {
                    setTipo(cont.data);
                    setLoading(false);
                } else {
                    if (cont.data.error) {
                        navigate('/login');
                    }
                }
            } catch (error) {
                if (error.message === "NOT_AUTHENTICATED") {
                    navigate('/login');
                }
            }
        }

    }
    onPageLoad();
    // Obtener datos
    useEffect(() => {
        verificacion();
    }, []);

    /* *** Control de usuario *** */
    let navbar;
    if (tipoUsuario) {
        switch (tipoUsuario.tipo) {
            case 'tecnico':
                navbar = <Navbar_T />;
                break;
            case 'paciente':
                navbar = <Navbar_Paci />;
                break;
            case 'comun':
                navbar = <Navbar_C />;
                break;
            default:
                navbar = <Navbar_Defect />;
                break;
        }
    }

    return (
        <div className="w-100 h-100">
            <CabeceraRegister />
            <div className="container-fluid p-0 m-0 w-100 h-100">
                <div className="almacenador ml-0 tamanio_almacenador_peti">
                    <>
                        {loading ? (
                            <div className="preloader">
                                <Image src="/gif/loader.gif" fluid />
                            </div>
                        ) : (
                            <>
                                <aside id="sidebar" className={isActive ? 'active' : ''}>
                                    {/* COMPONENTE NAVBAR */}
                                    {navbar}
                                </aside>
                            </>
                        )}
                    </>
                    <section className="section col-9" id="mysection" style={{ border: '1px solid #ccc' }}>
                        <div id="content">
                            <button type="button" id="sidebarCollapse" onClick={activarSidebar}
                                className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                                title="Menú">
                                <i className="fas fa-align-left"></i>
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            {/* COMPONENTE DEL CUERPO */}
                            <TarjetaPeticion isActive={isActive} />
                        </div>
                    </section>
                </div>
            </div>
            <PieRegister />
        </div>
    )
}

// Pantalla de ejecución de juego
export function Juego() {
    // Pre loader
    const [loading, setLoading] = useState(true);
    // Establecer estado para saber si sidebar está activo
    const [isActive, setIsActive] = useState(false);
    // Controlador para el evento de clic
    const activarSidebar = () => {
        setIsActive(!isActive);
    };

    /* *** Control de usuario *** */
    const [tipoUsuario, setTipo] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Obtener datos
    const verificacion = async () => {
        if (!token) {
            navigate('/login');
        } else {
            try {
                const cont = await VerificarUsuario();
                if (cont.data.success) {
                    setTipo(cont.data);
                    setLoading(false);
                } else {
                    if (cont.data.error) {
                        navigate('/login');
                    }
                }
            } catch (error) {
                if (error.message === "NOT_AUTHENTICATED") {
                    navigate('/login');
                }
            }
        }
    }

    // Ejecución de juego
    const ejecutar_juego = async () => {
        try {
            const jugar = await EjecutarJuego_1();
            if (jugar.data.success) {
                console.log("Jugando");
            } else {
                if (jugar.data.error) {
                    navigate('/login');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }
    onPageLoad();

    // Obtener datos
    useEffect(() => {
        verificacion();
    }, []);

    // Ejecución de juego
    useEffect(() => {
        ejecutar_juego();
    }, []);

    /* *** Control de usuario *** */
    let navbar;
    if (tipoUsuario) {
        switch (tipoUsuario.tipo) {
            case 'tecnico':
                navbar = <Navbar_T />;
                break;
            case 'paciente':
                navbar = <Navbar_Paci />;
                break;
            case 'comun':
                navbar = <Navbar_C />;
                break;
            default:
                navbar = <Navbar_Defect />;
                break;
        }
    }

    return (
        <div className="w-100 h-100">
            <CabeceraRegister />
            <div className="container-fluid p-0 m-0 w-100 h-100">
                <div className="almacenador ml-0">
                    <>
                        {loading ? (
                            <div className="preloader">
                                <Image src="/gif/loader.gif" fluid />
                            </div>
                        ) : (
                            <>
                                <aside id="sidebar" className={isActive ? 'active' : ''}>
                                    {/* COMPONENTE NAVBAR */}
                                    {navbar}
                                </aside>
                            </>
                        )}
                    </>
                    <section className="section col-9" id="mysection" style={{ border: '1px solid #ccc' }}>
                        <div id="content">
                            <button type="button" id="sidebarCollapse" onClick={activarSidebar}
                                className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                                title="Menú">
                                <i className="fas fa-align-left"></i>
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            {/* COMPONENTE DEL CUERPO */}
                            <div className="d-flex justify-content-center">
                                <h6 className="text-center">
                                    Jugando...
                                </h6>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <PieRegister />
        </div>
    )
}

