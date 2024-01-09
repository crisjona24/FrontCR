/* ******** FORMULARIO DE REGISTRO ******* */
// Estilos
import "bootstrap/dist/css/bootstrap.min.css"
// Componentes
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Button } from "react-bootstrap";
// Metodos
import {
    UsuarioCrearNuevo, VerificarUsuario, UsuarioIndividual, UsuarioEditar,
    CrearComunNew, ComunIndividual, ComunEditar, CrearPaciente, PacienteIndividual,
    PacienteEditar, ReverificarCuenta
} from "../../api/usuario.api";

/* FORMULARIO TECNICO */
export function FormularioUsuario() {
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [datos, setDatos] = useState([]);
    const [nombre_usuario, setNombre] = useState("");
    const [apellido_usuario, setApellido] = useState("");
    const [email_usuario, setEmail] = useState("");
    const [username_usuario, setUsername] = useState("");
    const [password_usuario, setPassword] = useState("");
    const [password_usuario_2, setPassword2] = useState("");
    const [celular, setCelular] = useState("");
    const [cedula, setCedula] = useState("");
    const [fecha_nacimiento, setFecha] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();
    // Validar entrada
    const [entradaValida, setEntradaValida] = useState(false);
    const [entradaValidaApellido, setEntradaValidaApellido] = useState(false);

    // Mostrar clave
    const [verClave, setVerClave] = useState(false);
    const [verClave2, setVerClave2] = useState(false);

    // REGISTRO DE USUARIO
    const enviarFT = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre_usuario, apellido_usuario, email_usuario, username_usuario,
            password_usuario, celular, fecha_nacimiento, password_usuario_2, cedula)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Verificar formato de nombre
        if (!entradaValida) {
            Swal.fire("Ingrese el formato: Nombre Nombre", "", "warning");
            return;
        }
        if (!entradaValidaApellido) {
            Swal.fire("Ingrese el formato: Apellido Apellido", "", "warning");
            return;
        }
        // Validar cédula
        if (cedula.length !== 10) {
            Swal.fire("La cédula debe tener 10 dígitos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            const datos__post = {
                nombre_usuario,
                apellido_usuario,
                email_usuario,
                username_usuario,
                password_usuario,
                celular,
                fecha_nacimiento,
                cedula
            };
            if (!compararClave(password_usuario, password_usuario_2)) {
                Swal.fire("Las claves no coinciden", "", "warning");
                setHabilitado(false);
                return;
            }
            // Realizar la petición POST al servidor
            guardar(datos__post);

        } catch (error) {
            mostrarError('Error al registrar usuario');
        }
        setHabilitado(false);
    };

    // Funcion para guardar datos
    const guardar = async (datos__post) => {
        const response = await UsuarioCrearNuevo(datos__post);
        // Confirmar operación
        if (response.data.success) {
            Swal.fire("Visite su correo electrónco y use el código de verificación", "", "success");
            navigate('/login');
        } else {
            if (response.data.error) {
                Swal.fire(response.data.error, '', 'error');
            } else if (response.data.clave) {
                Swal.fire(response.data.clave, '', 'error');
                mostrarError('La clave debe tener mínimo 8 caracteres que incluye una letra mayúscula, un número y un símbolo');
            } else if (response.data.correo) {
                Swal.fire(response.data.correo, '', 'error');
            } else if (response.data.celular) {
                Swal.fire(response.data.celular, '', 'error');
            } else if (response.data.correo_validado) {
                // Panel de confirmacion de reenvio de correo de verificación
                Swal.fire({
                    title: '¿Usted tiene un registro de cuenta sin validar, desea reenviar el correo de verificación?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Reenviar',
                    denyButtonText: 'No reenviar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const datos__post = {
                                email_usuario
                            };
                            const response_reenvio = await ReverificarCuenta(datos__post);
                            if (response_reenvio.data.success) {
                                Swal.fire("Visite su correo electrónco y use el código de verificación", "", "success");
                                navigate('/login');
                            } else {
                                if (response_reenvio.data.error) {
                                    Swal.fire(response_reenvio.data.error, '', 'error');
                                } else if (response_reenvio.data.correo) {
                                    Swal.fire(response_reenvio.data.correo, '', 'error');
                                } else {
                                    Swal.fire('Error al reenviar correo', '', 'error');
                                }
                            }
                        } catch (error) {
                            Swal.fire('Error al reenviar correo', '', 'error');
                        }
                    } else if (result.isDenied) {
                        Swal.fire('El correo no se reenvió', '', 'info');
                    }
                });
            } else if (response.data.cedula) {
                Swal.fire(response.data.cedula, '', 'error');
            } else {
                mostrarError('Datos no válidos');
            }
        }
    }

    // EDICION DE REGISTRO DE USUARIO 
    const enviarFTEdicion = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre_usuario, apellido_usuario,
            celular, fecha_nacimiento)) {
            Swal.fire("Por favor ingrese todos los campos de edición", "", "warning");
            return;
        }
        // Verificar formato de nombre
        if (!entradaValida) {
            Swal.fire("Ingrese el formato: Nombre Nombre", "", "warning");
            return;
        }
        if (!entradaValidaApellido) {
            Swal.fire("Ingrese el formato: Apellido Apellido", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                const datos__edit = {
                    nombre_usuario,
                    apellido_usuario,
                    celular,
                    fecha_nacimiento
                };
                // Llamamos a la función de editar usuario
                await confirmEdicion(datos__edit);
            }
        } catch (error) {
            mostrarError('Error al registrar usuario');
        }
        setHabilitado(false);
    };

    // Obtener datos de tecnico
    const obtenerDatosUsuario = async () => {
        try {
            const cont = await VerificarUsuario();
            if (cont.data.success) {
                setDatos(cont.data);
                const datos__user = await UsuarioIndividual(cont.data.identificador);
                setNombre(datos__user.data.nombre_usuario);
                setApellido(datos__user.data.apellido_usuario);
                setPassword("---");
                setCelular(datos__user.data.celular);
                setFecha(datos__user.data.fecha_nacimiento);
                console.log(datos__user.data);
            } else {
                if (cont.data.error) {
                    Swal.fire(cont.data.error, '', 'error');
                } else {
                    navigate('/login');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al mostrar datos de usuario');
            }
        }
    }

    // Use effect
    useEffect(() => {
        if (token) {
            obtenerDatosUsuario();
        }
    }, []);

    // Edicion
    const confirmEdicion = async (datos__edit) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en su perfil?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await UsuarioEditar(datos.identificador, datos__edit);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate('/perfil');
                } catch (error) {
                    Swal.fire('Error al actualizar perfil', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/perfil');
            }
        });
    };

    // CONTROLES DE ENTRADA Y SALIDA DE DATOS
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 9000); // 8 segundos
    };

    // Visibilidad de la clave
    const observarClave = () => {
        setVerClave(!verClave);
    }

    const observarClave2 = () => {
        setVerClave2(!verClave2);
    }

    // Comparar claves
    const compararClave = (clave1, clave2) => {
        if (clave1 === clave2) {
            return true;
        } else {
            return false;
        }
    };

    // Validar cedula que sea entrada solo numerica
    const validarCedula = (e) => {
        if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
            setCedula(e.target.value);
            return true;
        }
        return false;
    }

    // Controlar que Nombre tenga dos valores separados por un espacio delimitador
    const Entrada_Nombre = (e) => {
        const value = e.target.value;
        setNombre(value);
        if (!validarEntrada(value)) {
            setEntradaValida(false);
        } else {
            setEntradaValida(true);
        }
    };

    const Entrada_Apellido = (e) => {
        const value = e.target.value;
        setApellido(value);
        if (!validarEntrada(value)) {
            setEntradaValidaApellido(false);
        } else {
            setEntradaValidaApellido(true);
        }
    };

    const validarEntrada = (value) => {
        // Evaluar dos valoes letras y que permita la ñ
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };


    return (
        <form onSubmit={
            datos?.tipo ? enviarFTEdicion : enviarFT
        }>
            <>
                {error && <span>{error}</span>}
            </>
            <div className='form-row row mt-1'>
                <div className="form-group col-md-6">
                    <label className='label' htmlFor="nombre">Nombre:</label>
                    <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" name='nombre' id="nombre"
                        value={nombre_usuario} onChange={Entrada_Nombre} autoFocus />
                </div>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="apellido">Apellido:</label>
                    <input className='form-control w-100' type="text" placeholder="Ingrese el apellido**" name='apellido' id="apellido"
                        value={apellido_usuario} onChange={Entrada_Apellido}
                    />
                </div>
            </div>

            <>
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className="form-group col-md-6">
                            <label className='label' htmlFor="email"> Correo Electrónico::</label>
                            <input className='form-control w-100' type="text" placeholder="Ingrese el correo electrónico**" name='email' id="email"
                                value={email_usuario} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group col-md-6">
                            <label className='label' htmlFor="username">Usuario:</label>
                            <input className='form-control w-100' type="text" placeholder="Ingrese el username**" name='username' id="username"
                                value={username_usuario} onChange={e => setUsername(e.target.value)} />
                        </div>
                    </div>
                }
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-11'>
                            <label className='label' htmlFor="password">Clave:</label>
                            <input className='form-control w-100'
                                type={verClave ? "text" : "password"}
                                placeholder="8 caracteres con una letra mayúscula, un número y un símbolo**"
                                name='password' id="password"
                                value={password_usuario} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group col-md-1 mt-4 d-flex justify-content-center">
                            <Button variant="success" onClick={observarClave}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </div>
                    </div>
                }
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-11'>
                            <label className='label' htmlFor="password2">Confirmar clave:</label>
                            <input className='form-control w-100'
                                type={verClave2 ? "text" : "password"}
                                placeholder="Vuelve a escribir la clave**"
                                name='password2' id="password2"
                                value={password_usuario_2} onChange={e => setPassword2(e.target.value)} />
                        </div>
                        <div className="form-group col-md-1 mt-4 d-flex justify-content-center">
                            <Button variant="success" onClick={observarClave2}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </div>
                    </div>
                }
            </>
            <div className='form-row row'>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="celular">Número de teléfono:</label>
                    <input className='form-control w-100' maxLength={10} type="text" placeholder="Ingrese el número de celular**" name='celular' id="celular"
                        value={celular}
                        onChange={e => {
                            // Comprobar si la entrada es un número o si es un backspace/delete
                            if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                setCelular(e.target.value);
                            }
                        }} />
                </div>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="fecha">Fecha de nacimiento:</label>
                    <input className='form-control w-100' maxLength={10} type="date" name='fecha' id="fecha"
                        value={fecha_nacimiento} onChange={e => setFecha(e.target.value)} />
                </div>
            </div>
            <div className='form-group'>
                <label className='label' htmlFor="cedula">Cédula de identidad:</label>
                <input className='form-control w-100' maxLength={10} type="text" placeholder="Ingrese el número de cédula**" name='cedula' id="cedula"
                    value={cedula}
                    onChange={validarCedula} />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )
}


