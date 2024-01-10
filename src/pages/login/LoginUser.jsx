// Estilos
import "../../styles/Login.css";
// Componentes
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Button } from "react-bootstrap";
// Metodos
import { LoginUsuario } from "../../api/login.api";
import { cerrarSesion } from "../../controles/logout"
import { VerificarInscripcion } from "../../api/curso.api"

export function IniciarSesion() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Mostrar clave
    const [verClave, setVerClave] = useState(false);

    // Funcion para enviar los datos del formulario
    const enviar = async (e) => {
        e.preventDefault();
        try {
            const info__form = {
                username,
                password
            };
            // Realiza la petición POST al servidor
            const response = await LoginUsuario(info__form);
            if (response.success) {
                // Almacena el token en el almacenamiento local
                cerrarSesion(response.token);
                if (response.tipo === 'paciente') {
                    // Verificar si esta inscrito
                    const inscrip = await VerificarInscripcion();
                    if (inscrip.data.inscrito === "1") {
                        navigate('/nivel/all');
                    } else if (inscrip.data.inscrito === "0") {
                        navigate('/cursos/all');
                    }
                } else {
                    navigate('/nivel/all');
                }

            } else {
                if (response.error) {
                    mostrarError(response.error);
                } else {
                    mostrarError('Error al iniciar sesión');
                }
            }
        } catch (error) {
            mostrarError('Error al iniciar sesión');
        }
    };

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000); // 5 segundos
    };

    // Visibilidad de la clave
    const observarClave = () => {
        setVerClave(!verClave);
    }

    // Limpiar el local storgae
    localStorage.clear();

    return (
        <div className="card" style={{ backgroundColor: '#e5e7ed', width: '100%', height: '100%', borderColor: '#e5e7ed' }}>
            <div className='login-page'>
                <main>
                    <div className="login-block">
                        <Image className='imagen-login' src='/img/Fondo1.jpg' fluid />
                        <h1>Iniciarrrrr sesión</h1>
                        {error &&
                            <div id="alert" className="alert alert-success" role="alert">
                                <h5 className="alert-heading">!Atención!</h5>
                                <p className="mb-0">{error}</p>
                            </div>
                        }
                        <div className="row">
                            <div className="col-md-12 mx-auto">
                                <form onSubmit={enviar}>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <FontAwesomeIcon className='ubi' icon={faUser} />
                                            </span>
                                            <input className='form-control' type="text" placeholder="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} />
                                        </div>
                                    </div>
                                    <hr className='hr-xs' />
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon mt-3">
                                                <FontAwesomeIcon className='ubi' icon={faLock} />
                                            </span>
                                            <div className='form-row row'>
                                                <div className='form-group col-md-11'>
                                                    <input className='form-control' type={verClave ? "text" : "password"} placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
                                                </div>
                                                <div className="form-group col-md-1 mt-3 d-flex justify-content-center">
                                                    <Button variant="success" onClick={observarClave}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <button type="submit" className='my-success-button'>Iniciar sesión</button>
                                    <Link className="btn btn-primary mt-2 w-100" to='/verificar/cuenta'>Verificar cuenta</Link>
                                    <li style={{ listStyle: 'none', marginTop: '5%', textAlign: 'right' }} >
                                        <Link style={{ textDecoration: 'none', color: 'gray' }} to="/recuperar/cuenta">
                                            <span className="text">
                                                Recupera tu cuenta
                                            </span>
                                        </Link>
                                    </li>
                                    <div className='login-footer'>
                                        <li style={{ listStyle: 'none', marginTop: '1%' }} >
                                            <Link style={{ textDecoration: 'none' }} to="/registro">
                                                <span className="text">
                                                    ¿No tienes una cuenta?. CLIC AQUÍ..
                                                </span>
                                            </Link>
                                        </li>
                                    </div>

                                    <div className="login-footer">
                                        <span className="text">
                                            Registrate con
                                        </span>
                                        <ul className="social-icons">
                                            <li>
                                                <Link className="facebook" to="/login">
                                                    <FontAwesomeIcon icon={faFacebook} />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="facebook" to="/login">
                                                    <FontAwesomeIcon icon={faTwitter} />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="facebook" to="/login">
                                                    <FontAwesomeIcon icon={faLinkedin} />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    )
}
