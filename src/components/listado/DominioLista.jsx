// estilos
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// Componentes
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
// Metodos
import { DominiosListado } from "../../api/dominio.api";
//import { VerificarUsuario } from "../../api/usuario.api";

export function DominioLista({ usuario }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    // Manejo de errores
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [dominios, setDominios] = useState([]);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 6;

    // Datos de dominios
    const cargarDominios = async () => {
        try {
            // Obtener dominios 
            const domi = await DominiosListado(page);
            setDominios(domi.data.results);
            if (domi.data.results.length === 0) {
                setNumeropag(1);
            } else {
                setNumeropag(Math.ceil(domi.data.count / elementosPorPagina));
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al cargar dominios');
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        cargarDominios();
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            cargarDominios();
        }, 3600000);
        return () => clearInterval(interval);
    }, [page])

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
                            <Link to={'/nivel/all'} title="Regresar" className="btn mt-1 btn_operacion">
                                <FontAwesomeIcon icon={faBackward} />
                            </Link>
                        </div>
                        <div className="col-md-9">
                            <h4 className="display-7 mt-2">
                                Dominio
                            </h4>
                        </div>
                        <div className="col-md-1">
                            <>
                                {usuario.tipo === 'tecnico' &&
                                    <Link to={'/dominio/registro'} title="Registrar Dominio" className="btn_operacion btn mt-1 ">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Link>
                                }
                                {usuario.tipo === 'comun' &&
                                    <Button title="Enviar una petición" className="btn_operacion btn mt-1"
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: "Registrar una petición para dominio",
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
            <div className="color container-fluid mt-3" >
                <div className="contenedor">
                    <div className="contenedor-division">
                        <>
                            {dominios.length === 0 &&
                                <p key={dominios.id} className="vacio">
                                    No hay dominios registrados
                                </p>}
                            {error &&
                                <div id="alert" className="alert alert-success" role="alert">
                                    <h5 className="alert-heading">!Atención!</h5>
                                    <p className="mb-0">{error}</p>
                                </div>
                            }
                            {
                                dominios.map((dominio) => (
                                    <div className="card" key={dominio.id} style={{ backgroundImage: `url(${dominio.portada_dominio})` }}>
                                        <div className="textos__ pt-1">
                                            <h3></h3>
                                            <div className="orden_lista_contenido">
                                                <div className="col-md-6 align-self-end">
                                                    <Link to={`/dominio/detalle/${dominio.slug_dominio}/`}
                                                        className="btn btn-success titulo_cuerpo_lista">
                                                        Detalle
                                                    </Link>
                                                </div>
                                                <div className="col-md-6 align-self-center">
                                                    <Link to={`/contenido/all/${dominio.slug_dominio}/`}
                                                        className="btn btn-success titulo_cuerpo_lista">
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
                        <div className="col-sm-9 col-xs-9 titulo_pie_lista">Información - Dominios</div>
                        <div className="pagination-controls col-sm-3 col-xs-3">
                            <Button onClick={anterior} disabled={page === 1}
                                className="tam_lista separacion--boton" title="Atrás">
                                <FontAwesomeIcon icon={faBackward} />
                            </Button>
                            <span className="titulo_pie_pagina">Página {page} de {numeroPag}</span>
                            <Button onClick={siguiente} disabled={page === numeroPag}
                                className="tam_lista separacion--boton--derecha" title="Adelante">
                                <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}