// Estilos
import "../../styles/Nivel.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image, Button } from "react-bootstrap";
// Componentes
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// Metodos
import { VerificarUsuario, BusquedaPacientesCurso } from "../../api/usuario.api";
import { NivelListado } from "../../api/grado.api";
import { PacientesInscritos, VerificarCurso, CursoListado, CursosUsuarioComun } from "../../api/curso.api";
import { BusquedaCurso, CursoporFecha, CursoporFechaTecnico, EstudianteporCedula } from "../../api/curso.api";
import { ResultadosListado, PacientesResultados, ResultadosListaUsuario } from "../../api/resultado.api";
import { ResultadoporFecha, ResultadoporFechaTecnico, ResultadoporRango, ResultadoporRangoTecnico } from "../../api/resultado.api";
import { SalasUsuarioComun, SalaListado, SalasPaciente, BusquedaSalas, AccederSala, SalaporFecha } from "../../api/sala.api";
import { ReporteListado, ReporteListadoUsuarioComun, ReportesPaciente, ReporteporCedula } from "../../api/reporte.api";
import { ReporteporFecha, ReporteporFechaTecnico, ReporteporRango, ReporteporRangoTecnico } from "../../api/reporte.api";
import { SalasUsuarioComunAtendidas, SalaFecha, SalaporFechaAtendida } from "../../api/sala.api";
import { ResultadoporCedula } from "../../api/resultado.api";

import { ListadodePacientes } from "../general/ListaPaciente";
import { OpcionesTecnico, OpcionesComun, OpcionesPaciente } from '../general/OpcionesNivel';
import { ListadodeCursos } from "../general/ListaCurso";
import { ListadodeReportes, ListadodeSala, ListadodeSalaPaciente, ListadodeResultado } from "../general/ListasEspecificas";


// Lista de niveles
export function NivelLista({ usuario }) {
    // Busqueda sala
    const [codigosala, setCodigo] = useState("");
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [niveles, setniveles] = useState([]);
    //const [localNiveles, setLocalNiveles] = useState(niveles);

    // Datos de nivel
    const cargarNiveles = async () => {
        try {
            // Obtenemos los datos de los niveles
            let domi = await NivelListado();
            setniveles(domi.data);
            //setLocalNiveles(niveles);
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al cargar los niveles');
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (!mostrarBusqueda) {
            cargarNiveles();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            cargarNiveles();
        }, 300000); // 5 minutos
        return () => clearInterval(interval);
    }, []);

    // Busqueda
    const busquedaContenido = async (e) => {
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            let datos_obtenidos = await AccederSala(codigosala);
            if (datos_obtenidos.data.success) {
                setMostrarBusqueda(true);
                navigate(`/individual/nuevo/${datos_obtenidos.data.slug}`);
            } else {
                if (datos_obtenidos.data.error) {
                    Swal.fire(datos_obtenidos.data.error, "", "warning");
                } else {
                    Swal.fire("No existen contenidos con ese código. Ingresa uno válido", "", "warning");
                }
            }
        } catch (error) {
            Swal.fire("No existen contenidos con ese código. Ingresa uno válido", "", "warning");
        }
    }

    // Campos vacios
    const isValidForm = () => {
        if (
            !codigosala ||
            codigosala === 0
        ) {
            return false;
        }
        return true;
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
            <>
                {
                    usuario.tipo === "paciente" &&
                    <div className="d-flex flex-row mb-3">
                        <div className="card-body">
                            <form className="d-flex flex-row" >
                                <div className="input-group">
                                    <input type="text" className="form-control rounded" placeholder="Inserta código de sala"
                                        aria-label="Search" aria-describedby="search-addon" value={codigosala}
                                        onChange={e => {
                                            const entrada = e.target.value;
                                            const numero = Number(entrada);
                                            if (numero >= 0 || entrada === "") {
                                                setCodigo(entrada);
                                            }
                                        }
                                        } />
                                    <>
                                        {
                                            !mostrarBusqueda
                                                ? <Button variant="success" className="my-2 my-sm-0"
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: '¿Está seguro que desea acceder a la actividad?',
                                                            text: "Si, acceder",
                                                            icon: 'info',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#3085d6',
                                                            cancelButtonColor: '#d33',
                                                            confirmButtonText: 'Sí',
                                                        }).then(async (result) => {
                                                            if (result.isConfirmed) {
                                                                await busquedaContenido();
                                                            }
                                                        })
                                                    }}
                                                >
                                                    Buscar
                                                </Button>
                                                :
                                                <></>
                                        }
                                    </>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Niveles TDAH
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <p className="mb-0">{error}</p>
                    </div>
                }
                {
                    niveles.length === 0 &&
                    <div className="d-flex justify-content-center mt-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {
                    niveles.map((nivel) => (
                        <div className="contenedor-listado__nivel" key={nivel.id}>
                            <div className="contenedor-nombre__nivel">
                                <li style={{ listStyle: 'none' }}>
                                    <h6 style={{ fontFamily: 'Pacifico' }}>Grado TDAH: {nivel.descripcion_grado}</h6>
                                </li>
                            </div>
                            <div className="contenedor__nivel">
                                <div className="contenedor-datos__nivel">
                                    <div className="orden_879">

                                        <div className="alin-nivel">
                                            <Image src="/img/abeja_ivbapx.jpg"
                                                className="imagen__nivel" />
                                        </div>

                                    </div>
                                    <div className="orden_880">
                                        <div className="card__nivel">
                                            <div className="textos__nivel alin-nivel">
                                                <li>
                                                    <h3 className="titulo__dato"> Nombre </h3>
                                                </li>
                                                <li className="valor__dato"> {nivel.nombre_nivel} </li>
                                            </div>
                                        </div>
                                        <div className="card__nivel">
                                            <div className="textos__nivel alin-nivel">
                                                <li>
                                                    <h3 className="titulo__dato"> Categorías </h3>
                                                </li>
                                                <li className="valor__dato"> {nivel.numero_categorias} </li>
                                            </div>
                                        </div>
                                        <div className="card__nivel">
                                            <div className="textos__nivel alin-nivel">
                                                <li>
                                                    <h3 className="titulo__dato"> Dificultad </h3>
                                                </li>
                                                <li className="valor__dato font-weight-normal"> {nivel.grado_dificultad} </li>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <>
                                    {
                                        usuario.tipo === "tecnico" &&
                                        <OpcionesTecnico nivel={nivel} />
                                    }
                                    {
                                        usuario.tipo === "comun" &&
                                        <OpcionesComun nivel={nivel} />
                                    }
                                    {
                                        usuario.tipo === "paciente" &&
                                        <OpcionesPaciente nivel={nivel} />
                                    }
                                </>

                            </div>
                        </div>

                    ))
                }
                <hr style={{ color: '#0C2342' }} />
            </>

        </div>
    )
}


