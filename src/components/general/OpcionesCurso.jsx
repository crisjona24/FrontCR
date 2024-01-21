//import "../../styles/Lista.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
// Metodos
import { CursoEliminar } from "../../api/curso.api"
import { InscripcionCurso } from "../../api/usuario.api"

/* Opciones de Usuario comun */
export function OpcionesComun({ curso, isActive }) {
    return (
        <ul className="action-list d-flex justify-content-center">
            <Link to={`/pacientes/all/${curso.slug_curso}/`} className={`btn btn-success separacion--boton ${isActive ? 'h_' : 'h'}`}
                title="Ver pacientes inscritos" >
                <FontAwesomeIcon icon={faEye} className={isActive ? 'tam_fa_' : 'tam_fa'} />
            </Link>
            <Link to={`/curso/editar/${curso.slug_curso}/`} className={`btn btn-primary separacion--boton ${isActive ? 'h_' : 'h'}`}
                title="Editar Curso" >
                <FontAwesomeIcon icon={faPencilAlt} className={isActive ? 'tam_fa_' : 'tam_fa'} />
            </Link>
            <Button title="Eliminar curso" className={`btn btn-danger ${isActive ? 'h_' : 'h'}`}
                onClick={() => {
                    Swal.fire({
                        title: '¿Está seguro que desea eliminar el curso?',
                        text: "Eliminación de curso",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, eliminar curso'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            await CursoEliminar(curso.id);
                            Swal.fire("Eliminación exitosa", "", "success");
                            navigate('/nivel/all');
                        }
                    })
                }}
            >
                <FontAwesomeIcon icon={faTrash} className={isActive ? 'tam_fa_' : 'tam_fa'} />
            </Button>
        </ul>
    );
}

/* Opciones de Tecnico */
export function OpcionesTecnico({ curso, isActive }) {
    return (
        <ul className="action-list d-flex justify-content-center">
            <Button title="Eliminar curso" className={`btn btn-danger ${isActive ? 'h_' : 'h'}`}
                onClick={() => {
                    Swal.fire({
                        title: '¿Está seguro que desea eliminar el curso?',
                        text: "Eliminación de curso",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, eliminar curso'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            await CursoEliminar(curso.id);
                            Swal.fire("Eliminación exitosa", "", "success");
                            navigate('/cursos/all');
                        }
                    })
                }}
            >
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </ul>
    );
}

/* Opciones de paciente */
export function OpcionesPaciente({ curso, isActive }) {
    return (
        <ul className="action-list d-flex justify-content-center">
            <Button className={`btn btn-success separacion--boton ${isActive ? 'h_' : 'h'}`} title="Inscribirse al curso"
                onClick={() => {
                    Swal.fire({
                        title: '¿Está seguro de inscribirse al curso?',
                        text: "Inscripción de curso",
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const response = await InscripcionCurso(curso.id);
                            if (response.data.success) {
                                Swal.fire("Inscripción exitosa", "", "success");
                                navigate('/nivel/all');
                            } else {
                                if (response.data.error) {
                                    Swal.fire(response.data.error, "", "error");
                                } else if (response.data.errorSalida) {
                                    Swal.fire(response.data.errorSalida, "", "error");
                                    navigate('/login');
                                } else {
                                    Swal.fire("Error", "No se pudo inscribir al curso", "error");
                                }

                            }
                        }
                    })
                }}
            >
                <FontAwesomeIcon icon={faPlusCircle} />
            </Button>
        </ul>
    );
}
