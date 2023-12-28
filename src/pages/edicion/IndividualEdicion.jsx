// Objetivo: Edición de contenido
// Estilos
import "bootstrap/dist/css/bootstrap.min.css"
import { Button, Modal, Container, Row } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister'
import { PieRegister } from '../../components/partes/PieRegister'
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// Metodos
import { FormularioEdicionIndividual } from '../../components/edicion/Formularo_edicion'
import { ObtenerSlugContenido } from '../../api/contenidoindividual.api';


export function IndividualEdición() {
    const [show, setShow] = useState(false);
    const cerrar = () => setShow(false);
    const abrir = () => setShow(true);

    // Slug
    let { slug } = useParams();
    let { slug2 } = useParams();
    // Slug del dominio
    const [error, setError] = useState("");
    const [slugContenido, setSlugContenido] = useState("");
    const navigate = useNavigate();

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    const cargarSlugContenido = async () => {
        try {
            const slugConte = await ObtenerSlugContenido(slug);
            if (slugConte.data.success) {
                setSlugContenido(slugConte.data.slug_contenido);
            } else {
                if (slugConte.data.success === false) {
                    navigate('/login');
                } else {
                    mostrarError(slugConte.data.error);
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar identificador de dominio');
            }
        }
    }

    // Obtener tipo de usuario
    useEffect(() => {
        cargarSlugContenido();
    }, []);

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
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '1rem' }}>
                            Ingresa la indicación para la actividad. Si son preguntas multiples
                            previo a una pregunta usa ',' para separarlas.
                            Ejm: Responda, ¿P1?, ¿P2?
                        </p>
                        <h6>Sección: Respuesta</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '1rem' }}>
                            Ingresa las respuestas para la actividad. Si son respuestas multiples
                            previo a una usa ',' para separarlas.
                        </p>
                        <h6>Sección: Portada</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '1rem' }}>
                            Se debe elegir una imagen con el nombre plasmado en ella.
                            Imagina que es un rotulador en ella que representa el nombre
                            del Contenido.</p>
                        <h6>Sección: Contenido</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '1rem' }}>
                            Se debe elegir una imagen que representa la actividad a resolver
                            según la indicación plasmada.</p>
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
                        <div className="card-body col-md-8">
                            <h4 className="titulo__CE"> Edición de contenido</h4>
                        </div>
                        <div className='card-body col-md-2'>
                            <Button variant="success" onClick={abrir} className='mt-2'>
                                Detalle
                            </Button>
                        </div>
                        <div className='card-body col-md-2'>
                            <Link to={`/individual/detalle/${slug}/${slug2}/`} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        {error && <span>{error}</span>}
                        <FormularioEdicionIndividual slugContenido={slugContenido} />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}