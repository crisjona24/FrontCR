// Estilos
//import "../../styles/Cabecera.css";
import "bootstrap/dist/css/bootstrap.min.css"
// Componentes
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Metodos
import { VerificarDominio, DominioIndividual } from "../../api/dominio.api";
import { PeticionIndividual } from "../../api/peticion.api";
import { Dominio } from "./general__tarjeta/TarjetaGeneral";
import { VerificarContenido, ContenidoIndividual } from "../../api/contenido.api";
import { Contenido } from "./general__tarjeta/TarjetaGeneral";
import { VerificarContenidoIndividual, ContenidoDatosIndividual } from "../../api/contenidoindividual.api";
import { Individual, Peticion, Paciente, Aplicacion, Reporte, Resultado } from "./general__tarjeta/TarjetaGeneral";
import { PacienteIndividual, FechaInscripcionCurso } from "../../api/usuario.api";
import { ReporteIndividual } from "../../api/reporte.api";
import { ResultadoIndividual } from "../../api/resultado.api";


// Tarjeta de dominio
export function TarjetaDominio() {
    /* *** Control de datos *** */
    let { slug } = useParams();
    const [error, setError] = useState("");
    const [datos, setDatos] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Datos
    const obtenerDatosDominio = async () => {
        // Promesa
        if (!token) {
            navigate('/login');
        }
        // Flujo normal
        try {
            const cont = await VerificarDominio(slug);
            if (cont.data.identificador) {
                // Obtener los datos del dominio
                const domi = await DominioIndividual(cont.data.identificador);
                setDatos(domi.data);
                console.log(domi.data)
            } else {
                if (cont.data.error) {
                    mostrarError(cont.data.error);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al mostrar los datos de dominio');
            }
        }
    }

    // Obtener datos
    useEffect(() => {
        if (token) {
            obtenerDatosDominio();
        }
    }, [slug]);

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
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
                <Dominio datos={datos} />
            </>
        </div>
    )

}

// Tarjeta de contenido
export function TarjetaDatosContenido() {
    /* *** Control de datos *** */
    let { slug } = useParams();
    const [error, setError] = useState("");
    const [datos, setDatos] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Datos
    const obtenerDatosContenido = async () => {
        // Promesa
        if (!token) {
            navigate('/login');
        }
        // Flujo normal
        try {
            const cont = await VerificarContenido(slug);
            console.log(cont.data)
            if (cont.data.identificador) {
                // Obtener los datos del dominio
                const domi = await ContenidoIndividual(cont.data.identificador);
                setDatos(domi.data);
                console.log(domi.data)
            } else {
                if (cont.data.error) {
                    mostrarError(cont.data.error);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al mostrar los datos de contenido');
            }
        }
    }

    // Obtener datos
    useEffect(() => {
        if (token) {
            obtenerDatosContenido();
        }
    }, [slug]);

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
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
            </>
            <Contenido datos={datos} slug={slug} />
        </div>
    )

}

// Tarjeta de contenido individual
export function TarjetaDatosIndividual() {
    /* *** Control de datos *** */
    let { slug } = useParams();
    const [error, setError] = useState("");
    const [datos, setDatos] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Datos
    const obtenerDatosContenidoI = async () => {
        // Promesa
        if (!token) {
            navigate('/login');
        }
        // Flujo normal
        try {
            const cont = await VerificarContenidoIndividual(slug);
            console.log(cont.data)
            if (cont.data.identificador) {
                // Obtener los datos del dominio
                const domi = await ContenidoDatosIndividual(cont.data.identificador);
                setDatos(domi.data);
            } else {
                if (cont.data.error) {
                    mostrarError(cont.data.error);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al mostrar los datos de actividad');
            }
        }
    }

    useEffect(() => {
        if (token) {
            obtenerDatosContenidoI();
        }
    }, [slug]);

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
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
                <Individual datos={datos} slug={slug} />
            </>
        </div>
    )

}

// Tarjeta de peticion
export function TarjetaPeticion() {
    // Obtener el parametro de la URL
    let { id } = useParams();
    /* *** Form **** */
    const [datos, setDatos] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Obtener datos
    const obtenerDatosPeticion = async () => {
        try {
            // Buscar la peticion
            const cont = await PeticionIndividual(id);
            setDatos(cont.data);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de petición');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (token) {
            obtenerDatosPeticion();
        }
    }, [id]);

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
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
                <Peticion datos={datos} />
            </>
        </div>
    )

}

// Tarjeta paciente
export function TarjetaPaciente() {
    // Obtener el parametro de la URL
    let { id } = useParams();
    /* *** Form **** */
    const [datosPaciente, setDatosP] = useState([]);
    const [fechaIns, setFechaIns] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Obtener datos
    const obtenerDatosPaciente = async () => {
        try {
            // Buscar los datos de paciente
            const contP = await PacienteIndividual(id);
            setDatosP(contP.data);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos de estudiante');
            }
        }
    }

    // Obtener fecha de inscripcion
    const obtenerFecha = async () => {
        try {
            let fecha = await FechaInscripcionCurso(id);
            if (fecha.data.success) {
                setFechaIns(fecha.data.fecha_inscripcion);
            } else {
                if (fecha.data.message === "NOT_AUTHENTICATED") {
                    navigate('/login');
                } else if (fecha.data.error) {
                    Swal.fire(fecha.data.error, "", "warning");
                    navigate('/login');
                } else {
                    navigate('/login');
                }
            }

        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosPaciente();
        }
    }, [id]);

        // Use effect
        useEffect(() => {
            if (!token) {
                navigate('/login');
            } else {
                obtenerFecha();
            }
        }, [id]);

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
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
                <Paciente datosPaciente={datosPaciente} fecha={fechaIns}/>
            </>
        </div>
    )
}

// Tarjeta de aplicacion
export function TarjetaAplicacion() {
    return (
        <div>
            <Aplicacion />
        </div>
    )
}


// Tarjeta de reporte
export function TarjetaReporte() {
    // Obtener el parametro de la URL
    let { id } = useParams(); // ID del reporte
    /* *** Form **** */
    const [datosReporte, setDatosReporte] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Token de usuario

    // Obtener datos
    const obtenerDatosReporte = async () => {
        try {
            // Buscar los datos de paciente
            const contReporte = await ReporteIndividual(id);
            setDatosReporte(contReporte.data);
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos del reporte');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosReporte();
        }
    }, [id]);

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
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
                <Reporte datosReporte={datosReporte} />
            </>
        </div>
    )
}

// Tarjeta de resultado
export function TarjetaResultado() {
    // Obtener el parametro de la URL
    let { id } = useParams(); // ID del reporte
    /* *** Form **** */
    const [datosResultado, setDatosResultado] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Token de usuario

    // Obtener datos
    const obtenerDatosResultado = async () => {
        try {
            // Buscar los datos de paciente
            const contResultado = await ResultadoIndividual(id);
            setDatosResultado(contResultado.data);
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar datos del reporte');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            obtenerDatosResultado();
        }
    }, [id]);

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
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
                <Resultado datosResultado={datosResultado} />
            </>
        </div>
    )
}