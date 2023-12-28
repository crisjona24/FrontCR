// Estilos
import "../../styles/Nivel.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Image } from "react-bootstrap";
// Componentes
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
// Metodos
import { NivelListado } from "../../api/grado.api";
import { OpcionesTecnico, OpcionesComun, OpcionesPaciente } from '../general/OpcionesNivel';

export function NivelLista({ usuario }) {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [niveles, setniveles] = useState([]);
    //const [localNiveles, setLocalNiveles] = useState(niveles);

    // Carga los datos de la base de datos
    const cargarNiveles = async () => {
        try {
            // Obtenemos los datos de los niveles
            const domi = await NivelListado();
            setniveles(domi.data);
            //setLocalNiveles(niveles);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al cargar niveles');
            }
        }
    };

    // Carga los datos 
    useEffect(() => {
        cargarNiveles();
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            cargarNiveles();
        }, 300000); // 5 minutos
        return () => clearInterval(interval);
    }, []);

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
                    niveles.map((nivel) => (

                        <div className="contenedor-listado__nivel" key={nivel.id}>
                            <div className="contenedor-nombre__nivel">
                                <li style={{ listStyle: 'none' }}>
                                    <h6 style={{ fontFamily: 'Pacifico' }}>Grado TDAH: {nivel.descripcion_grado}</h6>
                                </li>
                            </div>
                            <div className="contenedor__nivel">
                                <div className="contenedor-datos__nivel">
                                    <div className="card__nivel">
                                        <div className="textos__nivel d-flex flex-column justify-content-between">
                                            <Image src="/img/abeja_ivbapx.jpg"
                                                className="imagen__nivel" />
                                        </div>
                                    </div>
                                    <div className="card__nivel">
                                        <div className="textos__nivel d-flex flex-column justify-content-between">
                                            <li>
                                                <h3 className="titulo__dato"> Nombre </h3>
                                            </li>
                                            <li className="valor__dato"> {nivel.nombre_nivel} </li>
                                        </div>
                                    </div>
                                    <div className="card__nivel">
                                        <div className="textos__nivel d-flex flex-column justify-content-between">
                                            <li>
                                                <h3 className="titulo__dato"> Categorías </h3>
                                            </li>
                                            <li className="valor__dato"> {nivel.numero_categorias} </li>
                                        </div>
                                    </div>
                                    <div className="card__nivel">
                                        <div className="textos__nivel d-flex flex-column justify-content-between">
                                            <li>
                                                <h3 className="titulo__dato"> Dificultad </h3>
                                            </li>
                                            <li className="valor__dato font-weight-normal"> {nivel.grado_dificultad} </li>
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
            </>
            <hr style={{ color: '#0C2342' }} />
            <div className="cabeza__Nivel">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="display-7 mt-2">
                                Reportes
                            </h4>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}