// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Container } from "react-bootstrap"
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister'
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Metodos
import { FormularioSala, FormularioPeticionRevision } from "../../components/registro/Formularios"
import { ContenidoListadoSolo } from '../../api/contenido.api';
import { ContenidoIndividualTodo } from '../../api/contenidoindividual.api';

export function SalaRegistro() {
    // Listados
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const token = localStorage.getItem('token');
    const [contenidos, setContenidos] = useState([]);
    const [individuales, setContenidosIndividuales] = useState([]);
    const [conten, setConten] = useState("");
    const [individual, setContenIndividual] = useState("");

    // Cargar datos
    const cargarConten = async () => {
        try {
            const data = await ContenidoListadoSolo();
            setContenidos(data.data);
        } catch (error) {
            mostrarError('Error al obtener datos de contenido');
        }
    };

    const cargarIndividuales = async () => {
        try {
            const dataIndividual = await ContenidoIndividualTodo(conten);
            setContenidosIndividuales(dataIndividual.data);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al cargar actividades');
            }
        }
    };

    // UseEffect
    useEffect(() => {
        if (!token) navigate('/login');
        cargarConten();
    }, []);

    useEffect(() => {
        if (!token) navigate('/login');
        if (conten !== "" && conten !== "none") {
            cargarIndividuales();
        }
        if (conten === "" || conten === "none") {
            setContenidosIndividuales([]);
        }
    }, [conten]);

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <CabeceraRegister />
            <div className="alineacion-RS">
                <Container className="contenedor__edicion-3">
                    <div className="d-flex flex-column">
                        <label className='label' htmlFor="grado">Lista de actividades</label>
                        <hr />
                        <div className="form-group">
                            <label className='label' htmlFor="conte">Tipo de contenido:</label>
                            <select className="form-control mt-2" id="conte" style={{ width: '200px' }}
                                name="conte" value={conten} onChange={e => setConten(e.target.value)}>
                                <option value="none">None</option>
                                <>
                                    {contenidos.map((contenido) => (
                                        <option key={contenido.id} value={contenido.slug_contenido}>
                                            {contenido.nombre}
                                        </option>
                                    ))}
                                </>
                            </select>
                        </div>
                        <hr />
                        <div className="form-group">
                            <label className='label' htmlFor="acti">Tipo de actividad:</label>
                            {
                                conten !== "" && conten !== "none" ? (
                                    <ul className="list-unstyled mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {individuales.map((indi) => (
                                            <li key={indi.id} style={{ padding: '5px 0' }}>
                                                <button
                                                    className="btn"
                                                    onClick={() => setContenIndividual(indi.identificador_individual)}
                                                    style={{ textAlign: 'justify', display: 'block' }}
                                                >
                                                    Descripción: {indi.descripcion_individual} - {indi.identificador_individual}
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={() => setContenIndividual(indi.identificador_individual)}
                                                    style={{ textAlign: 'justify', display: 'block' }}
                                                >
                                                    Código: {indi.identificador_individual}
                                                </button>
                                                <hr />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <label className="mt-3">No hay actividades disponibles.</label>
                                )
                            }
                        </div>
                    </div>

                </Container>
                <Container className="contenedor__edicion-2">
                    <Container className='barraSup mt-5' >
                        <Row className='col-md-12'>
                            <div className="card-body col-md-9">
                                <h4 className="titulo__CE"> Registro de Sala</h4>
                            </div>
                            <div className='card-body col-md-2 pt-1'>
                                <Link to={'/sala/all'} className='btn btn-danger mt-2'>
                                    Cancelar
                                </Link>
                            </div>
                        </Row>
                    </Container>
                    <Container className='form container pb-1 borde__CE'>
                        <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                        <div className='pb-2'>
                            {/* Formulario */}
                            <FormularioSala />
                        </div>
                    </Container>
                </Container>
            </div>

            <PieRegister />
        </div>
    )
}

export function RevisionPeticionRegistro() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <CabeceraRegister />
            <Container className='mb-5' style={{ width: '40%' }}>
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-10">
                            <h4 className="titulo__CE"> Registro de Revisión</h4>
                        </div>
                        <div className='card-body col-md-2 pt-1'>
                            <Link to={'/peticion/all'} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        {/* Formulario */}
                        <FormularioPeticionRevision />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}