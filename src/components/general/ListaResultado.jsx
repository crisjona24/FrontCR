// Estilos
import "../../styles/Lista.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faCheckDouble, faPencil } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from "react";
//import { useNavigate } from 'react-router-dom';
import React from 'react';
import Swal from "sweetalert2";
// Metodos


export function ListadodeResultado({ resultados, usuario, page, setPage, numeroPag }) {
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

                                        <th>Tiempo m</th>
                                        <th>Tiempo s</th>
                                        <th>Observación</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            resultados.map((resultado) => (
                                                <tr key={resultado.id}>
                                                    <td>{resultado.tiempo_m} minutos</td>
                                                    <td>{resultado.tiempo_s} segundos</td>

                                                    <>
                                                        {
                                                            resultado.observacion === null ?
                                                                <td>No hay observación. !Agrégala¡</td>
                                                                :
                                                                <td>{resultado.observacion}</td>
                                                        }

                                                    </>

                                                    <td>
                                                        <ul className="action-list">
                                                            <Button title="Generar Reporte" variant="success" className="separacion--boton h"
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea generar el reporte?',
                                                                        text: "Generar reporte",
                                                                        icon: 'info',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí, generar'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            Swal.fire(
                                                                                '¡Reporte generado!',
                                                                                'El reporte ha sido generado.',
                                                                                'success'
                                                                            )
                                                                            //await generarReporte(resultado.id);
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faCheckDouble} />
                                                            </Button>
                                                            {
                                                                usuario.tipo === "comun" &&
                                                                <Link to={`/resultado/editar/${resultado.id}`} title="Agregar observación"
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
                                            resultados.length === 0 &&
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
                                <div className="col-sm-8 col-xs-8">Información - Resultados</div>
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