/* FORMULARIO COMUN */
export function FormularioComun() {
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [datos, setDatos] = useState([]);
    const [nombre_usuario, setNombre] = useState("");
    const [apellido_usuario, setApellido] = useState("");
    const [email_usuario, setEmail] = useState("");
    const [username_usuario, setUsername] = useState("");
    const [password_usuario, setPassword] = useState("");
    const [password_usuario_2, setPassword2] = useState("");
    const [celular, setCelular] = useState("");
    const [cedula, setCedula] = useState("");
    const [fecha_nacimiento, setFecha] = useState("");
    const [genero, setGenero] = useState("");
    const [area_estudio, setAreaEstudio] = useState("");
    const [error, setError] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const navigate = useNavigate();
    // Mostrar clave
    const [verClave, setVerClave] = useState(false);
    const [verClave2, setVerClave2] = useState(false);
    // Validar entrada
    const [entradaValida, setEntradaValida] = useState(false);
    const [entradaValidaApellido, setEntradaValidaApellido] = useState(false);

    // REGISTRO 
    // Operacion de guardar datos
    const enviarFComun = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre_usuario, apellido_usuario, email_usuario, username_usuario, cedula,
            password_usuario, celular, fecha_nacimiento, genero, area_estudio, password_usuario_2)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Verificar formato de nombre
        if (!entradaValida) {
            Swal.fire("Ingrese el formato: Nombre Nombre", "", "warning");
            return;
        }
        if (!entradaValidaApellido) {
            Swal.fire("Ingrese el formato: Apellido Apellido", "", "warning");
            return;
        }
        // Validar cédula
        if (cedula.length !== 10) {
            Swal.fire("La cédula debe tener 10 dígitos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            const datos__post = {
                nombre_usuario,
                apellido_usuario,
                email_usuario,
                username_usuario,
                password_usuario,
                celular,
                fecha_nacimiento,
                genero,
                area_estudio,
                cedula
            };
            console.log(datos__post)
            if (!compararClave(password_usuario, password_usuario_2)) {
                Swal.fire("Las claves no coinciden", "", "warning");
                setHabilitado(false);
                return;
            }
            // Realizar la petición POST al servidor
            guardar(datos__post);
        } catch (error) {
            mostrarError('Error al registrar usuario');
        }
        setHabilitado(false);
    };

    // Guardar datos de usuario comun
    const guardar = async (datos__post) => {
        const response = await CrearComunNew(datos__post);
        // Confirmar operación
        if (response.data.success) {
            Swal.fire("Visite su correo electrónco y use el código de verificación", "", "success");
            navigate('/login');
        } else {
            if (response.data.error) {
                Swal.fire(response.data.error, '', 'error');
            } else if (response.data.clave) {
                Swal.fire(response.data.clave, '', 'error');
                mostrarError('La clave debe tener mínimo 8 caracteres que incluye una letra mayúscula, un número y un símbolo');
            } else if (response.data.correo) {
                Swal.fire(response.data.correo, '', 'error');
            } else if (response.data.celular) {
                Swal.fire(response.data.celular, '', 'error');
            } else if (response.data.correo_validado) {
                // Panel de confirmacion de reenvio de correo de verificación
                Swal.fire({
                    title: '¿Usted tiene un registro de cuenta sin validar, desea reenviar el correo de verificación?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Reenviar',
                    denyButtonText: 'No reenviar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const datos__post = {
                                email_usuario
                            };
                            const response_reenvio = await ReverificarCuenta(datos__post);
                            if (response_reenvio.data.success) {
                                Swal.fire("Visite su correo electrónco y use el código de verificación", "", "success");
                                navigate('/login');
                            } else {
                                if (response_reenvio.data.error) {
                                    Swal.fire(response_reenvio.data.error, '', 'error');
                                } else if (response_reenvio.data.correo) {
                                    Swal.fire(response_reenvio.data.correo, '', 'error');
                                } else {
                                    Swal.fire('Error al reenviar correo', '', 'error');
                                }
                            }
                        } catch (error) {
                            Swal.fire('Error al reenviar correo', '', 'error');
                        }
                    } else if (result.isDenied) {
                        Swal.fire('El correo no se reenvió', '', 'info');
                    }
                });
            } else if (response.data.cedula) {
                Swal.fire(response.data.cedula, '', 'error');
            }
            else {
                mostrarError('Datos no válidos');
            }

        }
    }

    // EDICION DE REGISTRO 
    // Obtener datos de comun
    const obtenerDatosComun = async () => {
        try {
            const contUC = await VerificarUsuario();
            if (contUC.data.success) {
                setDatos(contUC.data);
                const datos__user = await ComunIndividual(contUC.data.identificador);
                setNombre(datos__user.data.nombre_usuario);
                setApellido(datos__user.data.apellido_usuario);
                setPassword("---");
                setCelular(datos__user.data.celular);
                setFecha(datos__user.data.fecha_nacimiento);
                setGenero(datos__user.data.genero);
                setAreaEstudio(datos__user.data.area_estudio);
            } else {
                if (contUC.data.error) {
                    Swal.fire(contUC.data.error, '', 'error');
                } else {
                    navigate('/login');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al mostrar datos de usuario');
            }
        }
    }

    // Operacion de guardar datos
    const enviarFComunEdicion = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre_usuario, apellido_usuario,
            celular, fecha_nacimiento, genero, area_estudio)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Verificar formato de nombre y apellido
        if (!entradaValida) {
            Swal.fire("Ingrese el formato: Nombre Nombre", "", "warning");
            return;
        }
        if (!entradaValidaApellido) {
            Swal.fire("Ingrese el formato: Apellido Apellido", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                const datos__edit = {
                    nombre_usuario,
                    apellido_usuario,
                    celular,
                    fecha_nacimiento,
                    genero,
                    area_estudio
                }
                // Llamamos a la función de editar usuario
                await confirmEdicion(datos__edit);
            }
        } catch (error) {
            mostrarError('Error al registrar usuario');
        }
        setHabilitado(false);
    };

    // Use Effect
    useEffect(() => {
        if (token) {
            obtenerDatosComun();
        }
    }, []);

    // Edicion
    const confirmEdicion = async (datos__edit) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en su perfil?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ComunEditar(datos.identificador, datos__edit);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate('/perfil');
                } catch (error) {
                    Swal.fire('Error al actualizar perfil', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/perfil');
            }
        });
    };

    // CONTROLES DE ENTRADA Y SALIDA
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 9000); // 8 segundos
    };

    // Visibilidad de la clave
    const observarClave = () => {
        setVerClave(!verClave);
    }

    const observarClave2 = () => {
        setVerClave2(!verClave2);
    }

    // Comparar claves
    const compararClave = (clave1, clave2) => {
        if (clave1 === clave2) {
            return true;
        } else {
            return false;
        }
    };

    // Validar cedula que sea entrada solo numerica
    const validarCedula = (e) => {
        if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
            setCedula(e.target.value);
            return true;
        }
        return false;
    }

    // Controlar que Nombre tenga dos valores separados por un espacio delimitador
    const Entrada_Nombre = (e) => {
        const value = e.target.value;
        setNombre(value);
        if (!validarEntrada(value)) {
            setEntradaValida(false);
        } else {
            setEntradaValida(true);
        }
    };

    const Entrada_Apellido = (e) => {
        const value = e.target.value;
        setApellido(value);
        if (!validarEntrada(value)) {
            setEntradaValidaApellido(false);
        } else {
            setEntradaValidaApellido(true);
        }
    };

    const validarEntrada = (value) => {
        // Evaluar dos valoes letras y que permita la ñ
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };

    return (
        <form onSubmit={
            datos?.tipo ? enviarFComunEdicion : enviarFComun
        }>
            <>
                {error && <span>{error}</span>}
            </>
            <div className='form-row row mt-1'>
                <div className="form-group col-md-6">
                    <label className='label' htmlFor="nombre">Nombres:</label>
                    <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" name='nombre' id="nombre"
                        value={nombre_usuario}
                        onChange={Entrada_Nombre}
                        autoFocus />
                </div>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="apellido">Apellidos:</label>
                    <input className='form-control w-100' type="text" placeholder="Ingrese el apellido**" name='apellido' id="apellido"
                        value={apellido_usuario} onChange={Entrada_Apellido}
                    />
                </div>
            </div>
            <>
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-6'>
                            <label className='label' htmlFor="email"> Correo Electrónico::</label>
                            <input className='form-control w-100' type="text" placeholder="Ingrese el correo electrónico**" name='email' id="email"
                                value={email_usuario} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className='form-group col-md-6'>
                            <label className='label' htmlFor="username">Usuario:</label>
                            <input className='form-control w-100' type="text" placeholder="Ingrese el username**" name='username' id="username"
                                value={username_usuario} onChange={e => setUsername(e.target.value)} />
                        </div>
                    </div>
                }
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-11'>
                            <label className='label' htmlFor="password">Clave:</label>
                            <input className='form-control w-100'
                                type={verClave ? "text" : "password"}
                                placeholder="8 caracteres con una letra mayúscula, un número y un símbolo**"
                                name='password' id="password"
                                value={password_usuario} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group col-md-1 mt-4 d-flex justify-content-center">
                            <Button variant="success" onClick={observarClave}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </div>
                    </div>
                }
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-11'>
                            <label className='label' htmlFor="password2">Confirmar clave:</label>
                            <input className='form-control w-100'
                                type={verClave2 ? "text" : "password"}
                                placeholder="Vuelve a escribir la clave**"
                                name='password2' id="password2"
                                value={password_usuario_2} onChange={e => setPassword2(e.target.value)} />
                        </div>
                        <div className="form-group col-md-1 mt-4 d-flex justify-content-center">
                            <Button variant="success" onClick={observarClave2}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </div>
                    </div>
                }

            </>
            <div className='form-row row'>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="celular">Número de teléfono:</label>
                    <input className='form-control w-100' maxLength={10} type="text" placeholder="Ingrese el número de celular**" name='celular' id="celular"
                        value={celular}
                        onChange={e => {
                            if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                setCelular(e.target.value);
                            }
                        }} />
                </div>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="fecha">Fecha de nacimiento:</label>
                    <input className='form-control w-100' maxLength={10} type="date" name='fecha' id="fecha"
                        value={fecha_nacimiento} onChange={e => setFecha(e.target.value)} />
                </div>
            </div>
            <div className='form-row row'>
                <div className="form-group col-md-6">
                    <label className='label' htmlFor="genero">Género:</label>
                    <select className="form-control w-100" id="genero"
                        name="genero" value={genero} onChange={e => setGenero(e.target.value)}>
                        <option value="none">----</option>
                        <option value="Masculino">Soy chico</option>
                        <option value="Femenino">Soy chica</option>
                        <option value="Otro">Prefiero no decirlo</option>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label className='label' htmlFor="area">Área de estudio:</label>
                    <select className="form-control w-100" id="area"
                        name="area" value={area_estudio} onChange={e => setAreaEstudio(e.target.value)}>
                        <option value="none">----</option>
                        <option value="Tecnico">Técnico</option>
                        <option value="Psicopedagogo">Psicopedagogo</option>
                    </select>
                </div>
            </div>
            <div className='form-group'>
                <label className='label' htmlFor="cedula">Cédula de identidad:</label>
                <input className='form-control w-100' maxLength={10} type="text" placeholder="Ingrese el número de cédula**" name='cedula' id="cedula"
                    value={cedula}
                    onChange={validarCedula} />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )

}


