// Estilos
import "../../styles/Nivel.css";
import "bootstrap/dist/css/bootstrap.min.css";
// Componentes
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
// Metodos
import { CursoListado } from "../../api/curso.api"
import { ListadodeCursos } from "../general/ListaCurso"

export function CursoLista() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Manejo del estado de los datos
    const [cursos, setCursos] = useState([]);
    //const [localCursos, setLocalCursos] = useState(cursos);

    useEffect(() => {
        async function cargarCursos() {
            try {
                // cargar datos de cursos
                const domi = await CursoListado();
                setCursos(domi.data);
                //setLocalCursos(cursos);
            } catch (error) {
                if (error.message === "NOT_AUTHENTICATED") {
                    navigate('/login');
                } else {
                    mostrarError('Error al cargar cursos');
                }
            }
        }
        cargarCursos();
        //Controla el tiempo de actualizacion de la pagina
        const interval = setInterval(() => {
            cargarCursos();
        }, 300000); // 5 minutos
        return () => clearInterval(interval);
    }, [cursos]);

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
            {/* Table */}
            <ListadodeCursos cursos={cursos} />
        </div>
    )

}