/* ****** COMPONENTE LISTA DE CONTENIDOS *** */
// Estilos
//import "../../styles/Cabecera.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Varios.css";
import { Row, Col } from "react-bootstrap"
// Componentes
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faPlus, faGear } from '@fortawesome/free-solid-svg-icons';
import { Button } from "react-bootstrap";
import Swal from 'sweetalert2';
// Metodos
import { IndividualListEspecifico, ObtenerSlugDominio } from "../../api/contenidoindividual.api";
import { IndividualListNombre } from "../../api/contenidoindividual.api";
import { NivelListado } from "../../api/grado.api";
//import { VerificarUsuario } from "../../api/usuario.api";

export function IndividualLista({ usuario, isActive }) {
    // Capturar slug de contenido
    let { slug } = useParams();
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [contenidosI, setContenidos] = useState([]);
    const token = localStorage.getItem('token');
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 6;
    // Slug del dominio
    const [slugDominio, setSlugDominio] = useState("");
    const [niveles, setniveles] = useState([]);
    const [nombre_nivel, setNombreNivel] = useState("none");

    // Obtener datos
    const cargarContenidosI = async () => {
        try {
            const cont = await IndividualListEspecifico(slug, page);
            setContenidos(cont.data.results);
            if (cont.data.results.length === 0) {
                setNumeropag(1);
            } else {
                setNumeropag(Math.ceil(cont.data.count / elementosPorPagina));
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al cargar contenidos');
            }
        }
    }

    // Cargar slug del dominio
    const cargarSlugDominio = async () => {
        try {
            const slugDomi = await ObtenerSlugDominio(slug);
            if (slugDomi.data.success) {
                setSlugDominio(slugDomi.data.slug_dominio);
            } else {
                if (slugDomi.data.success === false) {
                    navigate('/login');
                } else {
                    mostrarError(slugDomi.data.error);
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

    // Cargar nombres de nivel para el selección
    const cargarNombresNivel = async () => {
        try {
            // Obtenemos los datos de los niveles
            const niv = await NivelListado();
            setniveles(niv.data);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire('Error al cargar niveles', '', 'warning');
            }
        }
    }

    // Cargar actividades dependiendo del nombre del nivel
    const cargarContenidosINombre = async () => {
        try {
            const contIN = await IndividualListNombre(slug, nombre_nivel, page);
            setContenidos(contIN.data.results);
            if (contIN.data.results.length === 0) {
                setNumeropag(1);
            } else {
                setNumeropag(Math.ceil(contIN.data.count / elementosPorPagina));
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al cargar contenidos');
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (token) {
            if (nombre_nivel === "none") {
                cargarContenidosI();
            } else if (nombre_nivel) {
                cargarContenidosINombre();
            }
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (nombre_nivel === "none") {
                cargarContenidosI();
            } else if (nombre_nivel) {
                cargarContenidosINombre();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [slug, nombre_nivel, page])


    // Manejo del cargado de slug y nombres de nivel
    useEffect(() => {
        if (token) {
            cargarSlugDominio();
            cargarNombresNivel();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            cargarSlugDominio();
            cargarNombresNivel();
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [slug])

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Funciones de paginacion
    // Paginacion siguente
    const anterior = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    // Paginacion anterior
    const siguiente = () => {
        setPage(prevPage => (prevPage < numeroPag ? prevPage + 1 : prevPage));
    };

    return (
        <div>
            <div className="cabeza__">
                <div className="container">
                    <div className="row col-md-12">
                        <div className="col-md-2">
                            <Link to={`/contenido/all/${slugDominio}/`} className="btn_operacion btn mt-1">
                                <FontAwesomeIcon icon={faBackward} />
                            </Link>
                        </div>
                        <div className="col-md-9">
                            <h4 className="display-7 mt-2">
                                Actividades
                            </h4>
                        </div>
                        <div className="col-md-1">
                            <>
                                {
                                    usuario.tipo === 'tecnico' &&
                                    <Link to={`/contenido/individual/registro/${slug}/`} className="btn_operacion btn mt-1">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Link>
                                }
                                {usuario.tipo === 'comun' &&
                                    <Button title="Enviar una petición" className="btn_operacion btn mt-1"
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: "Registrar una petición para contenido individual",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, enviar'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    navigate('/peticion/registro');
                                                }
                                            })
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faGear} />
                                    </Button>
                                }
                            </>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-group mt-2">
                <Row>
                    <Col md={2} className="mt-2">
                        <label htmlFor="grado">Listado de nivel</label>
                    </Col>
                    <Col>
                        <select className="form-select w-25" id="grado"
                            name="grado" value={nombre_nivel} onChange={e => setNombreNivel(e.target.value)}>
                            <option value="none">Todos</option>
                            <>
                                {niveles.map((nivel) => (
                                    <option key={nivel.id} value={nivel.nombre_nivel}>
                                        {nivel.nombre_nivel}
                                    </option>
                                ))}
                            </>
                        </select>
                    </Col>
                </Row>

            </div>
            <div className="color container-fluid mt-3" >
                <div className="contenedor">
                    <div className="contenedor-division">
                        <>
                            {contenidosI.length === 0 &&
                                <p style={{ fontFamily: 'Pacific cursive', fontSize: '1.1rem', textAlign: 'left' }}>
                                    No hay actividades registradas
                                </p>
                            }
                            {error &&
                                <div id="alert" className="alert alert-success" role="alert">
                                    <h5 className="alert-heading">!Atención!</h5>
                                    <p className="mb-0">{error}</p>
                                </div>
                            }
                            {
                                contenidosI.map((contenido) => (
                                    <div className="card" key={contenido.id} style={{ backgroundImage: `url(${contenido.portada_individual})` }}>
                                        <div className="textos__ pt-1">
                                            <h3></h3>
                                            <div className="orden_lista_contenido">
                                                {
                                                    usuario.tipo !== 'paciente' &&
                                                    <div className="col-md-6 align-self-end">
                                                        <Link to={`/individual/detalle/${contenido.slug_contenido_individual}/${slug}/`}
                                                            className={`btn btn-success ${isActive ? 'titulo_cuerpo_lista_' : 'titulo_cuerpo_lista'}`}
                                                            title="Detalle de actividad">
                                                            Detalle
                                                        </Link>
                                                    </div>
                                                }
                                                <div
                                                    className={
                                                        usuario.tipo === 'paciente' ?
                                                            "col-md-6 justify-content-center" :
                                                            "col-md-6 align-self-end"
                                                    }>
                                                    <Link to={`/individual/${contenido.slug_contenido_individual}/${slug}/`}
                                                        className={`btn btn-success ${isActive ? 'titulo_cuerpo_lista_' : 'titulo_cuerpo_lista'}`}
                                                        title="Resolver actividad">
                                                        Aprendamos
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                    </div>
                </div>
                <div className="panel-footer-dominios">
                    <div className="row">
                        <div className="col-sm-9 col-xs-9 titulo_pie_lista">Información - Actividades</div>
                        <div className="pagination-controls col-sm-3 col-xs-3">
                            <Button onClick={anterior} disabled={page === 1}
                                c className={`separacion--boton ${isActive ? 'tam_lista_' : 'tam_lista'}`}
                                title="Atrás">
                                <FontAwesomeIcon icon={faBackward} />
                            </Button>
                            <span className={isActive ? 'titulo_pie_pagina_' : 'titulo_pie_pagina'}>Página {page} de {numeroPag}</span>
                            <Button onClick={siguiente} disabled={page === numeroPag}
                                className={`separacion--boton--derecha ${isActive ? 'tam_lista_' : 'tam_lista'}`}
                                title="Adelante">
                                <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