/* FORMULARIO PACIENTE */
export function FormularioPaciente() {
    /* *** Form **** */
    const token = localStorage.getItem('token');
    const [datos, setDatos] = useState([]);
    const [nombre_usuario, setNombre] = useState("");
    const [apellido_usuario, setApellido] = useState("");
    const [email_usuario, setEmail] = useState("");
    const [username_usuario, setUsername] = useState("");
    const [password_usuario, setPassword] = useState("");
    const [password_usuario_2, setPassword2] = useState("");
    const [celular, setCelular] = useState("");
    const [cedula, setCedula] = useState("");
    const [fecha_nacimiento, setFecha] = useState("");
    const [contacto_emergencia, setContactoEmergencia] = useState("");
    const [direccion, setDireccion] = useState("");
    const [habilitado, setHabilitado] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Mostrar clave
    const [verClave, setVerClave] = useState(false);
    const [verClave2, setVerClave2] = useState(false);
    // Validar entrada
    const [entradaValida, setEntradaValida] = useState(false);
    const [entradaValidaApellido, setEntradaValidaApellido] = useState(false);

    // REGISTRO DE DATOS DE ESTUDIANTE
    // Operacion de guardar datos
    const enviarFP = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre_usuario, apellido_usuario, email_usuario, username_usuario, cedula,
            password_usuario, celular, fecha_nacimiento, contacto_emergencia, direccion, password_usuario_2)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Verificar formato de nombre
        if (!entradaValida) {
            Swal.fire("Ingrese el formato: Nombre Nombre", "", "warning");
            return;
        }
        if (!entradaValidaApellido) {
            Swal.fire("Ingrese el formato: Apellido Apellido", "", "warning");
            return;
        }
        // Validar tamaño de cédula
        if (cedula.length !== 10) {
            Swal.fire("La cédula debe tener 10 dígitos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            const datos__post = {
                nombre_usuario,
                apellido_usuario,
                email_usuario,
                username_usuario,
                password_usuario,
                celular,
                fecha_nacimiento,
                contacto_emergencia,
                direccion,
                cedula
            };
            if (!compararClave(password_usuario, password_usuario_2)) {
                Swal.fire("Las claves no coinciden", "", "warning");
                setHabilitado(false);
                return;
            }
            // Realizar la petición POST al servidor
            guardar(datos__post);
        } catch (error) {
            mostrarError('Error al registrar usuario');
        }
        setHabilitado(false);
    };

    // Guardar datos
    const guardar = async (datos__post) => {
        const response = await CrearPaciente(datos__post);
        // Confirmar operación
        if (response.data.success) {
            Swal.fire("Visite su correo electrónco y use el código de verificación", "", "success");
            navigate('/login');
        } else {
            if (response.data.error) {
                Swal.fire(response.data.error, '', 'error');
            } else if (response.data.clave) {
                Swal.fire(response.data.clave, '', 'error');
                mostrarError('La clave debe tener mínimo 8 caracteres que incluye una letra mayúscula, un número y un símbolo');
            } else if (response.data.correo) {
                Swal.fire(response.data.correo, '', 'error');
            } else if (response.data.celular) {
                Swal.fire(response.data.celular, '', 'error');
            } else if (response.data.correo_validado) {
                // Panel de confirmacion de reenvio de correo de verificación
                Swal.fire({
                    title: '¿Usted tiene un registro de cuenta sin validar, desea reenviar el correo de verificación?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Reenviar',
                    denyButtonText: 'No reenviar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const datos__post = {
                                email_usuario
                            };
                            const response_reenvio = await ReverificarCuenta(datos__post);
                            if (response_reenvio.data.success) {
                                Swal.fire("Visite su correo electrónco y use el código de verificación", "", "success");
                                navigate('/login');
                            } else {
                                if (response_reenvio.data.error) {
                                    Swal.fire(response_reenvio.data.error, '', 'error');
                                } else if (response_reenvio.data.correo) {
                                    Swal.fire(response_reenvio.data.correo, '', 'error');
                                } else {
                                    Swal.fire('Error al reenviar correo', '', 'error');
                                }
                            }
                        } catch (error) {
                            Swal.fire('Error al reenviar correo', '', 'error');
                        }
                    } else if (result.isDenied) {
                        Swal.fire('El correo no se reenvió', '', 'info');
                    }
                });
            } else if (response.data.cedula) {
                Swal.fire(response.data.cedula, '', 'error');
            } else {
                mostrarError('Datos no válidos');
            }
        }
    }

    // EDICION DEL REGISTRO DE ESTUDIANTE
    const enviarFPEdicion = async (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre_usuario, apellido_usuario,
            celular, fecha_nacimiento, contacto_emergencia, direccion)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Verificar formato de nombre
        if (!entradaValida) {
            Swal.fire("Ingrese el formato: Nombre Nombre", "", "warning");
            return;
        }
        if (!entradaValidaApellido) {
            Swal.fire("Ingrese el formato: Apellido Apellido", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            if (token) {
                const datos__edit = {
                    nombre_usuario,
                    apellido_usuario,
                    celular,
                    fecha_nacimiento,
                    contacto_emergencia,
                    direccion
                }
                // Llamamos a la función de editar usuario
                await confirmEdicion(datos__edit);
            }
        } catch (error) {
            mostrarError('Error al registrar usuario');
        }
        setHabilitado(false);
    };

    // Obtener datos de paciente
    const obtenerDatosP = async () => {
        try {
            const contP = await VerificarUsuario();
            if (contP.data.success) {
                setDatos(contP.data);
                const datos__user = await PacienteIndividual(contP.data.identificador);
                setNombre(datos__user.data.nombre_usuario);
                setApellido(datos__user.data.apellido_usuario);
                setCelular(datos__user.data.celular);
                setPassword("---");
                setContactoEmergencia(datos__user.data.contacto_emergencia);
                setFecha(datos__user.data.fecha_nacimiento);
                setDireccion(datos__user.data.direccion);
            } else {
                if (contP.data.error) {
                    Swal.fire(contP.data.error, '', 'error');
                } else {
                    navigate('/login');
                }
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/');
            } else {
                mostrarError('Error al mostrar datos de usuario');
            }
        }
    }

    // Use  effect para obtener los datos
    useEffect(() => {
        if (token) {
            obtenerDatosP();
        }
    }, []);

    // Edicion
    const confirmEdicion = async (datos__edit) => {
        return Swal.fire({
            title: '¿Desea guardar los cambios en su perfil?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: 'No guardar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await PacienteEditar(datos.identificador, datos__edit);
                    Swal.fire("Datos actualizados", "", "success");
                    navigate('/perfil');
                } catch (error) {
                    Swal.fire('Error al actualizar perfil', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Los cambios no se guardaron', '', 'info');
                navigate('/perfil');
            }
        });
    };

    // CONTROL DE ENTRADAS Y SALIDAS
    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Mostrar error
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 9000);
    };

    // Visibilidad de la clave
    const observarClave = () => {
        setVerClave(!verClave);
    }

    const observarClave2 = () => {
        setVerClave2(!verClave2);
    }

    // Comparar claves
    const compararClave = (clave1, clave2) => {
        if (clave1 === clave2) {
            return true;
        } else {
            return false;
        }
    };

    // Validar cedula que sea entrada solo numerica
    const validarCedula = (e) => {
        if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
            setCedula(e.target.value);
            return true;
        }
        return false;
    }

    // Controlar que Nombre tenga dos valores separados por un espacio delimitador
    const Entrada_Nombre = (e) => {
        const value = e.target.value;
        setNombre(value);
        if (!validarEntrada(value)) {
            setEntradaValida(false);
        } else {
            setEntradaValida(true);
        }
    };

    const Entrada_Apellido = (e) => {
        const value = e.target.value;
        setApellido(value);
        if (!validarEntrada(value)) {
            setEntradaValidaApellido(false);
        } else {
            setEntradaValidaApellido(true);
        }
    };

    const validarEntrada = (value) => {
        // Evaluar dos valoes letras y que permita la ñ
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };

    return (
        <form onSubmit={
            datos?.tipo ? enviarFPEdicion : enviarFP
        }>
            <>
                {error && <span>{error}</span>}
            </>
            <div className='form-row row mt-1'>
                <div className="form-group col-md-6">
                    <label className='label' htmlFor="nombre">Nombre:</label>
                    <input className='form-control w-100' type="text" placeholder="Ingrese el nombre**" name='nombre' id="nombre"
                        value={nombre_usuario} onChange={Entrada_Nombre} autoFocus />
                </div>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="apellido">Apellido:</label>
                    <input className='form-control w-100' type="text" placeholder="Ingrese el apellido**" name='apellido' id="apellido"
                        value={apellido_usuario} onChange={Entrada_Apellido}
                    />
                </div>
            </div>
            <>
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-6'>
                            <label className='label' htmlFor="email"> Correo Electrónico:</label>
                            <input className='form-control w-100' type="text" placeholder="Ingrese el correo electrónico**" name='email' id="email"
                                value={email_usuario} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className='form-group col-md-6'>
                            <label className='label' htmlFor="username">Usuario:</label>
                            <input className='form-control w-100' type="text" placeholder="Ingrese el username**" name='username' id="username"
                                value={username_usuario} onChange={e => setUsername(e.target.value)} />
                        </div>
                    </div>
                }
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-11'>
                            <label className='label' htmlFor="password">Clave:</label>
                            <input className='form-control w-100'
                                type={verClave ? "text" : "password"}
                                placeholder="8 caracteres con una letra mayúscula, un número y un símbolo**"
                                name='password' id="password"
                                value={password_usuario} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group col-md-1 mt-4 d-flex justify-content-center">
                            <Button variant="success" onClick={observarClave}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </div>
                    </div>
                }
                {
                    !datos?.tipo &&
                    <div className='form-row row'>
                        <div className='form-group col-md-11'>
                            <label className='label' htmlFor="password2">Confirmar clave:</label>
                            <input className='form-control w-100'
                                type={verClave2 ? "text" : "password"}
                                placeholder="Vuelve a escribir la clave**"
                                name='password2' id="password2"
                                value={password_usuario_2} onChange={e => setPassword2(e.target.value)} />
                        </div>
                        <div className="form-group col-md-1 mt-4 d-flex justify-content-center">
                            <Button variant="success" onClick={observarClave2}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </div>
                    </div>
                }
            </>
            <div className='form-row row'>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="celular">Número de teléfono:</label>
                    <input className='form-control w-100' maxLength={10} type="text" placeholder="Ingrese celular**" name='celular' id="celular"
                        value={celular}
                        onChange={e => {
                            if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                setCelular(e.target.value);
                            }
                        }} />
                </div>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="fecha">Fecha de nacimiento:</label>
                    <input className='form-control w-100' maxLength={10} type="date" name='fecha' id="fecha"
                        value={fecha_nacimiento} onChange={e => setFecha(e.target.value)} />
                </div>
            </div>
            <div className='form-row row'>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="contacto">Contacto de emergencia:</label>
                    <input className='form-control w-100' maxLength={10} type="text" placeholder="Contacto de emergencia**" name='contacto' id="contacto"
                        value={contacto_emergencia}
                        onChange={e => {
                            // Comprobar si la entrada es un número o si es un backspace/delete
                            if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                setContactoEmergencia(e.target.value);
                            }
                        }} />
                </div>
                <div className='form-group col-md-6'>
                    <label className='label' htmlFor="direccion">Dirección:</label>
                    <input className='form-control w-100' type="text" placeholder="Ingrese su dirección**" name='direccion' id="direccion"
                        value={direccion} onChange={e => setDireccion(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-group'>
                <label className='label' htmlFor="cedula">Cédula de identidad:</label>
                <input className='form-control w-100' maxLength={10} type="text" placeholder="Ingrese el número de cédula**" name='cedula' id="cedula"
                    value={cedula}
                    onChange={validarCedula} />
            </div>
            <Button type="submit" variant="success" disabled={habilitado}>
                {habilitado ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    )
}
