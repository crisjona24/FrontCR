// Estilos
import "../../styles/Lista.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table, Modal } from "react-bootstrap";
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faTimes, faCheckCircle, faBatteryFull, faBackward, faCheck, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import React from 'react';
import Swal from "sweetalert2";
// Metodos
import { PeticionEliminar } from "../../api/peticion.api"
//import { DownloadLink } from "./Descarga"
//import { OpcionesComun, OpcionesPaciente, OpcionesTecnico } from "./OpcionesCurso"
//import { VerificarUsuario } from "../../api/usuario.api"

// Lista de peticion
export function ListaPeticion({ peticiones, page, setPage, numeroPag, isActive }) {
    const navigate = useNavigate();

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

        <div className="cuerpo-tabla-2">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                            </div>
                        </div>
                        <div className="panel-body table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th>Acciones</th>
                                        <th>Estado</th>
                                        <th>Motivo</th>
                                        <th>Tipo</th>
                                        <th style={{ textAlign: 'center' }} >Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            peticiones.map((peticion) => (
                                                <tr key={peticion.id}>
                                                    <td>
                                                        <ul className="action-list">
                                                            <Link to={`/ver/peticion/${peticion.id}/`}
                                                                className={`btn btn-success separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                title="Ver petición">
                                                                <FontAwesomeIcon icon={faEye} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Link>
                                                            <Button title="Eliminar petición"
                                                                className={`btn btn-danger separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea eliminar la petición?',
                                                                        text: "Eliminación de petición",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí, eliminar'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            await PeticionEliminar(peticion.id);
                                                                            Swal.fire("Eliminación exitosa", "", "success");
                                                                            navigate('/peticion/all');
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                            <Button title="Marcar revisión"
                                                                className={`btn btn-primary ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Estás seguro de marcar revisión?',
                                                                        text: "Registro de revisión",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí, enviar'
                                                                    }).then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            navigate(`/peticion/registro/revision/${peticion.slug_peticion}/`);
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faCheckCircle} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        {
                                                            peticion.estado_revision === false &&
                                                            <FontAwesomeIcon icon={faTimes} style={{ marginLeft: '25%' }} />
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: 'justify' }}>{peticion.motivo_peticion}</td>
                                                    <td>{peticion.tipo_peticion}</td>
                                                    <td style={{ textAlign: 'center' }} >{peticion.fecha_registro_peticion}</td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            peticiones.length === 0 &&
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
                                    <Link to={'/nivel/all'}
                                        className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Peticiones Pendientes</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Adelante">
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


// Lista de peticiones atendidas
export function ListaPeticionAtendida({ peticiones, page, setPage, numeroPag, isActive }) {
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
        <div className="cuerpo-tabla-2">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                            </div>
                        </div>
                        <div className="panel-body table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th className="text-center">Acciones</th>
                                        <th>Estado</th>
                                        <th>Motivo</th>
                                        <th>Tipo</th>
                                        <th style={{ textAlign: 'center' }}>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            peticiones.map((peticion) => (
                                                <tr key={peticion.id}>
                                                    <td className="d-flex justify-content-center">
                                                        <ul className="action-list">
                                                            <Link to={`/ver/peticion/${peticion.id}/`}
                                                                className={`btn btn-success separacion--boton ${isActive ? 'h_' : 'H'}`}
                                                                title="Ver petición">
                                                                <FontAwesomeIcon icon={faEye} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Link>
                                                            <Button title="Eliminar petición"
                                                                className={`btn btn-danger separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea eliminar la petición?',
                                                                        text: "Eliminación de petición",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí, eliminar'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            await PeticionEliminar(peticion.id);
                                                                            Swal.fire("Eliminación exitosa", "", "success");
                                                                            navigate('/peticion/all/atendida');
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        {
                                                            peticion.estado_revision === true &&
                                                            <FontAwesomeIcon icon={faBatteryFull} style={{ marginLeft: '25%' }} />
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: 'justify' }}>{peticion.motivo_peticion}</td>
                                                    <td>{peticion.tipo_peticion}</td>
                                                    <td style={{ textAlign: 'center' }}>{peticion.fecha_registro_peticion}</td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            peticiones.length === 0 &&
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
                                    <Link to={'/nivel/all'}
                                        className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Peticiones Atendidas</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Adelante">
                                        <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }}
                                            className={isActive ? 'tam_fa_' : 'tam_fa'} />
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


// Lista de peticiones de un usuario
export function ListaPeticionesUsuario({ peticiones, page, setPage, numeroPag, isActive }) {
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
        <div className="cuerpo-tabla-2">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12">
                                    <Link to={'/peticion/registro'} className="btn btn-sm btn-primary pull-left">
                                        <FontAwesomeIcon icon={faPlusCircle} /> Agregar nueva petición
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body_2 table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th>Acciones</th>
                                        <th>Estado</th>
                                        <th>Motivo</th>
                                        <th>Tipo</th>
                                        <th style={{ textAlign: 'center' }}>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            peticiones.map((peticion) => (
                                                <tr key={peticion.id}>
                                                    <td>
                                                        <ul className="action-list">
                                                            <Link to={`/ver/peticion/${peticion.id}/`}
                                                                className={`btn btn-success separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                title="Ver petición"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Link>
                                                            <Button title="Eliminar petición"
                                                                className={`btn btn-danger separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea eliminar la petición?',
                                                                        text: "Eliminación de petición",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí, eliminar'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            await PeticionEliminar(peticion.id);
                                                                            Swal.fire("Eliminación exitosa", "", "success");
                                                                            window.location.reload();
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        {
                                                            peticion.estado_revision === true ? (
                                                                <FontAwesomeIcon icon={faCheck} style={{ marginLeft: '25%' }} />
                                                            ) : peticion.estado_revision === false ? (
                                                                <FontAwesomeIcon icon={faTimes} style={{ marginLeft: '25%' }} />
                                                            ) : <></>
                                                        }

                                                    </td>
                                                    <td style={{ textAlign: 'justify' }}>{peticion.motivo_peticion}</td>
                                                    <td>{peticion.tipo_peticion}</td>
                                                    <td style={{ textAlign: 'center' }}>{peticion.fecha_registro_peticion}</td>

                                                </tr>
                                            ))
                                        }
                                        {
                                            peticiones.length === 0 &&
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
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Peticiones</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Adelante">
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