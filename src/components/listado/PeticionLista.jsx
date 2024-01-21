// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
// Componentes
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
// Metodos
import { PeticionPendiente, PeticionAtendida, PeticionesUC, PeticionporFecha, PeticionporRango } from "../../api/peticion.api"
import { ListaPeticion, ListaPeticionAtendida, ListaPeticionesUsuario } from "../general/ListaPeticion"
import { VerificarUsuario } from "../../api/usuario.api"
import {
    PeticionPendienteporFecha, PeticionPendienteporRango, PeticionAtendidaporFecha,
    PeticionAtendidaporRango, PeticionPendienteporTipo, PeticionAtendidaporTipo, PeticionUsuarioporTipo
} from "../../api/peticion.api"

// Peticiones pendientes
export function PeticionLista({ isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [peticiones, setPeticiones] = useState([]);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [limite, setLimite] = useState("");
    const [tipo, setTipo] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [estadoBusquedaSel, setEstadoBusquedaSel] = useState(false);
    const [estadoBusquedaTipo, setEstadoBusquedaTipo] = useState(false);
    const [isTamanio, setIstamanio] = useState(false);
    // Escoger busqueda
    const [tipoBusqueda, setTipoBusqueda] = useState("0");
    const [escogido1, setEscogido1] = useState(false);
    const [escogido2, setEscogido2] = useState(false);
    const [generalP, setGeneralP] = useState(false);

    // Obtener datos
    const cargarPeticiones = async () => {
        try {
            // cargar datos de cursos
            const peticion = await PeticionPendiente(page);
            setPeticiones(peticion.data.results);
            if (peticion.data.results.length === 0) {
                setNumeropag(1);
                setIstamanio(true);
            } else {
                setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
            }
            console.log("Son peticiones no atendidas")
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar peticiones');
            }
        }
    }

    // Metodo de busqueda
    const buscarPeticionesTodas = async () => {
        // Verificar campos vacíos
        if (isEmptyField(fecha)) {
            Swal.fire("Por favor ingrese el campo de fecha", "", "warning");
            return;
        }
        // Verificar fecha
        try {
            if (fecha !== "") {
                // cargar datos de cursos
                const peticion = await PeticionPendienteporFecha(fecha, page);
                if (peticion.data.results.length === 0) {
                    Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setPeticiones(peticion.data.results);
                    setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
                    setEstadoBusqueda(true);
                    setGeneralP(true);
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (generalP && estadoBusqueda && fecha !== "") {
            buscarPeticionesTodas();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalP && estadoBusqueda && fecha !== "") {
                buscarPeticionesTodas();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [estadoBusqueda, generalP, fecha, page]);

    const buscarPeticionesRango = async () => {
        // Verificar fecha
        try {
            if (limite !== "" && limite !== "0") {
                // cargar datos de cursos
                const peticion = await PeticionPendienteporRango(limite, page);
                if (peticion.data.results.length === 0) {
                    Swal.fire("No existen peticiones de rango de días. Escoja otro", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setPeticiones(peticion.data.results);
                    setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
                    setEstadoBusquedaSel(true);
                    setGeneralP(true);
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones en ese rango. Ingresa uno válido", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (limite !== "0" && limite !== "") {
            buscarPeticionesRango();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (limite !== "0" && limite !== "") {
                buscarPeticionesRango();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [limite, page]);

    // Busqueda de peticions por tipo de peticion
    const buscarPeticionesTipo = async () => {
        // Verificar fecha
        try {
            if (tipo !== "" && tipo !== "0") {
                // cargar datos de cursos
                const peticionTipo = await PeticionPendienteporTipo(tipo, page);
                if (peticionTipo.data.results.length === 0) {
                    Swal.fire("No existen peticiones de ese tipo. Escoja otro", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setPeticiones(peticionTipo.data.results);
                    setNumeropag(Math.ceil(peticionTipo.data.count / elementosPorPagina));
                    setEstadoBusquedaTipo(true);
                    setGeneralP(true);
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones de ese tipo. Ingresa otro tipo de petición.", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (tipo !== "0" && tipo !== "") {
            buscarPeticionesTipo();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (tipo !== "0" && tipo !== "") {
                buscarPeticionesTipo();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [tipo, page]);

    // Estado de los datos general
    useEffect(() => {
        if (!generalP && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaTipo && fecha === "" && limite === "" && tipo === "") {
            cargarPeticiones();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (!generalP && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaTipo && fecha === "" && limite === "" && tipo === "") {
                cargarPeticiones();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [generalP, estadoBusqueda, estadoBusquedaSel, estadoBusquedaTipo, page]);

    // CONTROLES DE ENTRADA Y SALIDA

    // Resetear busqueda
    const resetearBusqueda = () => {
        setGeneralP(false);
        setEstadoBusqueda(false);
        setEstadoBusquedaSel(false);
        setFecha("");
        setLimite("");
        // Escoger busqueda
        setEscogido1(false);
        setEstadoBusquedaTipo(false);
        setEscogido2(false);
        setTipoBusqueda("0");
        setTipo("");
    }
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }
    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <div>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Peticiones - Pendientes
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            {error &&
                <div id="alert" className="alert alert-success" role="alert">
                    <h5 className="alert-heading">!Atención!</h5>
                    <p className="mb-0">{error}</p>
                </div>
            }
            {/* Para el filtro de fecha */}
            <div className="container mt-3 alienacion-externa">
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12 d-flex flex-row">
                        <select
                            className={`form-select h-75 separacion-busqueda tam_op_busqueda 
                            ${escogido1 ? 'w-25' : escogido2 ? 'w-25' : 'w-75'
                                }`}
                            value={tipoBusqueda}
                            onChange={(e) => {
                                setTipoBusqueda(e.target.value);
                                if (e.target.value === "1") {
                                    setEscogido1(true);
                                    setEscogido2(false);
                                } else if (e.target.value === "2") {
                                    setEscogido2(true);
                                    setEscogido1(false);
                                } else {
                                    setEscogido1(false);
                                    setEscogido2(false);
                                }
                            }}
                        >
                            <option value="0">Buscar por ....</option>
                            <option value="1">Fecha</option>
                            <option value="2">Tipo de petición</option>
                        </select>
                        {
                            escogido1 && (
                                <form className="w-100">
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="fecha" style={{ fontFamily: 'Pacifico' }}>Fecha: </label>
                                        </div>
                                        <div className="col-9 d-flex flex-row">
                                            <input type="date" className="form-control" id="fecha"
                                                value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                            <>
                                                {
                                                    estadoBusqueda
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarPeticionesTodas} disabled={isTamanio}>
                                                            Buscar
                                                        </Button>
                                                }
                                            </>
                                        </div>

                                    </div>
                                </form>
                            )
                        }
                        {
                            escogido2 && (
                                <form>
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="tipo" style={{ fontFamily: 'Pacifico' }}>Tipo: </label>
                                        </div>
                                        <div className="col-10 d-flex flex-row">
                                            <select name="tipo" id="tipo"
                                                value={tipo} onChange={(e) => setTipo(e.target.value)} className="form-select w-100"
                                                disabled={isTamanio}
                                            >
                                                <option value="0">Ninguno</option>
                                                <option value="Editar">Edición</option>
                                                <option value="Eliminar">Eliminación</option>
                                                <option value="Agregar">Agregación</option>
                                            </select>
                                            <>
                                                {
                                                    estadoBusquedaTipo
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <> </>
                                                }
                                            </>
                                        </div>

                                    </div>
                                </form>
                            )
                        }
                    </div>
                </div>
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12">
                        <form>
                            <div className="row form-group">
                                <div className="col-2 d-flex justify-content-center mt-2">
                                    <label htmlFor="fecha" style={{ fontFamily: 'Pacifico' }}>Rango:</label>
                                </div>
                                <div className="col-9 d-flex flex-row">
                                    <select name="fecha" id="fecha"
                                        value={limite} onChange={(e) => setLimite(e.target.value)}
                                        className="form-select tam_op_busqueda"
                                        disabled={isTamanio}
                                    >
                                        <option value="0">Ninguno</option>
                                        <option value="7">Últimos 7 días</option>
                                        <option value="15">Últimos 15 días</option>
                                        <option value="30">Últimos 30 días</option>
                                        <option value="60">Últimos 60 días</option>
                                    </select>
                                    <>
                                        {
                                            estadoBusquedaSel
                                                ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                    X
                                                </Button>
                                                : <> </>
                                        }
                                    </>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Table */}
            <ListaPeticion peticiones={peticiones} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )

}


// Peticiones atendidas
export function PeticionListaAtendi({ isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [peticiones, setPeticiones] = useState([]);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [limite, setLimite] = useState("");
    const [tipo, setTipo] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [estadoBusquedaSel, setEstadoBusquedaSel] = useState(false);
    const [estadoBusquedaTipo, setEstadoBusquedaTipo] = useState(false);
    const [isTamanio, setIstamanio] = useState(false);
    const [generalP, setGeneralP] = useState(false);
    // Escoger busqueda
    const [tipoBusqueda, setTipoBusqueda] = useState("0");
    const [escogido1, setEscogido1] = useState(false);
    const [escogido2, setEscogido2] = useState(false);

    // Obtener datos
    const cargarPeticiones = async () => {
        try {
            // cargar datos de cursos
            const peticion = await PeticionAtendida(page);
            setPeticiones(peticion.data.results);
            if (peticion.data.results.length === 0) {
                setNumeropag(1);
                setIstamanio(true);
            } else {
                setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
            }
            console.log("Son peticiones atendidas")
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar peticiones');
            }
        }
    }

    // Metodo de busqueda
    const buscarPeticionesTodasA = async () => {
        // Verificar campos vacíos
        if (isEmptyField(fecha)) {
            Swal.fire("Por favor ingrese el campo de fecha", "", "warning");
            return;
        }
        // Verificar fecha
        try {
            if (fecha !== "") {
                // cargar datos de cursos
                const peticion = await PeticionAtendidaporFecha(fecha, page);
                if (peticion.data.results.length === 0) {
                    Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setPeticiones(peticion.data.results);
                    setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
                    setEstadoBusqueda(true);
                    setGeneralP(true);
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Cargado de datos
    useEffect(() => {
        if (generalP && estadoBusqueda && fecha !== "") {
            buscarPeticionesTodasA();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalP && estadoBusqueda && fecha !== "") {
                buscarPeticionesTodasA();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [estadoBusqueda, generalP, fecha, page]);

    // Peticiones por rango
    const buscarPeticionesRangoA = async () => {
        // Verificar fecha
        try {
            if (limite !== "" && limite !== "0") {
                // cargar datos de cursos
                const peticion = await PeticionAtendidaporRango(limite, page);
                if (peticion.data.results.length === 0) {
                    Swal.fire("No existen peticiones de rango de días. Escoja otro", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setPeticiones(peticion.data.results);
                    setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
                    setEstadoBusquedaSel(true);
                    setGeneralP(true);
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones en ese rango. Ingresa uno válido", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (limite !== "0" && limite !== "") {
            buscarPeticionesRangoA();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (limite !== "0" && limite !== "") {
                buscarPeticionesRangoA();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [limite, page]);

    // Busqueda de peticions por tipo de peticion
    const buscarPeticionesTipoAA = async () => {
        // Verificar fecha
        try {
            if (tipo !== "" && tipo !== "0") {
                // cargar datos de cursos
                const peticionTipoAA = await PeticionAtendidaporTipo(tipo, page);
                if (peticionTipoAA.data.results.length === 0) {
                    Swal.fire("No existen peticiones de ese tipo. Escoja otro", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setPeticiones(peticionTipoAA.data.results);
                    setNumeropag(Math.ceil(peticionTipoAA.data.count / elementosPorPagina));
                    setEstadoBusquedaTipo(true);
                    setGeneralP(true);
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones de ese tipo. Ingresa otro tipo de petición.", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (tipo !== "0" && tipo !== "") {
            buscarPeticionesTipoAA();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (tipo !== "0" && tipo !== "") {
                buscarPeticionesTipoAA();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [tipo, page]);

    // Listado de datos general
    useEffect(() => {
        if (!generalP && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaTipo && fecha === "" && limite === "" && tipo === "") {
            cargarPeticiones();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (!generalP && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaSel && fecha === "" && limite === "" && tipo === "") {
                cargarPeticiones();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [generalP, estadoBusqueda, estadoBusquedaSel, estadoBusquedaSel, page]);

    // CONTROLES DE ENTRADA Y SALIDA 

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };
    // Resetear busqueda
    const resetearBusqueda = () => {
        setGeneralP(false);
        setEstadoBusqueda(false);
        setEstadoBusquedaSel(false);
        setEscogido1(false);
        setFecha("");
        setLimite("");
        // Tipo de busqueda
        setTipoBusqueda("0");
        setEstadoBusquedaTipo(false);
        setEscogido2(false);
        setTipo("");
    }
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    return (
        <div>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Peticiones Atendidas
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            {error &&
                <div id="alert" className="alert alert-success" role="alert">
                    <h5 className="alert-heading">!Atención!</h5>
                    <p className="mb-0">{error}</p>
                </div>
            }
            {/* Para el filtro de fecha */}
            <div className="container mt-3 alienacion-externa">
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12 d-flex flex-row">
                        <select
                            className={`form-select h-75 separacion-busqueda tam_op_busqueda
                            ${escogido1 ? 'w-25' : escogido2 ? 'w-25' : 'w-75'
                                }`}
                            value={tipoBusqueda}
                            onChange={(e) => {
                                setTipoBusqueda(e.target.value);
                                if (e.target.value === "1") {
                                    setEscogido1(true);
                                    setEscogido2(false);
                                } else if (e.target.value === "2") {
                                    setEscogido2(true);
                                    setEscogido1(false);
                                } else {
                                    setEscogido1(false);
                                    setEscogido2(false);
                                }
                            }}
                        >
                            <option value="0">Buscar por ....</option>
                            <option value="1">Fecha</option>
                            <option value="2">Tipo de petición</option>
                        </select>
                        {
                            escogido1 && (
                                <form className="w-100">
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="fecha" style={{ fontFamily: 'Pacifico' }}>Fecha:</label>
                                        </div>
                                        <div className="col-9 d-flex flex-row">
                                            <input type="date" className="form-control" id="fecha"
                                                value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                            <>
                                                {
                                                    estadoBusqueda
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarPeticionesTodasA} disabled={isTamanio}>
                                                            Buscar
                                                        </Button>
                                                }
                                            </>
                                        </div>

                                    </div>
                                </form>
                            )
                        }
                        {
                            escogido2 && (
                                <form>
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="tipo" style={{ fontFamily: 'Pacifico' }}>Tipo:</label>
                                        </div>
                                        <div className="col-10 d-flex flex-row">
                                            <select name="tipo" id="tipo"
                                                value={tipo} onChange={(e) => setTipo(e.target.value)} className="form-select w-100"
                                                disabled={isTamanio}
                                            >
                                                <option value="0">Ninguno</option>
                                                <option value="Editar">Edición</option>
                                                <option value="Eliminar">Eliminación</option>
                                                <option value="Agregar">Agregación</option>
                                            </select>
                                            <>
                                                {
                                                    estadoBusquedaTipo
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <> </>
                                                }
                                            </>
                                        </div>

                                    </div>
                                </form>
                            )
                        }
                    </div>
                </div>
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12">
                        <form>
                            <div className="row form-group">
                                <div className="col-2 d-flex justify-content-center mt-2">
                                    <label htmlFor="fecha" style={{ fontFamily: 'Pacifico' }}>Rango:</label>
                                </div>
                                <div className="col-9 d-flex flex-row">
                                    <select name="fecha" id="fecha"
                                        value={limite} onChange={(e) => setLimite(e.target.value)}
                                        className="form-select tam_op_busqueda"
                                        disabled={isTamanio}
                                    >
                                        <option value="0">Ninguno</option>
                                        <option value="7">Últimos 7 días</option>
                                        <option value="15">Últimos 15 días</option>
                                        <option value="30">Últimos 30 días</option>
                                        <option value="60">Últimos 60 días</option>
                                    </select>
                                    <>
                                        {
                                            estadoBusquedaSel
                                                ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                    X
                                                </Button>
                                                : <> </>
                                        }
                                    </>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Table */}
            <ListaPeticionAtendida peticiones={peticiones} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )

}


// Peticiones de usuarios
export function PeticionListaUsuario({ isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [peticiones, setPeticiones] = useState([]);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [limite, setLimite] = useState("");
    const [tipo, setTipo] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [estadoBusquedaSel, setEstadoBusquedaSel] = useState(false);
    const [estadoBusquedaTipo, setEstadoBusquedaTipo] = useState(false);
    const [isTamanio, setIstamanio] = useState(false);
    const [generalP, setGeneralP] = useState(false);
    // Escoger busqueda
    const [tipoBusqueda, setTipoBusqueda] = useState("0");
    const [escogido1, setEscogido1] = useState(false);
    const [escogido2, setEscogido2] = useState(false);

    // Obtener datos
    const cargarPeticiones = async () => {
        try {
            // Verificar usuario
            const usuarioC = await VerificarUsuario();
            if (usuarioC.data.success) {
                // cargar datos de cursos
                const peticion = await PeticionesUC(usuarioC.data.identificador, page);
                if (peticion.data.results.length === 0) {
                    setNumeropag(1);
                    setIstamanio(true);
                } else {
                    setPeticiones(peticion.data.results);
                    setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
                }
                console.log("Son peticiones de usuario")
            } else {
                navigate('/login');
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar peticiones de usuario');
            }
        }
    }

    // Metodo de busqueda
    const buscarPeticiones = async () => {
        // Verificar campos vacíos
        if (isEmptyField(fecha)) {
            Swal.fire("Por favor ingrese el campo de fecha", "", "warning");
            return;
        }
        // Verificar fecha
        try {
            if (fecha !== "") {
                // Verificar usuario
                const usuarioC = await VerificarUsuario();
                if (usuarioC.data.success) {
                    // cargar datos de cursos
                    const peticion = await PeticionporFecha(fecha, usuarioC.data.identificador, page);
                    if (peticion.data.results.length === 0) {
                        Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
                        resetearBusqueda();
                        return;
                    } else {
                        setPeticiones(peticion.data.results);
                        setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
                        setEstadoBusqueda(true);
                        setGeneralP(true);
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (generalP && estadoBusqueda && fecha !== "") {
            buscarPeticiones();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalP && estadoBusqueda && fecha !== "") {
                buscarPeticiones();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [generalP, estadoBusqueda, fecha, page]);

    // Buscar peticiones de usuario por rango
    const buscarPeticionesRango = async () => {
        // Verificar fecha
        try {
            if (limite !== "") {
                // Verificar usuario
                const usuarioC = await VerificarUsuario();
                if (usuarioC.data.success) {
                    // cargar datos de cursos
                    const peticion = await PeticionporRango(limite, usuarioC.data.identificador, page);
                    if (peticion.data.results.length === 0) {
                        Swal.fire("No existen peticiones de rango de días. Escoja otro", "", "warning");
                        resetearBusqueda();
                        return;
                    } else {
                        setPeticiones(peticion.data.results);
                        setNumeropag(Math.ceil(peticion.data.count / elementosPorPagina));
                        setEstadoBusquedaSel(true);
                        setGeneralP(true);
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones en ese rango. Ingresa uno válido", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (limite !== "0" && limite !== "") {
            buscarPeticionesRango();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (limite !== "0" && limite !== "") {
                buscarPeticionesRango();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [limite, page]);

    // Busqueda de peticions por tipo de peticion
    const peticion_tipo_usuario = async () => {
        // Verificar fecha
        try {
            if (tipo !== "" && tipo !== "0") {
                const usuarioC = await VerificarUsuario();
                if (usuarioC.data.success) {
                    // cargar datos de peticiones
                    const peticionTipoU = await PeticionUsuarioporTipo(tipo, usuarioC.data.identificador, page);
                    if (peticionTipoU.data.results.length === 0) {
                        Swal.fire("No existen peticiones de ese tipo de usted. Escoja otro", "", "warning");
                        resetearBusquedaTipo();
                        return;
                    } else {
                        setPeticiones(peticionTipoU.data.results);
                        setNumeropag(Math.ceil(peticionTipoU.data.count / elementosPorPagina));
                        setEstadoBusquedaTipo(true);
                        setGeneralP(true);
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarPeticiones();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen peticiones de ese tipo. Ingresa otro tipo de petición.", "", "warning");
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (tipo !== "" && tipo !== "0") {
            peticion_tipo_usuario();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (tipo !== "" && tipo !== "0") {
                peticion_tipo_usuario();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [tipo, page]);

    // Control de listado de peticiones base
    useEffect(() => {
        if (!generalP && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaTipo && fecha === "" && limite === "" && tipo === "") {
            cargarPeticiones();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (!generalP && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaTipo && fecha === "" && limite === "" && tipo === "") {
                cargarPeticiones();
            }
        }, 3600000); // 1 hora
        return () => clearInterval(interval);
    }, [generalP, estadoBusqueda, estadoBusquedaSel, estadoBusquedaTipo, page]);

    // CONTROLES DE ENTRADA Y SALIDA

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };
    // Resetear busqueda
    const resetearBusqueda = () => {
        setGeneralP(false);
        setEstadoBusqueda(false);
        setEstadoBusquedaSel(false);
        setFecha("");
        setLimite("");
        // Tipo de busqueda
        setEscogido1(false);
        setEstadoBusquedaTipo(false);
        setEscogido2(false);
        setTipoBusqueda("0");
        setTipo("");
    };

    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    };

    return (
        <div>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Peticiones de usuario
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            {error &&
                <div id="alert" className="alert alert-success" role="alert">
                    <h5 className="alert-heading">!Atención!</h5>
                    <p className="mb-0">{error}</p>
                </div>
            }
            {/* Para el filtro de fecha */}
            <div className="container mt-4 alienacion-externa">
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12 d-flex flex-row">
                        <select
                            className={`form-select h-75 separacion-busqueda tam_op_busqueda
                            ${escogido1 ? 'w-25' : escogido2 ? 'w-25' : 'w-75'
                                }`}
                            value={tipoBusqueda}
                            onChange={(e) => {
                                setTipoBusqueda(e.target.value);
                                if (e.target.value === "1") {
                                    setEscogido1(true);
                                    setEscogido2(false);
                                } else if (e.target.value === "2") {
                                    setEscogido2(true);
                                    setEscogido1(false);
                                } else {
                                    setEscogido1(false);
                                    setEscogido2(false);
                                }
                            }}
                        >
                            <option value="0">Buscar por ....</option>
                            <option value="1">Fecha</option>
                            <option value="2">Tipo de petición</option>
                        </select>
                        {
                            escogido1 && (
                                <form className="w-100">
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="fecha" style={{ fontFamily: 'Pacifico' }}>Fecha:</label>
                                        </div>
                                        <div className="col-9 d-flex flex-row">
                                            <input type="date" className="form-control" id="fecha"
                                                value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                            <>
                                                {
                                                    estadoBusqueda
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarPeticiones} disabled={isTamanio}>
                                                            Buscar
                                                        </Button>
                                                }
                                            </>
                                        </div>

                                    </div>
                                </form>
                            )
                        }
                        {
                            escogido2 && (
                                <form>
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="tipo" style={{ fontFamily: 'Pacifico' }}>Tipo:</label>
                                        </div>
                                        <div className="col-10 d-flex flex-row">
                                            <select name="tipo" id="tipo"
                                                value={tipo} onChange={(e) => setTipo(e.target.value)}
                                                className="form-select w-100 tam_op_busqueda"
                                                disabled={isTamanio}
                                            >
                                                <option value="0">Ninguno</option>
                                                <option value="Editar">Edición</option>
                                                <option value="Eliminar">Eliminación</option>
                                                <option value="Agregar">Agregación</option>
                                            </select>
                                            <>
                                                {
                                                    estadoBusquedaTipo
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <> </>
                                                }
                                            </>
                                        </div>

                                    </div>
                                </form>
                            )
                        }
                    </div>
                </div>
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12">
                        <form>
                            <div className="row form-group">
                                <div className="col-2 d-flex justify-content-center mt-2">
                                    <label htmlFor="fecha" style={{ fontFamily: 'Pacifico' }}>Rango:</label>
                                </div>
                                <div className="col-9 d-flex flex-row">
                                    <select name="fecha" id="fecha"
                                        value={limite} onChange={(e) => setLimite(e.target.value)} 
                                        className="form-select tam_op_busqueda"
                                        disabled={isTamanio}
                                    >
                                        <option value="0">Ninguno</option>
                                        <option value="7">Últimos 7 días</option>
                                        <option value="15">Últimos 15 días</option>
                                        <option value="30">Últimos 30 días</option>
                                        <option value="60">Últimos 60 días</option>
                                    </select>
                                    <>
                                        {
                                            estadoBusquedaSel
                                                ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                    X
                                                </Button>
                                                : <> </>
                                        }
                                    </>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Table */}
            <ListaPeticionesUsuario peticiones={peticiones} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )
}