// Estilos
import "../../styles/Lista.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faCheckDouble, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
//import { useState } from "react";
//import { useNavigate } from 'react-router-dom';
import React from 'react';
import Swal from "sweetalert2";
// Metodos
import { SalaEliminar, AtenderSala } from "../../api/sala.api"


// Sala generales
export function ListadodeSala({ salas, usuario, page, setPage, numeroPag }) {
    const navigate = useNavigate();
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
                <div className="col-md-offset-1 col-md-10">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                                
                            </div>
                        </div>
                        <div className="panel-body table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th>Nombre</th>
                                        <th>Código</th>
                                        <th>Anotaciones</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            salas.map((sala) => (
                                                <tr key={sala.id}>
                                                    <td>{sala.nombre_sala}</td>
                                                    <td>{sala.codigo_identificador}</td>
                                                    <td>{sala.anotaciones}</td>
                                                    <td>
                                                        <ul className="action-list">
                                                            <Button title="Eliminar sala" variant="danger" className="separacion--boton h"
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea eliminar la sala?',
                                                                        text: "Eliminar sala creada",
                                                                        icon: 'info',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            await SalaEliminar(sala.id);
                                                                            Swal.fire("Eliminación exitosa", "", "success");
                                                                            navigate('/nivel/all');
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                            {
                                                                usuario.tipo === "comun" &&
                                                                <Link to={`/sala/editar/${sala.id}/`} title="Editar sala"
                                                                    className="btn btn-primary separacion--boton h">
                                                                    <FontAwesomeIcon icon={faPencil} />
                                                                </Link>
                                                            }
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            salas.length === 0 &&
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                    <ul></ul>
                                                </td>
                                            </tr>
                                        }
                                    </>
                                </tbody>
                            </Table>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8">Información - Salas Creadas</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
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
            </div>
        </div>

    )
}


// Sala de paciente
export function ListadodeSalaPaciente({ salas, page, setPage, numeroPag }) {
    // Paginacion siguente
    const anterior = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    // Paginacion anterior
    const siguiente = () => {
        setPage(prevPage => (prevPage < numeroPag ? prevPage + 1 : prevPage));
    };

    return (
        <div className="cuerpo-tabla">
            <div className="row">
                <div className="col-md-offset-1 col-md-10">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                            </div>
                        </div>
                        <div className="panel-body table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th>Nombre</th>
                                        <th>Código</th>
                                        <th>Anotaciones</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            salas.map((sala) => (
                                                <tr key={sala.id}>
                                                    <td>{sala.nombre_sala}</td>
                                                    <td>{sala.codigo_identificador}</td>
                                                    <td style={{ textAlign: 'justify' }}>{sala.anotaciones}</td>
                                                    <td>
                                                        <ul className="action-list">
                                                            <Button title="Atender sala" variant="success" className="separacion--boton h"
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿La sala ha sido atendida?',
                                                                        text: "Atender sala",
                                                                        icon: 'info',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            try {
                                                                                const response = await AtenderSala(sala.slug_sala);
                                                                                if (response.data.success) {
                                                                                    Swal.fire("Atención exitosa", "", "success");
                                                                                    window.location.reload();
                                                                                } else {
                                                                                    if (response.data.error) {
                                                                                        Swal.fire(response.data.error, '', 'error');
                                                                                    } else {
                                                                                        Swal.fire('Atención fallida', '', 'error');
                                                                                    }
                                                                                }
                                                                            } catch (error) {
                                                                                Swal.fire("Atención fallida", "", "error");
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faCheckDouble} />
                                                            </Button>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            salas.length === 0 &&
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                    <ul></ul>
                                                </td>
                                            </tr>
                                        }
                                    </>
                                </tbody>
                            </Table>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8">Información - Salas</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
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
            </div>
        </div>

    )
}
