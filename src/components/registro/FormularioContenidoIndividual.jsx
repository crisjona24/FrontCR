// Estilos
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css"
// Componentes
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
// Metodos
import { CrearContenidoIndividual } from '../../api/contenidoindividual.api';
import { ContenidoListadoSolo } from '../../api/contenido.api';
import { NivelListado } from '../../api/grado.api';
import { validarTamanoImagen } from '../../controles/alert_user';
import { info__contenido, info__contenido__respuesta } from '../../controles/controlador_registro';

export function FormularioContenidoIndividual({ slug }) {
    /* *** Form **** */
    const [niveles, setNiveles] = useState([]);
    const [nombre_nivel, setNombreNivel] = useState("");
    const [contenidos, setContenidos] = useState([]);
    const [conten, setConten] = useState("");
    const [descripcion_individual, setDescripcion] = useState("");
    const [preguntas, setPreguntas] = useState("");
    const [color, setColor] = useState("");
    const [tipo_contenido, setTipo] = useState("");
    const [contenido_individual, setContenido] = useState("");
    const [img1, setImg1] = useState("");
    const [img2, setImg2] = useState("");
    const [img3, setImg3] = useState("");
    const [img4, setImg4] = useState("");
    const [img5, setImg5] = useState("");
    const [portada_individual, setPortada] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const enviarFContenido = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (!camposValidos()) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        //Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los combinados de respuestas y color si color no es vacio
            if (color.trim() !== "") {
                const respuesta_ = combinarRespuestas();
                setRespuesta(respuesta_);
            }
            const formData = new FormData(); // Crear un objeto FormData
            // Obtenemos los combinados de preguntas y descripcion_individual si es que preguntas 
            // esta lleno y no es vacio
            if (preguntas.trim() !== "") {
                const descripcion_individual_ = combinarDescripcionYPreguntas();
                formData.append('descripcion_individual', descripcion_individual_);
            } else {
                formData.append('descripcion_individual', descripcion_individual);
            }
            formData.append('tipo_contenido', tipo_contenido);
            formData.append('respuesta', respuesta);
            formData.append('nombre_nivel', nombre_nivel);
            formData.append('contenido_individual', contenido_individual);
            formData.append('img1', img1);
            formData.append('img2', img2);
            formData.append('img3', img3);
            formData.append('img4', img4);
            formData.append('img5', img5);
            formData.append('portada_individual', portada_individual);
            formData.append('conten', conten);
            // Realizar la petición POST al servidor
            await guardarContenido(formData);
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al registrar contenido');
            }
        }
        setHabilitado(false);
    };

    // Funcion para guardar
    const guardarContenido = async (formData) => {
        try {
            const response = await CrearContenidoIndividual(formData);
            if (response.data.success) {
                // Mensaje
                Swal.fire("Actividad registrado", "", "success");
                // Redireccionar a la página principal si el inicio de sesión es exitoso
                navigate(`/contenido/individual/all/${slug}/`);
            } else {
                if (response.data.error) {
                    mostrarError(response.data.error);
                } else {
                    mostrarError('Error al registrar contenido');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al registrar contenido');
            }
        }
    }
    // Cargar datos
    const cargarNivel = async () => {
        try {
            const nivel = await NivelListado();
            setNiveles(nivel.data);
        } catch (error) {
            mostrarError('Error al obtener datos de nivel');
        }
    };

    const cargarConten = async () => {
        try {
            const data = await ContenidoListadoSolo();
            setContenidos(data.data);
        } catch (error) {
            mostrarError('Error al obtener datos de contenido');
        }
    };

    // UseEffect
    useEffect(() => {
        if (!token) navigate('/login');
        cargarNivel();
        cargarConten();
    }, []);

    // Campos vacios
    const camposValidos = () => {
        if (
            descripcion_individual.trim() === "" ||
            tipo_contenido.trim() === "" ||
            respuesta.trim() === "" ||
            conten.trim() === "" ||
            nombre_nivel.trim() === "" ||
            !contenido_individual ||
            !portada_individual
        ) {
            return false;
        }
        if (tipo_contenido === "selecion_multiple_img" && (!img1 || !img2 || !img3)) {
            return false;
        }
        return true;
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    // Método para combinar descripcion_individual y preguntas
    const combinarDescripcionYPreguntas = () => {
        // Combinar los valores y regresar
        return `${descripcion_individual}, ${preguntas}`;
    }

    // Método para combinar descripcion_individual y preguntas
    const combinarRespuestas = () => {
        // Combinar los valores y regresar
        return `${respuesta}, ${color}`;
    }

    return (
        <form onSubmit={enviarFContenido} encType='multipart/form-data'>
            {error && <p>{error}</p>}
            <div className="form-group">
                <label className='label' htmlFor="tipo">Tipo de contenido:</label>
                <select className="form-select w-100" id="tipo" name="tipo"
                    value={tipo_contenido} onChange={e => setTipo(e.target.value)}>
                    <option value="none">None</option>
                    <option value="selecion_individual">Tipo 1 - Selección Individual</option>
                    <option value="verdadero_falso">Tipo 2 - Verdadero o Falso</option>
                    <option value="selecion_multiple">Tipo 3 - Selección Múltiple</option>
                    <option value="responder_preguntas">Tipo 4 - Responder Preguntas</option>
                    <option value="pintar_imagen">Tipo 5 - Colorear</option>
                    <option value="seleccionar_imagen">Tipo 6 - Selección de Imágenes</option>
                    <option value="cuento">Tipo 7 - Lectura Comprensiva</option>
                    <option value="selecion_multiple_img">Tipo 8 - Selección Individual con Imágenes</option>
                    <option value="pictograma">Tipo 9 - Pictograma</option>
                </select>
            </div>
            <div className="form-group">
                <label className='label' htmlFor="descripcion">Indicación:</label>
                <textarea className='form-control w-100 h-100' type="text" id="descripcion"
                    value={descripcion_individual} onChange={e => setDescripcion(e.target.value)}
                    name='descripcion'
                    placeholder="Ingresa la indicación de la actividad**"
                />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="preguntas">Preguntas:</label>
                <textarea onClick={info__contenido} className='form-control w-100 tamanio-text-area'
                    type="text" id="preguntas"
                    value={preguntas} onChange={e => setPreguntas(e.target.value)}
                    name='preguntas'
                    placeholder="Ingresa la indicación de la actividad**"
                />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="respuesta">Respuesta:</label>
                <input onClick={info__contenido__respuesta} className='form-control w-100' type="text" placeholder="Ingresa la respuesta**" id="respuesta" name="respuesta"
                    value={respuesta} onChange={e => setRespuesta(e.target.value)} />
            </div>
            <>
                {
                    tipo_contenido === "pintar_imagen" &&
                    <>
                        <div className="form-group">
                            <label className='label' htmlFor="color">Color:</label>
                            <input className='form-control w-100' type="text" placeholder="Ingresa el color a completar en la imagen**" id="color" name="color"
                                value={color} onChange={e => setColor(e.target.value)} />
                        </div>
                    </>
                }
            </>
            <div className="form-group">
                <label className='label' htmlFor="portada_individual">Portada:</label>
                <input className='form-control w-100' type="file" id="portada_individual"
                    onChange={(e) => { setPortada(e.target.files[0]); validarTamanoImagen(e.target) }} name='portada_individual' accept="image/*" />
            </div>
            <div className="form-group">
                <label className='label' htmlFor="contenido_individual">Contenido:</label>
                <input className='form-control w-100' type="file" id="contenido_individual"
                    onChange={(e) => { setContenido(e.target.files[0]); validarTamanoImagen(e.target) }}
                    name='contenido_individual' accept="image/*" />
            </div>
            <>
                {
                    tipo_contenido === "selecion_multiple_img" &&
                    <>
                        <div className='form-row row'>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img1">Contenido de opción 2:</label>
                                <input className='form-control w-100' type="file" id="img1"
                                    onChange={(e) => { setImg1(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img1' accept="image/*" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img2">Contenido de opción 3:</label>
                                <input className='form-control w-100' type="file" id="img2"
                                    onChange={(e) => { setImg2(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img2' accept="image/*" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className='label' htmlFor="img3">Contenido de opción 4:</label>
                            <input className='form-control w-100' type="file" id="img3"
                                onChange={(e) => { setImg3(e.target.files[0]); validarTamanoImagen(e.target) }}
                                name='img3' accept="image/*" />
                        </div>
                    </>
                }
                {
                    tipo_contenido === "pictograma" &&
                    <>
                        <div className='form-row row'>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img1">Contenido de opción 2:</label>
                                <input className='form-control w-100' type="file" id="img1"
                                    onChange={(e) => { setImg1(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img1' accept="image/*" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img2">Contenido de opción 3:</label>
                                <input className='form-control w-100' type="file" id="img2"
                                    onChange={(e) => { setImg2(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img2' accept="image/*" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className='label' htmlFor="img3">Contenido de opción 4:</label>
                            <input className='form-control w-100' type="file" id="img3"
                                onChange={(e) => { setImg3(e.target.files[0]); validarTamanoImagen(e.target) }}
                                name='img3' accept="image/*" />
                        </div>
                    </>
                }
                {
                    tipo_contenido === "seleccionar_imagen" &&
                    <>
                        <div className='form-row row'>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img1">Contenido de opción 2:</label>
                                <input className='form-control w-100' type="file" id="img1"
                                    onChange={(e) => { setImg1(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img1' accept="image/*" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img2">Contenido de opción 3:</label>
                                <input className='form-control w-100' type="file" id="img2"
                                    onChange={(e) => { setImg2(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img2' accept="image/*" />
                            </div>
                        </div>
                        <div className='form-row row'>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img3">Contenido de opción 4:</label>
                                <input className='form-control w-100' type="file" id="img3"
                                    onChange={(e) => { setImg3(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img3' accept="image/*" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className='label' htmlFor="img4">Contenido de opción 5:</label>
                                <input className='form-control w-100' type="file" id="img4"
                                    onChange={(e) => { setImg4(e.target.files[0]); validarTamanoImagen(e.target) }}
                                    name='img4' accept="image/*" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className='label' htmlFor="img5">Contenido de opción 6:</label>
                            <input className='form-control w-100' type="file" id="img5"
                                onChange={(e) => { setImg5(e.target.files[0]); validarTamanoImagen(e.target) }}
                                name='img5' accept="image/*" />
                        </div>
                    </>
                }
                {
                    tipo_contenido === "pintar_imagen" &&
                    <>
                        <div className="form-group">
                            <label className='label' htmlFor="img1">Contenido de opción 2:</label>
                            <input className='form-control w-100' type="file" id="img1"
                                onChange={(e) => { setImg1(e.target.files[0]); validarTamanoImagen(e.target) }}
                                name='img1' accept="image/*" />
                        </div>
                    </>
                }
            </>
            <div className='form-row row'>
                <div className="form-group col-md-6">
                    <label className='label' htmlFor="conten">Pertenece a:</label>
                    <select className="form-control w-100" id="conten"
                        name="conten" value={conten} onChange={e => setConten(e.target.value)}>
                        <option value="none">None</option>
                        <>
                            {contenidos.map((dominio) => (
                                <option key={dominio.id} value={dominio.nombre}>
                                    {dominio.nombre}
                                </option>
                            ))}
                        </>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label className='label' htmlFor="grado">Grado:</label>
                    <select className="form-control w-100" id="grado"
                        name="grado" value={nombre_nivel} onChange={e => setNombreNivel(e.target.value)}>
                        <option value="none">None</option>
                        <>
                            {niveles.map((nivel) => (
                                <option key={nivel.id} value={nivel.nombre_nivel}>
                                    {nivel.nombre_nivel}
                                </option>
                            ))}
                        </>
                    </select>
                </div>
            </div>

            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )
}
