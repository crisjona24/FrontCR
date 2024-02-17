// Estilos
import "../../styles/Lista.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table, Modal } from "react-bootstrap";
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faCheckDouble, faPencil, faTrash, faPlusCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import Swal from "sweetalert2";
// Metodos
import { SalaEliminar, AtenderSala } from "../../api/sala.api"
import { ReporteEliminar, CrearReporteNuevo, ModificarEstadoResultado, GenerarReporteAll } from "../../api/reporte.api"
import { ResultadoEliminar } from "../../api/resultado.api"


// Sala generales
export function ListadodeSala({ salas, usuario, page, setPage, numeroPag, isActive }) {
    const navigate = useNavigate();
    // Paginacion siguente
    const anterior = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    // Paginacion anterior
    const siguiente = () => {
        setPage(prevPage => (prevPage < numeroPag ? prevPage + 1 : prevPage));
    };

    return (
        <div className="cuerpo-tabla-4">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12">
                                    <>
                                        {
                                            usuario.tipo === "comun" &&
                                            <Link to={'/sala/registro'} className="btn btn-sm btn-primary pull-left">
                                                <FontAwesomeIcon icon={faPlusCircle} title="Agregar sala" /> Agregar nuevo
                                            </Link>
                                        }
                                    </>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body_5 table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th className="text-center">Nombre</th>
                                        <th className="text-center">
                                            {
                                                usuario.tipo === "comun" ?
                                                    "Código" :
                                                    "Estado"
                                            }

                                        </th>
                                        <th>Anotaciones</th>
                                        <th className="text-center">Fecha</th>
                                        <th className="text-center">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            salas.map((sala) => (
                                                <tr key={sala.id}>
                                                    <td className="text-center">{sala.nombre_sala}</td>
                                                    <td className="text-center">
                                                        {
                                                            usuario.tipo === "comun" ?
                                                                sala.codigo_identificador :
                                                                sala.sala_atendida === true ?
                                                                    <span className="label label-success">Atendida</span>
                                                                    :
                                                                    <span className="label label-danger">Sin atender</span>
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: 'justify' }}>
                                                        {
                                                            usuario.tipo === "comun" ?
                                                                sala.anotaciones :
                                                                sala.anotaciones + ". Con los códigos/o: " + sala.codigo_identificador
                                                        }
                                                    </td>
                                                    <td className="text-center">{sala.fecha_registro_sala}</td>
                                                    <td >
                                                        <ul
                                                            className={`action-list ${sala.sala_atendida === true && usuario.tipo === 'comun' ? 'd-flex justify-content-center'
                                                                : usuario.tipo === 'tecnico' ? 'd-flex justify-content-center' :
                                                                    sala.sala_atendida == false && usuario.tipo === 'comun' ? 'd-flex justify-content-center'
                                                                        : ""}`}>
                                                            <Button title="Eliminar sala" variant="danger"
                                                                className={`separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea eliminar la sala?',
                                                                        text: "Eliminar sala creada",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            await SalaEliminar(sala.id);
                                                                            Swal.fire("Eliminación exitosa", "", "success");
                                                                            navigate('/nivel/all');
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                            {
                                                                usuario.tipo === "comun" && sala.sala_atendida === false &&
                                                                <Link to={`/sala/editar/${sala.id}/`} title="Editar sala"
                                                                    className={`btn btn-primary separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencil} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                                </Link>
                                                            }
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            salas.length === 0 &&
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                    </>
                                </tbody>
                            </Table>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-sm-1 col-xs-1">
                                    <Link to={'/nivel/all'}
                                        className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Salas Creadas</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Adelante">
                                        <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }}
                                            className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}


