// Objetivo: Edición de dominio
// Estilos
import "bootstrap/dist/css/bootstrap.min.css"
import { Button, Modal, Container, Row } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister'
import { PieRegister } from '../../components/partes/PieRegister'
import { Link, useParams } from 'react-router-dom';
import React, { useState } from 'react';
// Metodos
import { FormularioEdicion } from '../../components/edicion/Formularo_edicion'

export function DominioEdición() {
    const [show, setShow] = useState(false);
    const cerrar = () => setShow(false);
    const abrir = () => setShow(true);

    // Obtener el parametro de la URL
    let { slug } = useParams();

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* MODAL */}
            <>
                <Modal show={show} onHide={cerrar} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Indicaciones</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Sección: Portada</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '1rem' }}>
                            Se debe elegir una imagen con el nombre plasmado en ella.
                            Imagina que es un rotulador en ella que representa el nombre
                            del Dominio.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={cerrar}>
                            Entendido
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
            {/* FIN MODAL */}
            <CabeceraRegister />
            <Container className="contenedor__edicion">
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-7">
                            <h4 className="titulo__CE"> Edición de dominio</h4>
                        </div>
                        <div className='card-body col-md-2'>
                            <Button variant="success" onClick={abrir} className='mt-2'>
                                Detalle
                            </Button>
                        </div>
                        <div className='card-body col-md-2'>
                            <Link to={`/dominio/detalle/${slug}/`} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        <FormularioEdicion />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}