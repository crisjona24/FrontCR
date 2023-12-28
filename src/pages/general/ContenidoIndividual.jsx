// Estilos
import "../../styles/Cabecera.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Nav.css";
import { onPageLoad } from "../../controles/logout";
import { Image } from "react-bootstrap";

// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
// Metodos
import { ContenidoCuerpo } from '../../components/contenido/Contenido_individual_cuerpo';
import { CargarContenido, ObtenerSlugContenido } from "../../api/contenidoindividual.api";

import { VerificarUsuario } from "../../api/usuario.api";
import { Navbar_Paci, Navbar_C, Navbar_T, Navbar_Defect } from "../../components/partes/NavbarPrueba";

export function ContenidoIndividual() {
    // Pre loader
    const [loading, setLoading] = useState(true);
    // Obtener el slug de contenido individual
    let { slug } = useParams();
    // Slug del contenido
    const [slugContenido, setSlugContenido] = useState("");
    // Flujo normal
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [contenidosI, setContenidos] = useState([]);
    const [tipoUsuario, setTipo] = useState([]);
    const token = localStorage.getItem('token');
    const [isActive, setIsActive] = useState(false);
    let navbar;
    // Controlador para el evento de clic
    const activarSidebar = () => {
        setIsActive(!isActive);
    };
    onPageLoad();

    // Cargar contenido individual
    const cargarContenidosI = async () => {
        if (!token) {
            navigate('/login');
        }
        try {
            const tipouser = await VerificarUsuario();
            if (tipouser.data.error) {
                navigate('/login');
            } else {
                setTipo(tipouser.data);
                const cont = await CargarContenido(slug);
                if (cont.data.errorNormal) {
                    mostrarError(cont.data.errorNormal)
                } else if (cont.data.errorSalida) {
                    navigate('/login');
                } else {
                    setContenidos(cont.data);
                    setLoading(false);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar contenidos');
            }
        }
    }

    const cargarSlugContenido = async () => {
        try {
            const slugConte = await ObtenerSlugContenido(slug);
            if (slugConte.data.success) {
                setSlugContenido(slugConte.data.slug_contenido);
            } else {
                if (slugConte.data.success === false) {
                    navigate('/login');
                } else {
                    mostrarError(slugConte.data.error);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar identificador de dominio');
            }
        }
    }

    // Cargar contenido individual
    useEffect(() => {
        cargarContenidosI();
        cargarSlugContenido();
    }, [slug])

    // Definir navbar
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

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

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
                    <>
                        {error &&
                            <div id="alert" className="alert alert-success" role="alert">
                                <h5 className="alert-heading">!Atención!</h5>
                                <p className="mb-0">{error}</p>
                            </div>
                        }
                        {/* Renderiza el componente almacenado en la variable contenidoComponente */}
                    </>
                    <SeccionContenido activarSidebar={activarSidebar} tipoUsuario={tipoUsuario} contenidosI={contenidosI} slugContenido={slugContenido} />
                </div>
            </div>
            <PieRegister />
        </div>

    )
}

function SeccionContenido({ activarSidebar, tipoUsuario, contenidosI, slugContenido }) {
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
                <ContenidoCuerpo context={contenidosI} slugContenido={slugContenido} tipoUsuarioP={tipoUsuario} />
            </div>
        </section>
    )
}