// Lista de pacientes asociadas a un curso
export function PacienteListado({ isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    // Capturar slug
    let { slug } = useParams();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [pacientes, setPacientes] = useState([]);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Busqueda
    const [nombrebuscarP, setNombreBuscarP] = useState("");
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [isTamanio, setIstamanio] = useState(false);
    const [entradaValida, setEntradavaldia] = useState(true);
    const [generalPa, setGeneralPa] = useState(false);
    // Escoger busqueda
    const [busquedaPaci, setBusquedaPaci] = useState("0");
    const [escogido, setEscogido] = useState(false);
    const [escogido2, setEscogido2] = useState(false);
    const [cedula, setCedula] = useState("");
    const [estadoBusquedaCR, setEstadoBusquedaCR] = useState(false);

    // Cargar lista de pacientes
    const cargarPacientes = async () => {
        try {
            // Verificar curso
            const curso = await VerificarCurso(slug);
            if (curso.data.identificador) {
                // Cargar datos de pacientes
                let paciente = await PacientesInscritos(curso.data.identificador, page);
                if (paciente.data.results.length === 0) {
                    setIstamanio(true);
                    setNumeropag(1);
                } else {
                    setPacientes(paciente.data.results);
                    setNumeropag(Math.ceil(paciente.data.count / elementosPorPagina));
                }
            } else {
                mostrarError('Error al cargar los pacientes inscritos');
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar los pacientes inscritos');
            }
        }
    }

    // Busqueda
    const busquedaPaciente = async () => {
        // Verificar campos vacíos
        if (isEmptyField(nombrebuscarP)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Entrada
        if (!entradaValida) {
            Swal.fire("Por favor ingrese el formato: Nombres Apellidos", "", "warning");
            resetearBusqueda();
            return;
        }
        // Flujo normal
        try {
            const busqueda_paciente = await BusquedaPacientesCurso(nombrebuscarP, slug, page);
            if (busqueda_paciente.data.results.length === 0) {
                resetearBusqueda();
                Swal.fire("No existe un paciente con ese nombre. Ingresa un nombre válido", "", "warning");
                return;
            } else {
                setPacientes(busqueda_paciente.data.results);
                setNumeropag(Math.ceil(busqueda_paciente.data.count / elementosPorPagina));
                setMostrarBusqueda(true);
                setGeneralPa(true);
            }
        } catch (error) {
            Swal.fire("No existe un paciente con ese nombre. Ingresa un nombre válido", "", "warning");
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (generalPa && mostrarBusqueda && nombrebuscarP !== "") {
            busquedaPaciente();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalPa && mostrarBusqueda && nombrebuscarP !== "") {
                busquedaPaciente();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);
    }, [slug, mostrarBusqueda, generalPa, nombrebuscarP, page]);

    // BUSCAR POR CEDULA
    // Metodo de busqueda por cédula
    const buscarEstudianteCedula = async () => {
        // Verificar campos vacíos
        if (isEmptyField(cedula)) {
            Swal.fire("Por favor ingrese el campo de cédula", "", "warning");
            return;
        }
        // Validar tamaño de cédula
        if (cedula.length < 10) {
            Swal.fire("La cédula debe tener al menos 10 dígitos", "", "warning");
            resetearBusqueda();
            return;
        }
        // Verificar cédula ingresada
        try {
            if (cedula !== "") {
                const resultadoPCedula = await EstudianteporCedula(cedula, slug, page);
                if (resultadoPCedula.data.results.length === 0) {
                    Swal.fire("No existe un estudiante con esa cédula en el curso. Ingrese una válida.", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setPacientes(resultadoPCedula.data.results);
                    setNumeropag(Math.ceil(resultadoPCedula.data.count / elementosPorPagina));
                    setEstadoBusquedaCR(true);
                    setGeneralPa(true);
                }
            } else {
                cargarPacientes();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existe un estudiante con esa cédula en el curso.. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (generalPa && estadoBusquedaCR && cedula !== "") {
            buscarEstudianteCedula();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalPa && estadoBusquedaCR && cedula !== "") {
                buscarEstudianteCedula();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [slug, estadoBusquedaCR, generalPa, cedula, page]);

    // Listado general 
    useEffect(() => {
        if (!generalPa && !mostrarBusqueda && !estadoBusquedaCR && nombrebuscarP === "" && cedula === "") {
            cargarPacientes();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (!generalPa && !mostrarBusqueda && !estadoBusquedaCR && nombrebuscarP === "" && cedula === "") {
                cargarPacientes();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [slug, generalPa, mostrarBusqueda, estadoBusquedaCR, page]);

    // VALIDACIONES DE ENTRADA Y SALIDA
    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };
    // Resetear busqueda
    const resetearBusqueda = () => {
        setGeneralPa(false);
        setEscogido2(false);
        setEstadoBusquedaCR(false);
        setMostrarBusqueda(false);
        setEscogido(false);
        setNombreBuscarP("");
        setBusquedaPaci("0");
        setCedula("");
    }
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }
    // Funcion para validar la entreada
    const cambioEntrada = (e) => {
        const value = e.target.value;
        setNombreBuscarP(value);

        if (!validarEntrada(value)) {
            setEntradavaldia(false);
        } else {
            setEntradavaldia(true);
        }
    };

    const validarEntrada = (value) => {
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };

    return (
        <div>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Estudiantes inscritos
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
            <div className="mt-3 container alineacion-3" style={{ height: '50px', borderRadius: '10px' }}>
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12 d-flex flex-row">
                        <select
                            className={`form-select h-75 separacion-busqueda tam_op_busqueda
                            ${escogido ? 'w-25' : escogido2 ? 'w-25' : 'w-50'
                                }`}
                            value={busquedaPaci}
                            onChange={(e) => {
                                setBusquedaPaci(e.target.value);
                                // Mostrar el formulario si la opción seleccionada es "1" (Nombre de estudiante)
                                if (e.target.value === "1") {
                                    setEscogido(true);
                                    setEscogido2(false);
                                } else if (e.target.value === "2") {
                                    setEscogido2(true);
                                    setEscogido(false);
                                } else {
                                    setEscogido(false);
                                    setEscogido2(false);
                                }
                            }}
                        >
                            <option value="0">Buscar por ....</option>
                            <option value="1">Nombre de estudiante</option>
                            <option value="2">Cédula de identidad</option>
                        </select>
                        {escogido && (
                            <form style={{ width: '400px' }}>
                                <div className="row form-group">
                                    <div className="col-2 d-flex justify-content-center mt-2">
                                        <label htmlFor="nombre" style={{ fontFamily: 'Pacifico' }}
                                        >Nombre:</label>
                                    </div>
                                    <div className="col-10 d-flex flex-row">
                                        <input type="text" className="form-control" id="nombre"
                                            value={nombrebuscarP} onChange={cambioEntrada} placeholder="Ingrese nombres apellidos**" />
                                        <>
                                            {
                                                mostrarBusqueda
                                                    ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                        X
                                                    </Button>
                                                    : <Button variant="success" className="my-2 my-sm-0" onClick={busquedaPaciente} disabled={isTamanio}>
                                                        Vamos
                                                    </Button>
                                            }
                                        </>
                                    </div>
                                </div>
                            </form>
                        )}
                        {
                            escogido2 && (
                                <form style={{ width: '400px' }}>
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="cedula" style={{ fontFamily: 'Pacifico' }}>Cédula:</label>
                                        </div>
                                        <div className="col-10 d-flex flex-row">
                                            <input type="text" className="form-control" id="cedula"
                                                placeholder="Ingrese el número de cédula**" name='cedula'
                                                maxLength={10}
                                                value={cedula}
                                                onChange={e => {
                                                    if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                                        setCedula(e.target.value);
                                                    }
                                                }} />
                                            <>
                                                {
                                                    estadoBusquedaCR
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarEstudianteCedula} disabled={isTamanio}>
                                                            Buscar
                                                        </Button>
                                                }
                                            </>
                                        </div>
                                    </div>
                                </form>
                            )}
                    </div>
                </div>
            </div>
            {/* Table */}
            <ListadodePacientes pacientes={pacientes} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )

}


// Lista de resultados
export function ResultadoLista({ usuario, isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [resultados, setResultados] = useState([]);
    // Por nombre
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [nombrebuscar, setNombreBuscar] = useState("");
    // Validaciones
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [isTamanio, setIstamanio] = useState(false);
    const [entradaValida, setEntradavaldia] = useState(true);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [limite, setLimite] = useState("");
    const [cedula, setCedula] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [estadoBusquedaSel, setEstadoBusquedaSel] = useState(false);
    const [estadoBusquedaCR, setEstadoBusquedaCR] = useState(false);
    const [general, setGeneral] = useState(false);
    // Escoger busqueda
    const [busqueda, setBusqueda] = useState("0");
    const [escogido, setEscogido] = useState(false);
    const [escogido2, setEscogido2] = useState(false);
    const [escogido3, setEscogido3] = useState(false);
    // Obtener resultados
    const cargarResultados = async () => {
        try {
            // Verificar usuario
            const usuario_dat = await VerificarUsuario();
            if (usuario_dat.data.success) {
                if (usuario_dat.data.tipo === "comun") {
                    let resultado = await ResultadosListaUsuario(usuario_dat.data.identificador, page);
                    if (resultado.data.results.length === 0) {
                        setIstamanio(true);
                        setNumeropag(1);
                    } else {
                        setResultados(resultado.data.results);
                        setNumeropag(Math.ceil(resultado.data.count / elementosPorPagina));
                    }
                } else {
                    // Cargar datos de resultados
                    let resultado_n = await ResultadosListado(page);
                    if (resultado_n.data.results.length === 0) {
                        setIstamanio(true);
                        setNumeropag(1);
                    } else {
                        setResultados(resultado_n.data.results);
                        setNumeropag(Math.ceil(resultado_n.data.count / elementosPorPagina));
                    }
                }
            } else {
                if (usuario_dat.data.error) {
                    Swal.fire("Hubo un problema para identificar el usuario", "", "warning");
                    navigate('/login')
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar los resultados');
            }
        }
    }

    // Busqueda
    const busquedaResultado = async () => {
        // Verificar campos vacíos
        if (isEmptyField(nombrebuscar)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Validar entradade nombre 
        if (!entradaValida) {
            Swal.fire("Por favor ingrese el formato: Nombres Apellidos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            const datos_obtenidos = await PacientesResultados(nombrebuscar, page);
            if (datos_obtenidos.data.results.length === 0) {
                Swal.fire("No existen resultados con ese nombre de paciente. Ingresa un nombre válido", "", "warning");
                resetearBusqueda();
                return;
            } else {
                setResultados(datos_obtenidos.data.results);
                setNumeropag(Math.ceil(datos_obtenidos.data.count / elementosPorPagina));
                setMostrarBusqueda(true);
                setGeneral(true);
            }
        } catch (error) {
            resetearBusqueda();
            Swal.fire("No existen resultados con ese nombre de paciente. Ingresa un nombre válido", "", "warning");
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (general && mostrarBusqueda && nombrebuscar !== "") {
            busquedaResultado();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (general && mostrarBusqueda && nombrebuscar !== "") {
                busquedaResultado();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [mostrarBusqueda, general, nombrebuscar, page]);

    // Metodo de busqueda
    const buscarResultadosFecha = async () => {
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
                    // Verificar tipo de usuario
                    if (usuarioC.data.tipo === "tecnico") {
                        const resultadoTecnico = await ResultadoporFechaTecnico(fecha, page);
                        if (resultadoTecnico.data.results.length === 0) {
                            Swal.fire("No existen resultados de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setResultados(resultadoTecnico.data.results);
                            setNumeropag(Math.ceil(resultadoTecnico.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setGeneral(true);
                        }
                    } else {
                        // cargar datos de cursos
                        const resultado = await ResultadoporFecha(fecha, page);
                        if (resultado.data.results.length === 0) {
                            Swal.fire("No existen resultados de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setResultados(resultado.data.results);
                            setNumeropag(Math.ceil(resultado.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setGeneral(true);
                        }
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarResultados();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen resultados de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (estadoBusqueda && general && fecha !== "") {
            buscarResultadosFecha();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (estadoBusqueda && general && fecha !== "") {
                buscarResultadosFecha();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [estadoBusqueda, general, fecha, page]);

    // Metodo de busqueda
    const buscarResultadosRango = async () => {
        // Verificar fecha
        try {
            if (limite !== "") {
                // Verificar usuario
                const usuarioC = await VerificarUsuario();
                if (usuarioC.data.success) {
                    // Verificar tipo de usuario
                    if (usuarioC.data.tipo === "tecnico") {
                        const resultadoTecnicoRango = await ResultadoporRangoTecnico(limite, page);
                        if (resultadoTecnicoRango.data.results.length === 0) {
                            Swal.fire("No existen resultados de ese rango de días. Escoja otro", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setResultados(resultadoTecnicoRango.data.results);
                            setNumeropag(Math.ceil(resultadoTecnicoRango.data.count / elementosPorPagina));
                            setEstadoBusquedaSel(true);
                            setGeneral(true);
                        }
                    } else {
                        // cargar datos de cursos
                        const resultadoRango = await ResultadoporRango(limite, page);
                        if (resultadoRango.data.results.length === 0) {
                            Swal.fire("No existen resultados de ese rango de días. Escoja otro", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setResultados(resultadoRango.data.results);
                            setNumeropag(Math.ceil(resultadoRango.data.count / elementosPorPagina));
                            setEstadoBusquedaSel(true);
                            setGeneral(true);
                        }
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarResultados();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen resultados en el rango especificado. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (limite !== "0" && limite !== "" && estadoBusquedaSel && general) {
            buscarResultadosRango();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (limite !== "0" && limite !== "" && estadoBusquedaSel && general) {
                buscarResultadosRango();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [limite, page]);

    // Metodo de busqueda por cédula
    const buscarResultadoCedula = async () => {
        // Verificar campos vacíos
        if (isEmptyField(cedula)) {
            Swal.fire("Por favor ingrese el campo de cédula", "", "warning");
            return;
        }
        // Validar tamaño de cédula
        if (cedula.length < 10) {
            Swal.fire("La cédula debe tener al menos 10 dígitos", "", "warning");
            resetearBusqueda();
            return;
        }
        // Verificar cédula ingresada
        try {
            if (cedula !== "") {
                const resultadoCedula = await ResultadoporCedula(cedula, page);
                if (resultadoCedula.data.results.length === 0) {
                    Swal.fire("No existen resultados de estudiante con esa cédula. Ingrese una válida.", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setResultadosBusqueda(resultadoCedula.data.results);
                    setNumeropag(Math.ceil(resultadoCedula.data.count / elementosPorPagina));
                    setEstadoBusquedaCR(true);
                    setGeneral(true);
                }
            } else {
                cargarResultados();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen resultados con esa cédula.. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (estadoBusquedaCR && general && cedula !== "") {
            setResultados(resultadosBusqueda);
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (estadoBusquedaCR && general && cedula !== "") {
                setResultados(resultadosBusqueda);
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [estadoBusquedaCR, cedula, general, page]);

    // CONTROLES DE ENTRADA Y SALIDA

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Resetear busqueda
    const resetearBusqueda = () => {
        // Modificación de estados
        setMostrarBusqueda(false);
        setEstadoBusqueda(false);
        setEstadoBusquedaSel(false);
        setEstadoBusquedaCR(false);
        setEscogido(false);
        setEscogido2(false);
        setEscogido3(false);
        setGeneral(false);
        // Modificación de variables de entrada
        setNombreBuscar("");
        setFecha("");
        setLimite("");
        setBusqueda("0");
        setCedula("");
    }

    // Cuando ninguna condición o estado este activo
    useEffect(() => {
        if (!general && !mostrarBusqueda && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaCR
            && nombrebuscar === "" && fecha === "" && limite === "" && cedula === "") {
            cargarResultados();
        }
    }, [page, general, mostrarBusqueda, estadoBusqueda, estadoBusquedaSel, estadoBusquedaCR]);

    // Funcion para validar la entreada
    const cambioEntrada = (e) => {
        const value = e.target.value;
        setNombreBuscar(value);

        if (!validarEntrada(value)) {
            setEntradavaldia(false);
        } else {
            setEntradavaldia(true);
        }
    };

    // Validacion de entrada
    const validarEntrada = (value) => {
        // Control de entrada para cuatro valores
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };

    return (
        <div>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Resultados generales
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

            <div className="mt-3 container alineacion-3" style={{ height: '50px', borderRadius: '10px' }}>
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12 d-flex flex-row">
                        <select
                            className={`form-select h-75 separacion-busqueda tam_op_busqueda
                            ${escogido ? 'w-25' : escogido2 ? 'w-25' : escogido3 ? 'w-25' : 'w-50'
                                }`}
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                // Mostrar el formulario si la opción seleccionada es "1" (Nombre de estudiante)
                                if (e.target.value === "1") {
                                    setEscogido(true);
                                    setEscogido2(false);
                                    setEscogido3(false);
                                } else if (e.target.value === "2") {
                                    setEscogido2(true);
                                    setEscogido(false);
                                    setEscogido3(false);
                                } else if (e.target.value === "3") {
                                    setEscogido3(true);
                                    setEscogido(false);
                                    setEscogido2(false);
                                } else {
                                    setEscogido(false);
                                    setEscogido2(false);
                                    setEscogido3(false);
                                }
                            }}
                        >
                            <option value="0">Buscar por ....</option>
                            <option value="1">Nombre de estudiante</option>
                            <option value="2">Fecha</option>
                            <option value="3">Cédula de identidad</option>
                        </select>
                        {escogido && (
                            <form style={{ width: '380px' }}>
                                <div className="row form-group">
                                    <div className="col-2 d-flex justify-content-center mt-2">
                                        <label htmlFor="nombre" style={{ fontFamily: 'Pacifico' }}
                                        >Nombre:</label>
                                    </div>
                                    <div className="col-10 d-flex flex-row">
                                        <input type="text" className="form-control" id="nombre"
                                            value={nombrebuscar} onChange={cambioEntrada} placeholder="Ingrese nombres y apellidos.**" />
                                        <>
                                            {
                                                mostrarBusqueda
                                                    ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                        X
                                                    </Button>
                                                    : <Button variant="success" className="my-2 my-sm-0" onClick={busquedaResultado} disabled={isTamanio}>
                                                        Vamos
                                                    </Button>
                                            }
                                        </>
                                    </div>
                                </div>
                            </form>
                        )}
                        {
                            escogido2 && (
                                <form style={{ width: '380px' }}>
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
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarResultadosFecha} disabled={isTamanio}>
                                                            Buscar
                                                        </Button>
                                                }
                                            </>
                                        </div>
                                    </div>
                                </form>
                            )}
                        {
                            escogido3 && (
                                <form style={{ width: '380px' }}>
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="cedula" style={{ fontFamily: 'Pacifico' }}>Cédula:</label>
                                        </div>
                                        <div className="col-10 d-flex flex-row">
                                            <input type="text" className="form-control" id="cedula"
                                                placeholder="Ingrese el número de cédula**" name='cedula'
                                                maxLength={10}
                                                value={cedula}
                                                onChange={e => {
                                                    if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                                        setCedula(e.target.value);
                                                    }
                                                }} />
                                            <>
                                                {
                                                    estadoBusquedaCR
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarResultadoCedula} disabled={isTamanio}>
                                                            Buscar
                                                        </Button>
                                                }
                                            </>
                                        </div>
                                    </div>
                                </form>
                            )}
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
                                        value={limite} onChange={(e) => setLimite(e.target.value)} className="form-select tam_op_busqueda"
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
            <ListadodeResultado resultados={resultados} usuario={usuario} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )

}


// Lista de cursos
export function CursoLista({ isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo de los datos
    const [cursos, setCursos] = useState([]);
    const token = localStorage.getItem('token');
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Busqueda
    const [nombrebuscar, setNombreBuscar] = useState("");
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [isTamanio, setIstamanio] = useState(false);
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [generalC, setGeneralC] = useState(false);

    // Datos de curso
    const cargarCursos = async () => {
        try {
            // Verificar usuario
            const usuario_dat = await VerificarUsuario();
            if (usuario_dat.data.success) {
                if (usuario_dat.data.tipo === "comun") {
                    const curso = await CursosUsuarioComun(page);
                    setCursos(curso.data.results);
                    console.log("Son los cursos especificos")
                    if (curso.data.results.length === 0) {
                        setNumeropag(1);
                        setIstamanio(true);
                    } else {
                        setNumeropag(Math.ceil(curso.data.count / elementosPorPagina));
                    }
                } else {
                    const curso_tecnico = await CursoListado(page);
                    setCursos(curso_tecnico.data.results);
                    console.log("Son los cursos generales")
                    if (curso_tecnico.data.results.length === 0) {
                        setNumeropag(1);
                        setIstamanio(true);
                    } else {
                        setNumeropag(Math.ceil(curso_tecnico.data.count / elementosPorPagina));
                    }
                }
            } else {
                if (usuario_dat.data.error) {
                    Swal.fire("Hubo un problema para identificar el usuario", "", "warning");
                    navigate('/login')
                }
            }
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar cursos');
            }
        }
    }

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Busqueda
    const busquedaCurso = async () => {
        // Verificar campos vacíos
        if (isEmptyField(nombrebuscar)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            const datos_obtenidos = await BusquedaCurso(nombrebuscar, page);
            if (datos_obtenidos.data.results.length === 0) {
                Swal.fire("No existen cursos con ese nombre. Ingresa un nombre válido", "", "warning");
                resetearBusqueda();
                return;
            } else {
                setCursos(datos_obtenidos.data.results);
                setNumeropag(Math.ceil(datos_obtenidos.data.count / elementosPorPagina));
                setMostrarBusqueda(true);
                setGeneralC(true);
            }
        } catch (error) {
            Swal.fire("No existen cursos con ese nombre. Ingresa un nombre válido", "", "warning");
        }
    }

    // Estado de los datos
    useEffect(() => {
        if (generalC && mostrarBusqueda && nombrebuscar !== "") {
            busquedaCurso();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalC && mostrarBusqueda && nombrebuscar !== "") {
                busquedaCurso();
            }
        }, 12000000); // 20 minutos
        return () => clearInterval(interval);
    }, [mostrarBusqueda, generalC, nombrebuscar, page]);

    // Metodo de busqueda
    const buscarCursosFecha = async () => {
        // Verificar campos vacíos
        if (isEmptyField(fecha)) {
            resetearBusqueda();
            Swal.fire("Por favor ingrese el campo de fecha", "", "warning");
            return;
        }
        // Verificar fecha
        try {
            if (fecha !== "") {
                // Verificar usuario
                const usuarioC = await VerificarUsuario();
                if (usuarioC.data.success) {
                    // Verificar tipo de usuario
                    if (usuarioC.data.tipo === "tecnico") {
                        const cursoTecnico = await CursoporFechaTecnico(fecha, page);
                        if (cursoTecnico.data.results.length === 0) {
                            Swal.fire("No existen cursos de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setCursos(cursoTecnico.data.results);
                            setNumeropag(Math.ceil(cursoTecnico.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setGeneralC(true);
                        }
                    } else {
                        // cargar datos de cursos
                        const curso = await CursoporFecha(fecha, page);
                        if (curso.data.results.length === 0) {
                            Swal.fire("No existen cursos de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setCursos(curso.data.results);
                            setNumeropag(Math.ceil(curso.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setGeneralC(true);
                        }
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarCursos();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen cursos de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (generalC && estadoBusqueda && fecha !== "") {
            buscarCursosFecha();

        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalC && estadoBusqueda && fecha !== "") {
                buscarCursosFecha();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [estadoBusqueda, generalC, fecha, page]);

    // Manejo del estado de los datos
    useEffect(() => {
        if (!generalC && !estadoBusqueda && !mostrarBusqueda && nombrebuscar === "" && fecha === "") {
            cargarCursos();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (!generalC && !estadoBusqueda && !mostrarBusqueda && nombrebuscar === "" && fecha === "") {
                cargarCursos();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [generalC, estadoBusqueda, mostrarBusqueda, page]);

    // CONTROLES DE ENTRADA Y SALIDA

    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Resetear busqueda
    const resetearBusqueda = () => {
        setGeneralC(false);
        setMostrarBusqueda(false);
        setNombreBuscar("");
        setEstadoBusqueda(false);
        setFecha("");
    }

    return (
        <div>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Cursos
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
            <div className="mt-2 container alineacion-triple" style={{ height: '50px', borderRadius: '10px' }}>
                <div className="d-flex flex-row justify-content-left w-100" style={{ alignItems: 'center', marginLeft: '1px' }}>
                    <a className="m-2" style={{ fontFamily: 'Pacifico' }}>Buscar:</a>
                    <form className="d-flex flex-row justify-content-between w-50">
                        <input className="form-control mr-sm-2 w-100" type="search" name="nombre" id="nombre"
                            placeholder="Nombre del curso.." aria-label="Search" value={nombrebuscar}
                            onChange={e => setNombreBuscar(e.target.value)} disabled={isTamanio} />
                        <>
                            {
                                mostrarBusqueda
                                    ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                        X
                                    </Button>
                                    : <Button variant="success" className="my-2 my-sm-0" onClick={busquedaCurso} disabled={isTamanio}>
                                        Vamos
                                    </Button>
                            }
                        </>
                    </form>
                </div>
                <div style={{ marginTop: '5%' }}>
                    <div className="col-md-12">
                        <form>
                            <div className="form-group d-flex justify-content-between">
                                <div className="mt-2 text-right">
                                    <a style={{ fontFamily: 'Pacifico' }}> Fecha:</a>
                                </div>
                                <div className="d-flex flex-row">
                                    <input type="date" className="form-control" id="fecha"
                                        value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                    <>
                                        {
                                            estadoBusqueda
                                                ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                    X
                                                </Button>
                                                : <Button variant="success" className="my-2 my-sm-0" onClick={buscarCursosFecha} disabled={isTamanio}>
                                                    Buscar
                                                </Button>
                                        }
                                    </>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Table */}
            <ListadodeCursos cursos={cursos} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )

}



// Lista de salas creadas
export function SalaLista({ usuario, isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [salas, setSalas] = useState([]);
    const [isTamanio, setIstamanio] = useState(false);
    const [nombrebuscar, setNombreBuscar] = useState("");
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [salasAA, setSalasAA] = useState(false);

    // Obtener resultados
    const cargarSala = async () => {
        try {
            // Verificar usuario
            const usuario_dat = await VerificarUsuario();
            if (usuario_dat.data.success) {
                if (usuario_dat.data.tipo === "tecnico") {
                    const sala_tecnico = await SalaListado(page);
                    setSalas(sala_tecnico.data.results);
                    if (sala_tecnico.data.results.length === 0) {
                        setIstamanio(true);
                        setNumeropag(1);
                    } else {
                        setNumeropag(Math.ceil(sala_tecnico.data.count / elementosPorPagina));
                    }
                } else {
                    const sala = await SalasUsuarioComun(usuario_dat.data.identificador, page);
                    setSalas(sala.data.results);
                    if (sala.data.results.length === 0) {
                        setIstamanio(true);
                        setNumeropag(1);
                    } else {
                        setNumeropag(Math.ceil(sala.data.count / elementosPorPagina));
                    }
                }
            } else {
                if (usuario_dat.data.error) {
                    Swal.fire("Hubo un problema para identificar el usuario", "", "warning");
                    navigate('/login')
                }
            }
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar las salas');
            }
        }
    }

    // Busqueda
    const busquedaSalaNombre = async () => {
        // Verificar campos vacíos
        if (isEmptyField(nombrebuscar)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            const busqueda_sala = await BusquedaSalas(nombrebuscar, page);
            if (busqueda_sala.data.results.length === 0) {
                Swal.fire("No existen salas con ese nombre. Ingresa un nombre válido", "", "warning");
                resetearBusqueda();
                return;
            } else {
                setSalas(busqueda_sala.data.results);
                setNumeropag(Math.ceil(busqueda_sala.data.count / elementosPorPagina));
                setMostrarBusqueda(true);
                setSalasAA(true);
            }
        } catch (error) {
            Swal.fire("No existe una sala con ese nombre. Ingresa un nombre válido", "", "warning");
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (salasAA && mostrarBusqueda && nombrebuscar !== "") {
            busquedaSalaNombre();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (salasAA && mostrarBusqueda && nombrebuscar !== "") {
                busquedaSalaNombre();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [mostrarBusqueda, salasAA, nombrebuscar, page]);

    // Metodo de busqueda
    const buscarSalasFecha = async () => {
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
                    // Verificar tipo de usuario
                    if (usuarioC.data.tipo === "tecnico") {
                        const salaTecnico = await SalaFecha(fecha, page);
                        if (salaTecnico.data.results.length === 0) {
                            Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setSalas(salaTecnico.data.results);
                            setNumeropag(Math.ceil(salaTecnico.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setSalasAA(true);
                        }
                    } else {
                        // cargar datos de cursos
                        const sala = await SalaporFecha(fecha, usuarioC.data.identificador, page);
                        if (sala.data.results.length === 0) {
                            Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setSalas(sala.data.results);
                            setNumeropag(Math.ceil(sala.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setSalasAA(true);
                        }
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarSala();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen salas de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (salasAA && estadoBusqueda && fecha !== "") {
            buscarSalasFecha(); // Busqueda por fecha
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (salasAA && estadoBusqueda && fecha !== "") {
                buscarSalasFecha(); // Busqueda por fecha
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [estadoBusqueda, salasAA, fecha, page]);

    // Listado principal
    useEffect(() => {
        if (!salasAA && !estadoBusqueda && !mostrarBusqueda && nombrebuscar === "" && fecha === "") {
            cargarSala();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (!salasAA && !estadoBusqueda && !mostrarBusqueda && nombrebuscar === "" && fecha === "") {
                cargarSala();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [salasAA, estadoBusqueda, mostrarBusqueda, page]);

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
        // Control de estados
        setMostrarBusqueda(false);
        setEstadoBusqueda(false);
        setSalasAA(false);
        // Control de variables
        setNombreBuscar("");
        setFecha("");
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
                                Salas creadas
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
            <div className="mt-2 container alineacion-triple" style={{ height: '50px', borderRadius: '10px' }}>
                <div className="d-flex flex-row justify-content-left w-100" style={{ alignItems: 'center', marginLeft: '1px' }}>
                    <a className="m-2" style={{ fontFamily: 'Pacifico' }}>Buscar:</a>
                    <form className="d-flex flex-row justify-content-between w-50">
                        <input className="form-control mr-sm-2 w-100" type="search" name="nombre" id="nombre"
                            placeholder="Nombre de sala.. Ejm: Sala 1" aria-label="Search" value={nombrebuscar}
                            onChange={e => setNombreBuscar(e.target.value)} disabled={isTamanio} />
                        <>
                            {
                                mostrarBusqueda
                                    ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                        X
                                    </Button>
                                    : <Button variant="success" className="my-2 my-sm-0" onClick={busquedaSalaNombre} disabled={isTamanio}>
                                        Vamos
                                    </Button>
                            }
                        </>
                    </form>
                </div>
                <div className="alineacion-lista-busqueda" style={{ marginTop: '5%' }}>
                    <div className="col-md-12">
                        <form>
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
                                                : <Button variant="success" className="my-2 my-sm-0" onClick={buscarSalasFecha} disabled={isTamanio}>
                                                    Buscar
                                                </Button>
                                        }
                                    </>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Table */}
            <ListadodeSala salas={salas} usuario={usuario} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )
}



// Lista de salas de paciente
export function SalaPacienteLista({ isActive }) {
    // Busqueda sala
    const [codigosala, setCodigo] = useState("");
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [salas, setSalas] = useState([]);
    const token = localStorage.getItem('token');
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;

    // Obtener resultados
    const cargarSalaPaciente = async () => {
        try {
            // Verificar usuario
            const usuario_dat = await VerificarUsuario();
            if (usuario_dat.data.success) {
                // Cargar datos de salas
                const sala = await SalasPaciente(usuario_dat.data.identificador, page);
                setSalas(sala.data.results);
                if (sala.data.results.length === 0) {
                    setNumeropag(1);
                } else {
                    setNumeropag(Math.ceil(sala.data.count / elementosPorPagina));
                }
            } else {
                if (usuario_dat.data.error) {
                    Swal.fire("Hubo un problema para identificar el usuario", "", "warning");
                    navigate('/login')
                }
            }

        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar las salas');
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (token) {
            cargarSalaPaciente();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            cargarSalaPaciente();
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [page]);

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Busqueda
    const busquedaContenido = async (e) => {
        // Verificar campos vacíos
        if (!isValidForm()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            let datos_obtenidos = await AccederSala(codigosala);
            if (datos_obtenidos.data.success) {
                setMostrarBusqueda(true);
                navigate(`/individual/nuevo/${datos_obtenidos.data.slug}`);
            } else {
                if (datos_obtenidos.data.error) {
                    Swal.fire(datos_obtenidos.data.error, "", "warning");
                } else {
                    Swal.fire("No existen contenidos con ese código. Ingresa uno válido", "", "warning");
                }
            }
        } catch (error) {
            Swal.fire("No existen contenidos con ese código. Ingresa uno válido", "", "warning");
        }
    }

    // Campos vacios
    const isValidForm = () => {
        if (
            !codigosala ||
            codigosala === 0
        ) {
            return false;
        }
        return true;
    }

    return (
        <div>
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Salas de estudiante
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
            {/* Busqueda de actividad mediante el codigo */}
            <div className="d-flex flex-row mt-4">
                <div className="card-body">
                    <form className="d-flex flex-row" >
                        <div className="input-group" style={{ marginLeft: '8%', width: '85%' }}>
                            <input type="search" className="form-control rounded" placeholder="Inserta código de sala"
                                aria-label="Search" aria-describedby="search-addon" value={codigosala}
                                onChange={e => {
                                    const entrada = e.target.value;
                                    const numero = Number(entrada);
                                    if (numero >= 0 || entrada === "") {
                                        setCodigo(entrada);
                                    }
                                }
                                } />
                            <>
                                {
                                    !mostrarBusqueda
                                        ? <Button variant="success" className="my-2 my-sm-0"
                                            onClick={() => {
                                                Swal.fire({
                                                    title: '¿Está seguro que desea acceder a la actividad?',
                                                    text: "Si, acceder",
                                                    icon: 'info',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#d33',
                                                    confirmButtonText: 'Sí',
                                                }).then(async (result) => {
                                                    if (result.isConfirmed) {
                                                        await busquedaContenido();
                                                    }
                                                })
                                            }}
                                        >
                                            Buscar
                                        </Button>
                                        :
                                        <></>
                                }
                            </>
                        </div>
                    </form>
                </div>
            </div>
            {/* Table */}
            <ListadodeSalaPaciente salas={salas} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )
}



// Lista de salas creadas
export function SalaListaAtendidas({ usuario, isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [salas, setSalas] = useState([]);
    const [isTamanio, setIstamanio] = useState(false);
    const [nombrebuscar, setNombreBuscar] = useState("");
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [salasAA, setSalasAA] = useState(false);

    // Obtener resultados
    const cargarSalaAtendi = async () => {
        try {
            // Verificar usuario
            const usuario_dat = await VerificarUsuario();
            if (usuario_dat.data.success) {
                let sala = await SalasUsuarioComunAtendidas(usuario_dat.data.identificador, page);
                setSalas(sala.data.results);
                if (sala.data.results.length === 0) {
                    setIstamanio(true);
                    setNumeropag(1);
                } else {
                    setNumeropag(Math.ceil(sala.data.count / elementosPorPagina));
                }
            } else {
                if (usuario_dat.data.error) {
                    Swal.fire("Hubo un problema para identificar el usuario", "", "warning");
                    navigate('/login')
                }
            }

        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar las salas');
            }
        }
    }

    // Busqueda
    const busquedaDeSala = async () => {
        // Verificar campos vacíos
        if (isEmptyField(nombrebuscar)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            const busqueda_sala = await BusquedaSalas(nombrebuscar, page);
            if (busqueda_sala.data.results.length === 0) {
                Swal.fire("No existen salas con ese nombre. Ingresa un nombre válido", "", "warning");
                resetearBusqueda();
                return;
            } else {
                setSalas(busqueda_sala.data.results);
                setNumeropag(Math.ceil(busqueda_sala.data.count / elementosPorPagina));
                setMostrarBusqueda(true);
                setSalasAA(true);
            }
        } catch (error) {
            Swal.fire("No existe una sala con ese nombre. Ingresa un nombre válido", "", "warning");
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (salasAA && mostrarBusqueda && nombrebuscar !== "") {
            busquedaDeSala();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (salasAA && mostrarBusqueda && nombrebuscar !== "") {
                busquedaDeSala();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [mostrarBusqueda, salasAA, nombrebuscar, page]);

    // Metodo de busqueda
    const buscarSalasFechaAtendidas = async () => {
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
                    // cargar datos de salas atendidas por busqueda
                    const salatendias = await SalaporFechaAtendida(fecha, usuarioC.data.identificador, page);
                    if (salatendias.data.results.length === 0) {
                        Swal.fire("No existen peticiones de esa fecha. Ingresa una válida", "", "warning");
                        resetearBusqueda();
                        return;
                    } else {
                        setSalas(salatendias.data.results);
                        setNumeropag(Math.ceil(salatendias.data.count / elementosPorPagina));
                        setEstadoBusqueda(true);
                        setSalasAA(true);
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarSalaAtendi();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen salas de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (salasAA && estadoBusqueda && fecha !== "") {
            buscarSalasFechaAtendidas();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (salasAA && estadoBusqueda && fecha !== "") {
                buscarSalasFechaAtendidas();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [estadoBusqueda, salasAA, fecha, page]);

    // Listado principal
    useEffect(() => {
        if (!salasAA && !estadoBusqueda && !mostrarBusqueda && nombrebuscar === "" && fecha === "") {
            cargarSalaAtendi();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (!salasAA && !estadoBusqueda && !mostrarBusqueda && nombrebuscar === "" && fecha === "") {
                cargarSalaAtendi();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);
    }, [salasAA, estadoBusqueda, mostrarBusqueda, page]);

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
        // Control de estados
        setSalasAA(false);
        setMostrarBusqueda(false);
        setEstadoBusqueda(false);
        // Control de variable
        setNombreBuscar("");
        setFecha("");
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
                                Salas atendidas
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
            <div className="mt-2 container alineacion-triple" style={{ height: '50px', borderRadius: '10px' }}>
                <div className="d-flex flex-row justify-content-left w-100" style={{ alignItems: 'center', marginLeft: '1px' }}>
                    <a className="m-2" style={{ fontFamily: 'Pacifico' }}>Buscar:</a>
                    <form className="d-flex flex-row justify-content-between w-50">
                        <input className="form-control mr-sm-2 w-100" type="search" name="nombre" id="nombre"
                            placeholder="Nombre de sala.. Ejm: Sala 1" aria-label="Search" value={nombrebuscar}
                            onChange={e => setNombreBuscar(e.target.value)} disabled={isTamanio} />
                        <>
                            {
                                mostrarBusqueda
                                    ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                        X
                                    </Button>
                                    : <Button variant="success" className="my-2 my-sm-0" onClick={busquedaDeSala} disabled={isTamanio}>
                                        Vamos
                                    </Button>
                            }
                        </>
                    </form>
                </div>
                <div className="alineacion-lista-busqueda" style={{ marginTop: '5%' }}>
                    <div className="col-md-12">
                        <form>
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
                                                : <Button variant="success" className="my-2 my-sm-0" onClick={buscarSalasFechaAtendidas} disabled={isTamanio}>
                                                    Buscar
                                                </Button>
                                        }
                                    </>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Table */}
            <ListadodeSala salas={salas} usuario={usuario} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )
}



// Lista de reportes
export function ReporteLista({ usuario, isActive }) {
    // Paginacion
    const [page, setPage] = useState(1);
    // Fin paginacion
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [reportes, setReportes] = useState([]);
    const [numeroPag, setNumeropag] = useState(1);
    const elementosPorPagina = 8;
    // BUSQUEDA
    const [nombrebuscar, setNombreBuscar] = useState("");
    const [isTamanio, setIstamanio] = useState(false);
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
    const [entradaValida, setEntradavaldia] = useState(true);
    // Filtro de fecha
    const [fecha, setFecha] = useState("");
    const [limite, setLimite] = useState("");
    const [cedula, setCedula] = useState("");
    const [estadoBusqueda, setEstadoBusqueda] = useState(false);
    const [estadoBusquedaSel, setEstadoBusquedaSel] = useState(false);
    const [estadoBusquedaCedu, setEstadoBusquedaCedu] = useState(false);
    const [generalR, setGeneralR] = useState(false);
    // Escoger busqueda
    const [busqueda, setBusqueda] = useState("0");
    const [escogido, setEscogido] = useState(false);
    const [escogido2, setEscogido2] = useState(false);
    const [escogido3, setEscogido3] = useState(false);

    // Obtener resultados
    const cargarReporte = async () => {
        try {
            // Verificar usuario
            const usuario_dat = await VerificarUsuario();
            if (usuario_dat.data.tipo === "tecnico") {
                const reporte_tecnico = await ReporteListado(page);
                if (reporte_tecnico.data.results.length === 0) {
                    setIstamanio(true);
                    setNumeropag(1);
                } else {
                    setReportes(reporte_tecnico.data.results);
                    setNumeropag(Math.ceil(reporte_tecnico.data.count / elementosPorPagina));
                }
            } else {
                const reporte = await ReporteListadoUsuarioComun(usuario_dat.data.identificador, page);
                if (reporte.data.results.length === 0) {
                    setIstamanio(true);
                    setNumeropag(1);
                } else {
                    setReportes(reporte.data.results);
                    setNumeropag(Math.ceil(reporte.data.count / elementosPorPagina));
                }
            }
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar los reportes');
            }
        }
    }

    // BUSQUEDA
    // Metodo de busqueda
    const busquedaReporte = async () => {
        // Verificar campos vacíos
        if (isEmptyField(nombrebuscar)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Entrada
        if (!entradaValida) {
            Swal.fire("Por favor ingrese el formato: Nombres Apellidos", "", "warning");
            return;
        }
        // Flujo normal
        try {
            const datos_obtenidos_repor = await ReportesPaciente(nombrebuscar, page);
            if (datos_obtenidos_repor.data.results.length === 0) {
                Swal.fire("No existen reportes con ese nombre de paciente. Ingresa un nombre válido", "", "warning");
                resetearBusqueda();
                return;
            } else {
                setReportes(datos_obtenidos_repor.data.results);
                setNumeropag(Math.ceil(datos_obtenidos_repor.data.count / elementosPorPagina));
                setMostrarBusqueda(true);
                setGeneralR(true);
            }
        } catch (error) {
            Swal.fire("No existen reportes con ese nombre de paciente. Ingresa un nombre válido", "", "warning");
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (generalR && mostrarBusqueda && nombrebuscar !== "") {
            busquedaReporte();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalR && mostrarBusqueda && nombrebuscar !== "") {
                busquedaReporte();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [mostrarBusqueda, generalR, nombrebuscar, page]);

    // Metodo de busqueda
    const buscarReportesFecha = async () => {
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
                    // Verificar tipo de usuario
                    if (usuarioC.data.tipo === "tecnico") {
                        const reporteTecnico = await ReporteporFechaTecnico(fecha, page);
                        if (reporteTecnico.data.results.length === 0) {
                            Swal.fire("No existen reportes de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setReportes(reporteTecnico.data.results);
                            setNumeropag(Math.ceil(reporteTecnico.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setGeneralR(true);
                        }
                    } else {
                        // cargar datos de cursos
                        const reporte = await ReporteporFecha(fecha, page);
                        if (reporte.data.results.length === 0) {
                            Swal.fire("No existen reportes de esa fecha. Ingresa una válida", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setReportes(reporte.data.results);
                            setNumeropag(Math.ceil(reporte.data.count / elementosPorPagina));
                            setEstadoBusqueda(true);
                            setGeneralR(true);
                        }
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarReporte();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen reportes de esa fecha. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (generalR && estadoBusqueda && fecha !== "") {
            buscarReportesFecha();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalR && estadoBusqueda && fecha !== "") {
                buscarReportesFecha();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [estadoBusqueda, generalR, fecha, page]);

    // Metodo de busqueda
    const buscarReporteRango = async () => {
        // Verificar fecha
        try {
            if (limite !== "") {
                // Verificar usuario
                const usuarioC = await VerificarUsuario();
                if (usuarioC.data.success) {
                    // Verificar tipo de usuario
                    if (usuarioC.data.tipo === "tecnico") {
                        const reporTecnicoRango = await ReporteporRangoTecnico(limite, page);
                        if (reporTecnicoRango.data.results.length === 0) {
                            Swal.fire("No existen reportes de ese rango de días. Escoja otro", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setReportes(reporTecnicoRango.data.results);
                            setNumeropag(Math.ceil(reporTecnicoRango.data.count / elementosPorPagina));
                            setEstadoBusquedaSel(true);
                            setGeneralR(true);
                        }
                    } else {
                        // cargar datos de cursos
                        const reporteRango = await ReporteporRango(limite, page);
                        if (reporteRango.data.results.length === 0) {
                            Swal.fire("No existen reportes de ese rango de días. Escoja otro", "", "warning");
                            resetearBusqueda();
                            return;
                        } else {
                            setReportes(reporteRango.data.results);
                            setNumeropag(Math.ceil(reporteRango.data.count / elementosPorPagina));
                            setEstadoBusquedaSel(true);
                            setGeneralR(true);
                        }
                    }
                } else {
                    navigate('/login');
                }
            } else {
                cargarReporte();
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen reportes en el rango especificadooo. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (limite !== "0" && limite !== "" && estadoBusquedaSel) {
            buscarReporteRango();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (limite !== "0" && limite !== "" && estadoBusquedaSel) {
                buscarReporteRango();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [limite, page]);

    // Metodo de busqueda
    const buscarReporteCedula = async () => {
        // Verificar campos vacíos
        if (isEmptyField(cedula)) {
            Swal.fire("Por favor ingrese el campo de cédula", "", "warning");
            return;
        }
        // Validar tamaño de cédula
        if (cedula.length < 10) {
            Swal.fire("La cédula debe tener al menos 10 dígitos", "", "warning");
            resetearBusqueda();
            return;
        }
        // Verificar fecha
        try {
            if (cedula !== "") {
                const reporTecnicoCedula = await ReporteporCedula(cedula, page);
                if (reporTecnicoCedula.data.results.length === 0) {
                    Swal.fire("No existen reportes de estudiante con esa cédula. Ingrese uno válido.", "", "warning");
                    resetearBusqueda();
                    return;
                } else {
                    setReportes(reporTecnicoCedula.data.results);
                    setNumeropag(Math.ceil(reporTecnicoCedula.data.count / elementosPorPagina));
                    setEstadoBusquedaCedu(true);
                    setGeneralR(true);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                Swal.fire("No existen reportes con esa cédula.. Ingresa una válida", "", "warning");
            }
        }
    }

    // Manejo del estado de los datos
    useEffect(() => {
        if (generalR && estadoBusquedaCedu && cedula !== "") {
            buscarReporteCedula();
        }
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            if (generalR && estadoBusquedaCedu && cedula !== "") {
                buscarReporteCedula();
            }
        }, 1200000); // 20 minutos
        return () => clearInterval(interval);

    }, [estadoBusquedaCedu, generalR, cedula, page]);

    // VALIDACIONES DE ENTRADA Y SALIDA DE DATOS

    // Funcion para validar la entreada
    const cambioEntrada = (e) => {
        const value = e.target.value;
        setNombreBuscar(value);

        if (!validarEntrada(value)) {
            setEntradavaldia(false);
        } else {
            setEntradavaldia(true);
        }
    };
    // Validacion de entrada
    const validarEntrada = (value) => {
        // Control de entrada para cuatro valores
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }
    // Resetear busqueda
    const resetearBusqueda = () => {
        // Rectificar estados
        setGeneralR(false);
        setMostrarBusqueda(false);
        setEstadoBusqueda(false);
        setEstadoBusquedaSel(false);
        setEstadoBusquedaCedu(false);
        setEscogido(false);
        setEscogido2(false);
        setEscogido3(false);
        // Rectificar campos
        setNombreBuscar("");
        setFecha("");
        setLimite("");
        setBusqueda("0");
        setCedula("");
    }

    // Cuando ninguna condición o estado este activo
    useEffect(() => {
        if (!generalR && !mostrarBusqueda && !estadoBusqueda && !estadoBusquedaSel && !estadoBusquedaCedu
            && nombrebuscar === "" && fecha === "" && limite === "" && cedula === "") {
            cargarReporte();
        }
    }, [generalR, mostrarBusqueda, estadoBusqueda, estadoBusquedaSel, estadoBusquedaCedu, page]);

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
                                Reportes creadas
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
            <div className="mt-3 container alineacion-3" style={{ height: '50px', borderRadius: '10px' }}>
                <div className="alineacion-lista-busqueda">
                    <div className="col-md-12 d-flex flex-row">
                        <select
                            className={`form-select h-75 separacion-busqueda tam_op_busqueda
                            ${escogido ? 'w-25' : escogido2 ? 'w-25' :
                                    escogido3 ? 'w-25' : 'w-50'
                                }`}
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                // Mostrar el formulario si la opción seleccionada es "1" (Nombre de estudiante)
                                if (e.target.value === "1") {
                                    setEscogido(true);
                                    setEscogido2(false);
                                    setEscogido3(false);
                                } else if (e.target.value === "2") {
                                    setEscogido2(true);
                                    setEscogido(false);
                                    setEscogido3(false);
                                } else if (e.target.value === "3") {
                                    setEscogido3(true);
                                    setEscogido2(false);
                                    setEscogido(false);
                                } else {
                                    setEscogido(false);
                                    setEscogido2(false);
                                    setEscogido3(false);
                                }
                            }}

                        >
                            <option value="0">Buscar por....</option>
                            <option value="1">Nombre de estudiante</option>
                            <option value="2">Fecha</option>
                            <option value="3">Número de cédula</option>
                        </select>
                        {escogido && (
                            <form style={{ width: '380px' }}>
                                <div className="row form-group">
                                    <div className="col-2 d-flex justify-content-center mt-2">
                                        <label htmlFor="nombre" style={{ fontFamily: 'Pacifico' }}
                                        >Nombre:</label>
                                    </div>
                                    <div className="col-10 d-flex flex-row">
                                        <input type="text" className="form-control" id="nombre"
                                            value={nombrebuscar} onChange={cambioEntrada} placeholder="Ingrese nombres y apellidos**" />
                                        <>
                                            {
                                                mostrarBusqueda
                                                    ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                        X
                                                    </Button>
                                                    : <Button variant="success" className="my-2 my-sm-0" onClick={busquedaReporte} disabled={isTamanio}>
                                                        Vamos
                                                    </Button>
                                            }
                                        </>
                                    </div>
                                </div>
                            </form>
                        )}
                        {
                            escogido2 && (
                                <form style={{ width: '380px' }}>
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
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarReportesFecha} disabled={isTamanio}>
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
                            escogido3 && (
                                <form style={{ width: '380px' }}>
                                    <div className="row form-group">
                                        <div className="col-2 d-flex justify-content-center mt-2">
                                            <label htmlFor="cedula" style={{ fontFamily: 'Pacifico' }}>Cédula:</label>
                                        </div>
                                        <div className="col-10 d-flex flex-row">
                                            <input type="text" className="form-control" id="cedula"
                                                placeholder="Ingrese el número de cédula**" name='cedula'
                                                maxLength={10}
                                                value={cedula}
                                                onChange={e => {
                                                    if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                                        setCedula(e.target.value);
                                                    }
                                                }} />
                                            <>
                                                {
                                                    estadoBusquedaCedu
                                                        ? <Button variant="danger" className="my-2 my-sm-0" onClick={resetearBusqueda}>
                                                            X
                                                        </Button>
                                                        : <Button variant="success" className="my-2 my-sm-0" onClick={buscarReporteCedula} disabled={isTamanio}>
                                                            Buscar
                                                        </Button>
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
                                        value={limite} onChange={(e) => setLimite(e.target.value)} className="form-select tam_op_busqueda"
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
            <ListadodeReportes reportes={reportes} usuario={usuario} page={page} setPage={setPage} numeroPag={numeroPag} isActive={isActive} />
        </div>
    )

}

