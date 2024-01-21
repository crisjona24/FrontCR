// Estilos
import "../../styles/Lista.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from 'react-bootstrap';
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faBackward } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import React from 'react';
import { Button } from 'react-bootstrap';
// Metodos
import { OpcionesComun, OpcionesPaciente, OpcionesTecnico } from "./OpcionesCurso";
import { VerificarUsuario } from "../../api/usuario.api";

export function ListadodeCursos({ cursos, page, setPage, numeroPag, isActive }) {
    const [usuario, setUsuario] = useState([]);
    const navigate = useNavigate();


    // Cargar datos de usuario
    const cargarUse = async () => {
        try {
            // Obtener usuario
            const cont = await VerificarUsuario();
            setUsuario(cont.data);
        } catch (err) {
            if (err.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            }
        }
    }

    // Estado de los datos
    useEffect(() => {
        cargarUse();
    }, [])

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
        <div className="cuerpo-tabla-4">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12">
                                    <>
                                        {
                                            usuario.tipo === "comun" &&
                                            <Link to={'/curso/registro'} className="btn btn-sm btn-primary pull-left">
                                                <FontAwesomeIcon icon={faPlusCircle} /> Agregar nuevo
                                            </Link>
                                        }
                                    </>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body_4 table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th className="text-center">Nombre</th>
                                        <th className="text-center">Fecha</th>
                                        <th>Descripción</th>
                                        <th className="text-center">Identificador</th>
                                        <th className="text-center">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            cursos.map((curso) => (
                                                <tr key={curso.id}>
                                                    <td className="text-center">{curso.nombre_curso}</td>
                                                    <td className="text-center">{curso.fecha_registro_curso}</td>
                                                    <td style={{ textAlign: 'justify' }}>{curso.descripcion_curso}</td>
                                                    <td className="text-center">{curso.identificador_curso}</td>
                                                    <td>
                                                        <>
                                                            {
                                                                usuario.tipo === "comun" &&
                                                                <OpcionesComun curso={curso} isActive={isActive} />
                                                            }
                                                            {
                                                                usuario.tipo === "tecnico" &&
                                                                <OpcionesTecnico curso={curso} isActive={isActive} />
                                                            }
                                                            {
                                                                usuario.tipo === "paciente" &&
                                                                <OpcionesPaciente curso={curso} isActive={isActive} />
                                                            }
                                                        </>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            cursos.length === 0 &&
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                    </>
                                </tbody>
                            </Table>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-sm-1 col-xs-1">
                                    <Link to={'/nivel/all'} className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Cursos</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Adelante">
                                        <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}