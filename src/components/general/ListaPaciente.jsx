// Estilos
import "../../styles/Lista.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { faEye } from '@fortawesome/free-solid-svg-icons';
//import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import React from 'react';
// Metodos

export function ListadodePacientes({ pacientes, page, setPage, numeroPag, isActive }) {
    // Paginacion siguente
    const anterior = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    // Paginacion anterior
    const siguiente = () => {
        setPage(prevPage => (prevPage < numeroPag ? prevPage + 1 : prevPage));
    };

    return (
        <div className="cuerpo-tabla-2">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                            </div>
                        </div>
                        <div className="panel-body_3 table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th className="text-center">Estudiante</th>
                                        <th>Contacto</th>
                                        <th>Email</th>
                                        <th>DNI</th>
                                        <th className="text-center">Edad</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            pacientes.map((paciente) => (
                                                <tr key={paciente.id}>
                                                    <td className="text-center">{paciente.nombre_usuario} {paciente.apellido_usuario}</td>
                                                    <td>{paciente.celular}</td>
                                                    <td>{paciente.email_usuario}</td>
                                                    <td>{paciente.dni}</td>
                                                    <td className="text-center">{paciente.edad}</td>
                                                    <td>
                                                        <ul className="action-list d-flex justify-content-center">
                                                            <Link to={`/ver/paciente/${paciente.id}/`} className={`btn btn-success separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                title="Ver Pasciente">
                                                                <FontAwesomeIcon icon={faEye} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Link>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            pacientes.length === 0 &&
                                            <tr >
                                                <td></td>
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
                                <div className="col-sm-2 col-xs-2">
                                    <Link to="/cursos/all" className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Regresar">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-6 col-xs-6 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Pacientes Inscritos</div>
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