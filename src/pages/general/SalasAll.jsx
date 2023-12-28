// Estilos
//import "../../styles/Cabecera.css";
//import "../../styles/Nav.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image } from "react-bootstrap";

// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// Metodos
import { Navbar_Paci, Navbar_C, Navbar_T, Navbar_Defect } from "../../components/partes/NavbarPrueba";
import { onPageLoad } from "../../controles/logout";
import { VerificarUsuario } from "../../api/usuario.api";
import { SalaLista, SalaPacienteLista, SalaListaAtendidas } from '../../components/listado/Listas';


// Lista de salas general
export function SalasALL() {
    // Pre loader
    const [loading, setLoading] = useState(true);

    // Establecer estado para saber si sidebar está activo
    const [isActive, setIsActive] = useState(false);
    // Controlador para el evento de clic
    const activarSidebar = () => {
        setIsActive(!isActive);
    };
    onPageLoad();

    /* *** Control de usuario *** */
    const [tipoUsuario, setTipo] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Funcion para verificar el tipo de usuario
    const verificacion = async () => {
        // Flujo normal
        try {
            const cont = await VerificarUsuario();
            if (cont.data.error) {
                navigate('/login');
            } else {
                setTipo(cont.data);
                setLoading(false);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Verificar el tipo de usuario
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
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
                    <section className="section col-9" id="mysection" style={{ border: '1px solid #ccc' }}>
                        <div id="content">
                            <button type="button" id="sidebarCollapse" onClick={activarSidebar}
                                className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                                title="Menú">
                                <i className="fas fa-align-left"></i>
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            {/* COMPONENTE DEL CUERPO */}
                            <SalaLista usuario={tipoUsuario} />
                        </div>
                    </section>
                </div>
            </div>
            <PieRegister />
        </div>
    )
}

// Lista de salas general
export function SalasAtendidasALL() {
    // Pre loader
    const [loading, setLoading] = useState(true);

    // Establecer estado para saber si sidebar está activo
    const [isActive, setIsActive] = useState(false);
    // Controlador para el evento de clic
    const activarSidebar = () => {
        setIsActive(!isActive);
    };
    onPageLoad();

    /* *** Control de usuario *** */
    const [tipoUsuario, setTipo] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Funcion para verificar el tipo de usuario
    const verificacion = async () => {
        // Flujo normal
        try {
            const cont = await VerificarUsuario();
            if (cont.data.error) {
                navigate('/login');
            } else {
                setTipo(cont.data);
                setLoading(false);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Verificar el tipo de usuario
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
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
                    <section className="section col-9" id="mysection" style={{ border: '1px solid #ccc' }}>
                        <div id="content">
                            <button type="button" id="sidebarCollapse" onClick={activarSidebar}
                                className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                                title="Menú">
                                <i className="fas fa-align-left"></i>
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            {/* COMPONENTE DEL CUERPO */}
                            <SalaListaAtendidas usuario={tipoUsuario} />
                        </div>
                    </section>
                </div>
            </div>
            <PieRegister />
        </div>
    )
}

// Lista de salas de paciente
export function SalasPaciente() {
    // Pre loader
    const [loading, setLoading] = useState(true);

    // Establecer estado para saber si sidebar está activo
    const [isActive, setIsActive] = useState(false);
    // Controlador para el evento de clic
    const activarSidebar = () => {
        setIsActive(!isActive);
    };
    onPageLoad();

    /* *** Control de usuario *** */
    const [tipoUsuario, setTipo] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Funcion para verificar el tipo de usuario
    const verificacion = async () => {

        // Flujo normal
        try {
            const cont = await VerificarUsuario();
            if (cont.data.error) {
                navigate('/login');
            } else {
                setTipo(cont.data);
                setLoading(false);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Verificar el tipo de usuario
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
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
                    <SeccionSalaPaciente activarSidebar={activarSidebar} />
                </div>
            </div>
            <PieRegister />
        </div>
    )
}

function SeccionSalaPaciente({ activarSidebar }) {
    const colorGuardado = localStorage.getItem('color');
    return (
        <section className="section col-9 border-general" id="mysection" style={{ backgroundColor: colorGuardado }}>
            <div id="content">
                <button type="button" id="sidebarCollapse" onClick={activarSidebar}
                    className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                    title="Menú">
                    <i className="fas fa-align-left"></i>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {/* COMPONENTE DEL CUERPO */}
                <SalaPacienteLista />
            </div>
        </section>
    )
}

