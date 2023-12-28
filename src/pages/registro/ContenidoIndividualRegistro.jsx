// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Container, Row } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister'
import { Link, useParams } from 'react-router-dom';
import React, { useState } from 'react';
// Metodos
import { FormularioContenidoIndividual } from '../../components/registro/FormularioContenidoIndividual'


export function IndividualRegistro() {
    const [show, setShow] = useState(false);
    const cerrar = () => setShow(false);
    const abrir = () => setShow(true);

    // Slug de contenido
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
                        <h6>Sección: Indicación</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '0.9rem' }}>
                            Ingresa la indicación para la actividad. Si son preguntas multiples
                            previo a una pregunta usa ',' para separarlas.
                            Ejm: Responda, ¿P1?, ¿P2?, ...
                        </p>
                        <h6>Sección: Respuesta</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '0.9rem' }}>
                            Ingresa las respuestas para la actividad. Si son respuestas múltiples
                            previo a una usa ',' para separarlas. Ejm: Respuesta 1, Respuesta 2 ...
                        </p>
                        <h6>Sección: Portada</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '0.9rem' }}>
                            Se debe elegir una imagen con el nombre plasmado en ella.
                            Imagina que es un rotulador que representa el nombre
                            del contenido.</p>
                        <h6>Sección: Contenido</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '0.9rem' }}>
                            Se debe elegir una imagen o imágenes que representen la actividad a resolver
                            según la indicación plasmada.</p>
                        <h6>Sección: Tipo de contenido</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '0.9rem' }}>
                            Si escoge "<strong style={{ fontWeight: 'bold', color: 'black' }}>Selección de Imágenes</strong>" está hablando de rompecabezas y pueden ser
                            4 o 6 imágenes. <br /> Si escoge "<strong style={{ fontWeight: 'bold', color: 'black' }}>Colorear</strong>" debe ajuntar una imagen sin color en "Contenido" y una con
                            el color real en "Imagen 1". <br /> Si escoge "<strong style={{ fontWeight: 'bold', color: 'black' }}>Pictograma</strong>" debe ajuntar la imagen real en "Contenido".
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
            <Container className="contenedor__ancho">
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-7">
                            <h4 className="titulo__CE"> Registro de Contenido</h4>
                        </div>
                        <div className='card-body col-md-1 pt-1'>
                            <Button variant="success" onClick={abrir} className='mt-2'>
                                Detalle
                            </Button>
                        </div>
                        <div className='card-body col-md-1 pt-1'>
                            <Link to={`/contenido/individual/all/${slug}/`} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        <FormularioContenidoIndividual slug={slug} />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}