// Estilos
import "../../styles/Registro.css"
import "../../styles/Varios.css"
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Button, Modal } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister'
import { PieRegister } from '../../components/partes/PieRegister'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import Swal from "sweetalert2";
// Metodos
import { FormularioUsuario } from '../../components/registro/Formulario_usuario'
import { FormularioConfirmacion, FormularioRecuperacion, FormularioCambio } from '../../components/registro/Formularios'
import { ReverificarCuenta } from "../../api/usuario.api";

export function UsuarioRegistro() {
    // Obtener token
    const token = localStorage.getItem('token');
    return (
        <div className="cuerpo_general">
            <CabeceraRegister />
            <Container className='mb-5' style={{ width: '45%' }}>
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-9">
                            <h4 style={{ padding: '10px' }}> Registro de técnico</h4>
                        </div>
                        <div className='card-body col-md-1'>
                            <>
                                {
                                    token ? (
                                        <Link to={'/perfil'} className='btn btn-danger mt-2'>
                                            Cancelar
                                        </Link>
                                    ) : (
                                        <Link to={'/registro'} className='btn btn-danger mt-2'>
                                            Cancelar
                                        </Link>
                                    )
                                }
                            </>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        <FormularioUsuario />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}


// Formulario de confirmacion de cuenta
export function ConfirmacionCuenta() {
    // Modal de envío de correo
    const cerrarModal = () => setVerModal(false);
    const abrirModal = () => setVerModal(true);
    const [habilitado, setHabilitado] = useState(false);
    const [verModal, setVerModal] = useState(false);
    const navigate = useNavigate();

    // Formulario
    const [email_usuario, setEmail] = useState('');

    // Construcción del formulario
    const enviarFormulario = (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(email_usuario)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                email_usuario,
            };
            // Guardamos
            guardar(datos__post);
        } catch (error) {
            Swal.fire("Error al reenviar el código de verificación", "", "error");
        }
        // Cerrar modal
        setHabilitado(false);
        cerrarModal();
    };

    // Funcion para guardar datos
    const guardar = async (datos__post) => {
        const response_reenvio = await ReverificarCuenta(datos__post);
        if (response_reenvio.data.success) {
            Swal.fire("Visite su correo electrónco y use el código de verificación", "", "success");
            navigate('/login');
        } else {
            // Resetear campo de envío
            resetear();
            if (response_reenvio.data.error) {
                Swal.fire(response_reenvio.data.error, '', 'error');
            } else if (response_reenvio.data.correo) {
                Swal.fire(response_reenvio.data.correo, '', 'error');
            } else {
                Swal.fire('Error al reenviar correo', '', 'error');
            }
        }
    }

    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Reseteo
    const resetear = () => {
        setEmail('');
    }
    return (
        <div className="cuerpo_general">
            <CabeceraRegister />
            {/* Modal de reenvío de codigo */}
            <Modal show={verModal} onHide={cerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reenvío de código de verificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontSize: '1rem' }}>Ingrese su correo electrónico para reenviar el código de verificación</p>
                    <form onSubmit={enviarFormulario}>
                        <div className="form-group">
                            <label className='label' htmlFor="correo">Correo electrónico:</label>
                            <input className='form-control w-100' type="text"
                                placeholder="Ingrese el correo electrónico*" id="correo"
                                value={email_usuario} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <Button type="submit" variant="success" disabled={habilitado}>
                            {habilitado ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
            {/* Modal de reenvío de codigo */}
            <Container className="cuerpo_form_v">
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-6">
                            <h4 style={{ padding: '10px' }}> Verificar cuenta</h4>
                        </div>
                        <div className='card-body col-md-4'>
                            <Button className="btn btn-success mt-2" onClick={abrirModal}>
                                Reenviar código
                            </Button>
                        </div>
                        <div className='card-body col-md-2'>
                            <Link to={'/login'} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        < FormularioConfirmacion />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}


// Formulario de cambio de clave
export function RecuperacionCuenta() {
    return (
        <div className="cuerpo_general">
            <CabeceraRegister />
            <Container className="cuerpo_form">
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-9">
                            <h4 style={{ padding: '10px' }}> Recuperación de cuenta</h4>
                        </div>
                        <div className='card-body col-md-2'>
                            <Link to={'/login'} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        < FormularioRecuperacion />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}


// Formulario de cambio completo
export function CambioClave() {
    return (
        <div className="cuerpo_general">
            <CabeceraRegister />
            <Container className="cuerpo_form">
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-9">
                            <h4 style={{ padding: '10px' }}> Recuperación de cuenta</h4>
                        </div>
                        <div className='card-body col-md-2'>
                            <Link to={'/login'} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        < FormularioCambio />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}