// Sala de paciente
export function ListadodeSalaPaciente({ salas, page, setPage, numeroPag, isActive }) {
    // Paginacion siguente
    const anterior = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    // Paginacion anterior
    const siguiente = () => {
        setPage(prevPage => (prevPage < numeroPag ? prevPage + 1 : prevPage));
    };

    return (
        <div className="cuerpo-tabla-3">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                            </div>
                        </div>
                        <div className="panel-body_6 table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th>Nombre</th>
                                        <th>Código</th>
                                        <th>Anotaciones</th>
                                        <th className="text-center">Fecha</th>
                                        <th className="text-center">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            salas.map((sala) => (
                                                <tr key={sala.id}>
                                                    <td>{sala.nombre_sala}</td>
                                                    <td>{sala.codigo_identificador}</td>
                                                    <td style={{ textAlign: 'justify' }}>{sala.anotaciones}</td>
                                                    <td className="text-center">{sala.fecha_registro_sala}</td>
                                                    <td>
                                                        <ul className="action-list d-flex justify-content-center" >
                                                            <Button title="Atender sala" variant="success"
                                                                className={`separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿La sala ha sido atendida?',
                                                                        text: "Atender sala",
                                                                        icon: 'info',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            try {
                                                                                const response = await AtenderSala(sala.slug_sala);
                                                                                if (response.data.success) {
                                                                                    Swal.fire("Atención exitosa", "", "success");
                                                                                    window.location.reload();
                                                                                } else {
                                                                                    if (response.data.error) {
                                                                                        Swal.fire(response.data.error, '', 'error');
                                                                                    } else {
                                                                                        Swal.fire('Atención fallida', '', 'error');
                                                                                    }
                                                                                }
                                                                            } catch (error) {
                                                                                Swal.fire("Atención fallida", "", "error");
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faCheckDouble} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            salas.length === 0 &&
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                    </>
                                </tbody>
                            </Table>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-sm-1 col-xs-1">
                                    <Link to={'/nivel/all'}
                                        className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Salas</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`}
                                        title="Adelante">
                                        <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }}
                                            className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


// Lista de resultados
export function ListadodeResultado({ resultados, usuario, page, setPage, numeroPag, isActive }) {
    const navigate = useNavigate();
    // Paginacion siguente
    const anterior = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    // Paginacion anterior
    const siguiente = () => {
        setPage(prevPage => (prevPage < numeroPag ? prevPage + 1 : prevPage));
    };

    // Modal
    const [habilitado, setHabilitado] = useState(false);
    const [verModal, setVerModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const cerrarModal = () => setVerModal(false);
    const abrirModal = () => setVerModal(true);
    const [busqueda, setBusqueda] = useState("0");
    const [escogido, setEscogido] = useState(false);
    const [escogido2, setEscogido2] = useState(false);
    const [entradaValida, setEntradavaldia] = useState(true);

    // Formulario
    const enviarFormulario = (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(nombre)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Verificar entrada válida
        if (!entradaValida) {
            Swal.fire("Por favor ingrese el formato: Nombre Apellidos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Obtenemos los datos
            const datos__post = {
                nombre
            };
            // Guardamos
            guardar(datos__post);
        } catch (error) {
            Swal.fire("Error al generar el reporte", "", "error");
        }
        // Cerrar modal
        setHabilitado(false);
        cerrarModal();
    };

    // Formulario
    const enviarFormularioCedula = (e) => {
        e.preventDefault();
        // Verificar campos vacíos
        if (isEmptyField(cedula)) {
            Swal.fire("Por favor ingrese todos los campos", "", "warning");
            return;
        }
        // Flujo normal
        setHabilitado(true);
        try {
            // Validar tamaño de cédula
            if (cedula.length < 10) {
                Swal.fire("Por favor ingrese una cédula válida", "", "warning");
                return;
            }
            // Obtenemos los datos
            const datos__post = {
                cedula
            };
            // Guardamos
            guardar(datos__post);
        } catch (error) {
            Swal.fire("Error al generar el reporte", "", "error");
        }
        // Cerrar modal
        setHabilitado(false);
        cerrarModal();
    };

    // Funcion para guardar
    const guardar = async (datos__post) => {
        // Swall de confirmacion
        Swal.fire({
            title: '¿Está seguro que desea generar los reportes de todos los resultados del estudiante?',
            text: "Generar reportes",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, generar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await GenerarReporteAll(datos__post);
                    if (response.data.success) {
                        Swal.fire("Reportes registrados correctamente", "", "success");
                        navigate('/reporte/all');
                    } else {
                        resetear();
                        if (response.data.error) {
                            Swal.fire(response.data.error, '', 'error')
                        } else if (response.data.resultado) {
                            Swal.fire(response.data.resultado, '', 'error')
                        } else {
                            Swal.fire('Generación de reporte fallido', '', 'error')
                        }
                    }
                } catch (error) {
                    resetear();
                    Swal.fire("No se pudo generar el reporte. Verifique el nombre del estudiante", "", "error");
                }
            }
        })
    }

    // Control de entrada de datos
    const isEmptyField = (...fields) => {
        return fields.some(field => field.trim() === "");
    }

    // Reseteo
    const resetear = () => {
        setNombre('');
        setCedula('');
        setBusqueda("0");
        setEscogido(false);
        setEscogido2(false);
    }

    // Funcion para validar la entreada
    const cambioEntrada = (e) => {
        const value = e.target.value;
        setNombre(value);

        if (!validarEntrada(value)) {
            setEntradavaldia(false);
        } else {
            setEntradavaldia(true);
        }
    };

    // Validacion de entrada
    const validarEntrada = (value) => {
        // Control de entrada para cuatro valores
        const generar = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+ [A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
        return generar.test(value);
    };

    return (
        <div className="cuerpo-tabla-2">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                                <Modal show={verModal} onHide={cerrarModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Generación de reporte</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <select
                                            className="form-select mb-3"
                                            value={busqueda}
                                            onChange={(e) => {
                                                setBusqueda(e.target.value);
                                                // Mostrar el formulario si la opción seleccionada es "1" (Nombre de estudiante)
                                                if (e.target.value === "1") {
                                                    setEscogido(true);
                                                    setEscogido2(false);
                                                } else if (e.target.value === "2") {
                                                    setEscogido2(true);
                                                    setEscogido(false);
                                                } else {
                                                    setEscogido(false);
                                                    setEscogido2(false);
                                                }
                                            }}
                                        >
                                            <option value="0">Generar por ....</option>
                                            <option value="1">Nombre de estudiante</option>
                                            <option value="2">Cédula de identidad</option>
                                        </select>
                                        {escogido && (
                                            <form onSubmit={enviarFormulario}>
                                                <div className="form-group">
                                                    <label className='label' htmlFor="nombre">Nombre de estudiante:</label>
                                                    <input className='form-control w-100' type="text"
                                                        placeholder="Ingrese el nombre del estudiante. Ejm: Luis Luis Perez Perez**" id="nombre"
                                                        value={nombre} onChange={cambioEntrada} />
                                                </div>
                                                <Button type="submit" variant="success" disabled={habilitado}>
                                                    {habilitado ? 'Generando...' : 'Generar'}
                                                </Button>
                                            </form>
                                        )}
                                        {escogido2 && (
                                            <form onSubmit={enviarFormularioCedula}>
                                                <div className="form-group">
                                                    <label className='label' htmlFor="cedula">Cédula de estudiante:</label>
                                                    <input className='form-control w-100' type="text"
                                                        placeholder="Ingrese el número de cédula**" id="cedula"
                                                        value={cedula}
                                                        maxLength={10}
                                                        onChange={e => {
                                                            if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
                                                                setCedula(e.target.value);
                                                            }
                                                        }} />
                                                </div>
                                                <Button type="submit" variant="success" disabled={habilitado}>
                                                    {habilitado ? 'Generando...' : 'Generar'}
                                                </Button>
                                            </form>
                                        )}

                                    </Modal.Body>
                                </Modal>
                                <div className="col-sm-12 col-xs-12">
                                    <>
                                        {
                                            usuario.tipo === "comun" &&
                                            <Button className="btn btn-sm btn-primary pull-left" onClick={abrirModal}>
                                                <FontAwesomeIcon icon={faPlusCircle} title="Agregar reporte" /> Generar Reporte
                                            </Button>
                                        }
                                    </>
                                </div>
                            </div>
                        </div>
                        <div className="panel-body_5 table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Estudiante</th>
                                        <th>Tiempo</th>
                                        <th>Observación</th>
                                        <th style={{ textAlign: 'center' }}>Fecha</th>
                                        <th style={{ textAlign: 'center' }}>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            resultados.map((resultado) => (
                                                <tr key={resultado.id}>
                                                    <td className="text-center">{resultado.nombre_paciente} {resultado.apellido_paciente}</td>
                                                    <td>{resultado.tiempo_m}m {resultado.tiempo_s}s</td>
                                                    <>
                                                        {
                                                            resultado.observacion === null ?
                                                                <td>No hay observación. !Agrégala¡</td>
                                                                :
                                                                <td style={{ textAlign: 'justify' }}>{resultado.observacion}</td>
                                                        }

                                                    </>
                                                    <td style={{ textAlign: 'center' }}>{resultado.fecha_registro_resultado}</td>
                                                    <td>
                                                        <ul className="action-list d-flex justify-content-center">
                                                            <>
                                                                {
                                                                    resultado.estado_reporte === false && usuario.tipo === "comun" &&
                                                                    <Button title="Generar Reporte" variant="success"
                                                                        className={`separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                        disabled={resultado.observacion === null || resultado.observacion === "No resuelto"}
                                                                        onClick={() => {
                                                                            Swal.fire({
                                                                                title: '¿Está seguro que desea generar el reporte?',
                                                                                text: "Generar reporte",
                                                                                icon: 'info',
                                                                                showCancelButton: true,
                                                                                confirmButtonColor: '#3085d6',
                                                                                cancelButtonColor: '#d33',
                                                                                confirmButtonText: 'Sí, generar'
                                                                            }).then(async (result) => {
                                                                                if (result.isConfirmed) {
                                                                                    const response = await CrearReporteNuevo(resultado.id);
                                                                                    if (response.data.success) {
                                                                                        Swal.fire("Reporte generado de forma exitosa", "", "success");
                                                                                        navigate('/reporte/all');
                                                                                    } else {
                                                                                        if (response.data.error) {
                                                                                            Swal.fire(response.data.error, '', 'error');
                                                                                        } else {
                                                                                            Swal.fire('Reporte fallido', '', 'error');
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }}
                                                                    >
                                                                        <FontAwesomeIcon icon={faCheckDouble} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                                    </Button>
                                                                }
                                                            </>
                                                            <Button title="Eliminar resultado" variant="danger"
                                                                className={`separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea eliminar el resultado?',
                                                                        text: "Eliminar resultado",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            await ResultadoEliminar(resultado.id);
                                                                            Swal.fire("Eliminación exitosa", "", "success");
                                                                            // Recargamos 
                                                                            window.location.reload();
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                            {
                                                                usuario.tipo === "comun" &&
                                                                <Link to={`/resultado/editar/${resultado.id}`} title="Agregar observación"
                                                                    className={`btn btn-primary separacion--boton ${isActive ? 'h_' : 'h'}`}>
                                                                    <FontAwesomeIcon icon={faPencil} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                                </Link>
                                                            }
                                                            {
                                                                usuario.tipo === "comun" &&
                                                                <Link to={`/ver/resultados/${resultado.id}`} title="Ver descripción"
                                                                    className={`btn btn-success separacion--boton ${isActive ? 'h_' : 'h'}`}>
                                                                    <FontAwesomeIcon icon={faEye} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                                </Link>
                                                            }
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            resultados.length === 0 &&
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                    </>
                                </tbody>
                            </Table>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-sm-1 col-xs-1">
                                    <Link to={'/nivel/all'} className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Resultados</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Adelante">
                                        <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


// Listado de reportes
export function ListadodeReportes({ reportes, usuario, page, setPage, numeroPag, isActive }) {
    const navigate = useNavigate();
    // Paginacion siguente
    const anterior = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    // Paginacion anterior
    const siguiente = () => {
        setPage(prevPage => (prevPage < numeroPag ? prevPage + 1 : prevPage));
    };

    return (
        <div className="cuerpo-tabla-2">
            <div className="row">
                <div className="col-md-offset-1 col-md-11">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="row">
                            </div>
                        </div>
                        <div className="panel-body_3 table-responsive">
                            <Table responsive="sm" className="table">
                                <thead>
                                    <tr>

                                        <th>Estudiante</th>
                                        <th >Tiempo</th>
                                        <th>Correo</th>
                                        <th className="text-center">Fecha</th>
                                        <th class="text-center">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        {
                                            reportes.map((reporte) => (
                                                <tr key={reporte.id}>
                                                    <td>{reporte.nombre_paciente} {reporte.apellido_paciente}</td>
                                                    <td>{reporte.tiempo_m_}m con {reporte.tiempo_s_}s</td>
                                                    <td>{reporte.correo_paciente}</td>
                                                    <td className="text-center">{reporte.fecha_registro_reporte}</td>
                                                    <td>
                                                        <ul className="action-list d-flex justify-content-center">
                                                            <Button title="Eliminar reporte" variant="danger" className={`separacion--boton ${isActive ? 'h_' : 'h'}`}
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Está seguro que desea eliminar el reporte?',
                                                                        text: "Eliminar reporte",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí'
                                                                    }).then(async (result) => {
                                                                        if (result.isConfirmed) {
                                                                            const respuesta = await ModificarEstadoResultado(reporte.id);
                                                                            if (respuesta.data.success) {
                                                                                await ReporteEliminar(reporte.id);
                                                                                Swal.fire("Eliminación exitosa", "", "success");
                                                                                navigate('/reporte/all');
                                                                                window.location.reload();
                                                                            } else {
                                                                                if (respuesta.data.error) {
                                                                                    Swal.fire(respuesta.data.error, '', 'error');
                                                                                } else {
                                                                                    Swal.fire('Eliminación fallida', '', 'error');
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Button>
                                                            <Link to={`/ver/reporte/${reporte.id}/`} title="Ver reporte"
                                                                className={`btn btn-primary separacion--boton ${isActive ? 'h_' : 'h'}`}>
                                                                <FontAwesomeIcon icon={faEye} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                                            </Link>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            reportes.length === 0 &&
                                            <tr >
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                    </>
                                </tbody>
                            </Table>
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-sm-1 col-xs-1">
                                    <Link to={'/nivel/all'} className={`btn btn-primary ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Link>
                                </div>
                                <div className={`col-sm-7 col-xs-7 ${isActive ? 'titulo_tabla_' : 'titulo_tabla'}`}>Información - Reportes Creados</div>
                                <div className="pagination-controls col-sm-4 col-xs-4">
                                    <Button onClick={anterior} disabled={page === 1}
                                        className={`separacion--boton ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Atrás">
                                        <FontAwesomeIcon icon={faBackward} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                    <span className={isActive ? 'titulo_paginacion_' : 'titulo_paginacion'}>Página {page} de {numeroPag}</span>
                                    <Button onClick={siguiente} disabled={page === numeroPag}
                                        className={`separacion--boton--derecha ${isActive ? 'btn_paginacion_' : 'btn_paginacion'}`} title="Adelante">
                                        <FontAwesomeIcon icon={faBackward} style={{ transform: 'rotate(180deg)' }} className={isActive ? 'tam_fa_' : 'tam_fa'} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}