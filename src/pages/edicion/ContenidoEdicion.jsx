// Objetivo: Edición de contenido
// Estilos
import "bootstrap/dist/css/bootstrap.min.css"
import { Button, Modal, Container, Row } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ObtenerSlugDominio } from '../../api/contenidoindividual.api';

// Metodos
import { FormularioEdicionContenido } from '../../components/edicion/Formularo_edicion';

export function ContenidoEdición() {
    const [show, setShow] = useState(false);
    const cerrar = () => setShow(false);
    const abrir = () => setShow(true);
    // Slug
    let { slug } = useParams();
    // Slug del dominio
    const [error, setError] = useState("");
    const [slugDominio, setSlugDominio] = useState("");
    const navigate = useNavigate();

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    const cargarSlugDominio = async () => {
        try {
            const slugDomi = await ObtenerSlugDominio(slug);
            if (slugDomi.data.success) {
                setSlugDominio(slugDomi.data.slug_dominio);
            } else {
                if (slugDomi.data.success === false) {
                    navigate('/login');
                } else {
                    mostrarError(slugDomi.data.error);
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

    // Use effect
    useEffect(() => {
        cargarSlugDominio();
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
                        <h6>Sección: Portada</h6>
                        <p style={{ color: '#333', textAlign: 'justify', fontSize: '1rem' }}>
                            Se debe elegir una imagen con el nombre plasmado en ella.
                            Imagina que es un rotulador en ella que representa el nombre
                            del Contenido.</p>
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
                            <h4 className="titulo__CE"> Edición de contenido</h4>
                        </div>
                        <div className='card-body col-md-2'>
                            <Button variant="success" onClick={abrir} className='mt-2'>
                                Detalle
                            </Button>
                        </div>
                        <div className='card-body col-md-2'>
                            <Link to={`/contenido/detalle/${slug}/`} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        {error && <span>{error}</span>}
                        <FormularioEdicionContenido slugDominio={slugDominio} />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}