// Estilos
import "../../styles/Cabecera.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Container, Row } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
// Metodos
import { FormularioPeticion } from '../../components/registro/Formularios'

export function PeticionRegistro() {
    const [show, setShow] = useState(false);
    const cerrar = () => setShow(false);
    const abrir = () => setShow(true);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* MODAL */}
            <>
                <Modal show={show} onHide={cerrar} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Petición</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Sección: Descripción de petición</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '1rem' }}>
                            La descripción de la petición debe ser clara y precisa. Cada necesidad
                            debe ser expresada en una oración y separadas con un punto.
                        </p>
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
            <Container className='mb-5' style={{ width: '35%' }}>
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-7">
                            <h4 className="titulo__CE">Peticiones</h4>
                        </div>
                        <div className='card-body col-md-2 pt-1'>
                            <Button variant="success" onClick={abrir} className='mt-2'>
                                Detalle
                            </Button>
                        </div>
                        <div className='card-body col-md-2 pt-1'>
                            <Link to={'/nivel/all'} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        <FormularioPeticion />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}