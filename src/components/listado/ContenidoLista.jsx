/* ****** COMPONENTE LISTA DE CONTENIDOS *** */
//Estilos
//import "../../styles/Cabecera.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
//Compoenentes
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
// Metodos
import { ContenidoListEspecifico, BusquedaContenidos } from "../../api/contenido.api";
//import { VerificarUsuario } from "../../api/usuario.api";

export function ContenidoLista({ usuario }) {
    // Capturar slug de dominio
    let { slug } = useParams();
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [contenidos, setContenidos] = useState([]);
    const [isTamanio, setIstamanio] = useState(false);
    const [nombrebuscar, setNombreBuscar] = useState("");
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const token = localStorage.getItem('token');
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 6;

    // Obtener datos
    const cargarContenidos = async () => {
        try {
            //const verificar = await VerificarDominio(slug);
            const cont = await ContenidoListEspecifico(slug, page);
            setContenidos(cont.data.results);
            if (cont.data.results.length === 0) {
                setNumeropag(1);
                setIstamanio(true);
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

    // Manejo del estado de los datos
    useEffect(() => {
        if (token && !mostrarBusqueda) {
            cargarContenidos();
        } else if (token && mostrarBusqueda) {
            buscar();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (token && !mostrarBusqueda) {
                cargarContenidos();
            } else if (token && mostrarBusqueda) {
                buscar();
            }
        }, 3600000);
        return () => clearInterval(interval);
    }, [slug, mostrarBusqueda, page])

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Busqueda
    const buscar = async () => {
        // Verificar campos vacíos
        if (isEmptyField(nombrebuscar)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            const busqueda_contenido = await BusquedaContenidos(nombrebuscar, slug, page);
            if (busqueda_contenido.data.results.length === 0) {
                Swal.fire("No existen contenidos con ese nombre. Ingresa un nombre válido", "", "warning");
                resetearBusqueda();
                return;
            } else {
                setContenidos(busqueda_contenido.data.results);
                setNumeropag(Math.ceil(busqueda_contenido.data.count / elementosPorPagina));
                setMostrarBusqueda(true);
            }
        } catch (error) {
            Swal.fire("No existen contenidos con ese nombre. Ingresa un nombre válido", "", "warning");
        }
    }

    // Resetear busqueda
    const resetearBusqueda = () => {
        setMostrarBusqueda(false);
        setNombreBuscar("");
    }

    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

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
                            <Link to={'/dominio/all'} title="Regresar" className="btn mt-1" style={{ backgroundColor: '#0C2342', color: '#fff', borderRadius: '50%' }}>
                                <FontAwesomeIcon icon={faBackward} />
                            </Link>
                        </div>
                        <div className="col-md-9">
                            <h4 className="display-7 mt-2">
                                Contenido
                            </h4>
                        </div>
                        <div className="col-md-1">
                            <>
                                {
                                    usuario.tipo === 'tecnico' &&
                                    <Link to={`/contenido/registro/${slug}/`} title="Registrar Contenido" className="btn mt-1" style={{ backgroundColor: '#0C2342', color: '#fff', borderRadius: '50%' }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Link>
                                }
                                {usuario.tipo === 'comun' &&
                                    <Button title="Enviar una petición" className="btn mt-1" style={{ backgroundColor: '#0C2342', color: '#fff', borderRadius: '50%' }}
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: "Registrar una petición para contenido",
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
            <div className="mt-4 container" style={{ height: '50px', borderRadius: '10px' }}>
                <div className="d-flex flex-row justify-content-left w-100" style={{ alignItems: 'center', marginLeft: '1px' }}>
                    <a className="m-2" style={{ fontFamily: 'Pacifico' }}>Buscar :</a>
                    <form className="d-flex flex-row justify-content-between">
                        <input className="form-control mr-sm-2" type="search" name="nombre" id="nombre"
                            placeholder="Nombre de contenido.." aria-label="Search" value={nombrebuscar}
                            onChange={e => setNombreBuscar(e.target.value)} disabled={isTamanio} />
                        <>
                            {
                                mostrarBusqueda
                                    ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                        X
                                    </Button>
                                    : <Button variant="success" className="my-2 my-sm-0" onClick={buscar} disabled={isTamanio}>
                                        Vamos
                                    </Button>
                            }
                        </>
                    </form>
                </div>
            </div>
            <div className="color container-fluid mt-3" >
                <div className="contenedor">
                    <div className="contenedor-division">

                        <>
                            {contenidos.length === 0 &&
                                <p style={{ fontFamily: 'Pacific cursive', fontSize: '1.1rem', textAlign: 'left' }}>
                                    No hay contenidos registrados
                                </p>
                            }
                            {error &&
                                <div id="alert" className="alert alert-success" role="alert">
                                    <h5 className="alert-heading">!Atención!</h5>
                                    <p className="mb-0">{error}</p>
                                </div>
                            }
                            {
                                contenidos.map((contenido) => (
                                    <div className="card" key={contenido.id} style={{ backgroundImage: `url(${contenido.portada})` }}>
                                        <div className="textos__ pt-1">
                                            <h3></h3>
                                            <div className="orden_lista_contenido">
                                                <div className="col-md-6 align-self-end">
                                                    <Link to={`/contenido/detalle/${contenido.slug_contenido}/`} className="btn btn-success">
                                                        Detalle
                                                    </Link>
                                                </div>
                                                <div className="col-md-6 align-self-center">
                                                    <Link to={`/contenido/individual/all/${contenido.slug_contenido}/`} className="btn btn-success">
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
                        <div className="col-sm-9 col-xs-9">Información - Contenidos</div>
                        <div className="pagination-controls col-sm-3 col-xs-3">
                            <Button onClick={anterior} disabled={page === 1}
                                className="separacion--boton" title="Atrás">
                                <FontAwesomeIcon icon={faBackward} />
                            </Button>
                            <span style={{ fontSize: '0.8rem' }}>Página {page} de {numeroPag}</span>
                            <Button onClick={siguiente} disabled={page === numeroPag}
                                className="separacion--boton--derecha" title="Adelante">
                                <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
