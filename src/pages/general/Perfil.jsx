// Estilos
//import "../../styles/Cabecera.css";
//import "../../styles/Nav.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister'
import { Tarjeta } from '../../components/general/TarjetaUsuario'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// Metodos
import { onPageLoad } from "../../controles/logout"
import { VerificarUsuario } from "../../api/usuario.api"
import { Navbar_Paci, Navbar_C, Navbar_T, Navbar_Defect } from "../../components/partes/NavbarPrueba"

export function Perfil_User() {
    // Pre loader
    const [loading, setLoading] = useState(true);
    onPageLoad();
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

    // Obtener datos
    const verificacion = async () => {
        if (!token) {
            navigate('/login');
        }
        // Flujo normal
        try {
            const cont = await VerificarUsuario();
            if (cont.data.error) {
                navigate('/login');
            } else {
                setTipo(cont.data);
                console.log(cont.data);
                setLoading(false);
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            }
        }
    }

    // Control estado de los datos
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
                <div className="almacenador ml-0 tamanio_almacenador_perfil">
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
                    {/* COMPONENTE SECTION */}
                    <SeccionPerfil activarSidebar={activarSidebar} tipoUsuario={tipoUsuario} />
                </div>
            </div>
            <PieRegister />
        </div>
    )
}

function SeccionPerfil({ activarSidebar, tipoUsuario }) {
    const colorGuardado = localStorage.getItem('color');
    return (
        <section className="section col-9 border-general section_almacenador_perfil" id="mysection" style={{ backgroundColor: colorGuardado }}>
            <div id="content">
                <button type="button" id="sidebarCollapse" onClick={activarSidebar}
                    className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                    title="Menú">
                    <i className="fas fa-align-left"></i>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {/* COMPONENTE DEL CUERPO */}
                <Tarjeta usuario={tipoUsuario} />
            </div>
        </section>
    )
}