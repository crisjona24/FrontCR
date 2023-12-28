// Estilos
//import "../../../styles/Perfil.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Card, Col, Row, Image, Button } from 'react-bootstrap';
// Componentes
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faBackward } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
// Metodos
import { UsuarioEliminar } from '../../../api/usuario.api'


// Tarjeta de tecnico
export function Tecnico({ datos }) {
    const navigate = useNavigate();
    return (
        <div className="align-items-center contenedor_perfil">
            <Card className="mb-3" style={{ maxWidth: '75%' }}>
                <Row>
                    <Col md={4}>
                        <Image
                            className="img-fluid"
                            style={{ borderRadius: '10px', height: '60%', marginTop: '50%' }}
                            src="/img/tarjeta-perfil.png" alt="Sample"
                            fluid
                        />
                        <hr />
                        <Row className="mb-3">
                            <Card.Title style={{ fontSize: '0.8rem' }}>Fecha de unión</Card.Title>
                            <Card.Text style={{ color: '#333', fontFamily: 'Roboto', fontSize: '0.8rem' }}>
                                {datos.fecha_union}
                            </Card.Text>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="titulo-peticion mb-3">Datos de usuario </Card.Title>
                            <Row className="mb-3">
                                <Col md={6} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Nombre y Apellido</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.nombre} {datos.apellido}
                                    </Card.Text>
                                </Col>
                                <Col md={6} >
                                    <Card.Title className="text-center" style={{ fontSize: '1rem' }}>Edad</Card.Title>
                                    <Card.Text className="text-center" style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.edad} años
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title style={{ fontSize: '1rem' }}>Correo electrónico</Card.Title>
                                <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                    {datos.email}
                                </Card.Text>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={5} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Username</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.username}
                                    </Card.Text>
                                </Col>
                                <Col md={7} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Fecha de nacimiento</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.fecha_nacimiento}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title style={{ fontSize: '1rem' }}>Número de contacto</Card.Title>
                                <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                    {datos.celular}
                                </Card.Text>
                            </Row>
                            <Card.Text>
                                <small className="text-muted" style={{ fontFamily: 'Roboto' }}>Acciones</small>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Link to={'/nivel/all'} title="Regresar" className="btn btn-primary"><FontAwesomeIcon icon={faBackward} /></Link>
                                    <Link to={'/usuario/registro'} className="btn btn-primary" title="Editar perfil">
                                        <FontAwesomeIcon icon={faPencil} />
                                    </Link>
                                    <Button title="Eliminar perfil" className="btn btn-danger"
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Está seguro que desea eliminar su perfil?',
                                                text: "Eliminación de perfil",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, eliminar perfil'
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    await UsuarioEliminar(datos.identificador);
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('loginTimestamp');
                                                    navigate('/login');
                                                }
                                            })
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}


// Tarjeta de usuario comun
export function Comun({ datos }) {
    const navigate = useNavigate();
    return (
        <div className="align-items-center contenedor_perfil">
            <Card className="tarjeta_perfil" style={{ maxWidth: '75%' }}>
                <Row >
                    <Col md={4}>
                        <Image
                            className="img-fluid"
                            style={{ borderRadius: '10px', height: '60%', marginTop: '50%' }}
                            src="/img/tarjeta-perfil.png" alt="Sample"
                            fluid
                        />
                        <hr />
                        <Row className="mb-3">
                            <Card.Title style={{ fontSize: '0.8rem' }}>Fecha de unión</Card.Title>
                            <Card.Text style={{ color: '#333', fontFamily: 'Roboto', fontSize: '0.8rem' }}>
                                {datos.fecha_union}
                            </Card.Text>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="titulo-peticion mb-3">Datos de usuario </Card.Title>
                            <Row className="mb-3">
                                <Col md={7} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Nombre y Apellido </Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.nombre} {datos.apellido}
                                    </Card.Text>
                                </Col>
                                <Col md={5} >
                                    <Card.Title className="text-center" style={{ fontSize: '1rem' }}>Edad</Card.Title>
                                    <Card.Text className="text-center" style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.edad}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title style={{ fontSize: '1rem' }}>Correo electrónico</Card.Title>
                                <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                    {datos.email}
                                </Card.Text>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={7} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Área de ocupación</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.area_estudio}
                                    </Card.Text>
                                </Col>
                                <Col md={5} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Género</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.genero}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={5} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Celular</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.celular}
                                    </Card.Text>
                                </Col>
                                <Col md={7} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Fecha de nacimiento</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.fecha_nacimiento}
                                    </Card.Text>
                                </Col>
                            </Row>

                            <Card.Text>
                                <small className="text-muted" style={{ fontFamily: 'Roboto' }}>Acciones</small>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Link to={'/nivel/all'} title="Regresar" className="btn btn-primary">
                                        <FontAwesomeIcon icon={faBackward} />
                                    </Link>
                                    <Link to={'/usuario/comun/registro'} className="btn btn-primary" title="Editar perfil">
                                        <FontAwesomeIcon icon={faPencil} />
                                    </Link>
                                    <Button title="Eliminar perfil" className="btn btn-danger"
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Está seguro que desea eliminar su perfil?',
                                                text: "Eliminación de perfil",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, eliminar perfil'
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    await UsuarioEliminar(datos.identificador);
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('loginTimestamp');
                                                    navigate('/login');
                                                }
                                            })
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}


// Tarjeta de paciente
export function Paciente({ datos }) {
    const navigate = useNavigate();
    return (
        <div className="align-items-center" style={{ height: '100vh', marginLeft: '20%', marginTop: '10%' }}>
            <Card className="mb-1" style={{ maxWidth: '75%' }}>
                <Row >
                    <Col md={4}>
                        <Image
                            className="img-fluid"
                            style={{ borderRadius: '10px', height: '50%', marginTop: '60%' }}
                            src="/img/tarjeta-perfil.png" alt="Sample"
                            fluid
                        />
                        <hr />
                        <Row className="mb-3">
                            <Card.Title style={{ fontSize: '0.8rem' }}>Fecha de unión</Card.Title>
                            <Card.Text style={{ color: '#333', fontFamily: 'Roboto', fontSize: '0.8rem' }}>
                                {datos.fecha_union}
                            </Card.Text>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="titulo-peticion mb-3">Datos de usuario </Card.Title>
                            <Row className="mb-3">
                                <Col md={6} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Nombre y Apellido</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.nombre} {datos.apellido}
                                    </Card.Text>
                                </Col>
                                <Col md={6} >
                                    <Card.Title className="text-center" style={{ fontSize: '1rem' }}>Edad</Card.Title>
                                    <Card.Text className="text-center" style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.edad}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title style={{ fontSize: '1rem' }}>Correo electrónico</Card.Title>
                                <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                    {datos.email}
                                </Card.Text>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={5} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Celular</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.celular}
                                    </Card.Text>
                                </Col>
                                <Col md={7} >
                                    <Card.Title style={{ fontSize: '1rem' }}>Número de Emergencia</Card.Title>
                                    <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                        {datos.contacto_emergencia}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title style={{ fontSize: '1rem' }}>Fecha de nacimiento</Card.Title>
                                <Card.Text style={{ color: '#333', fontFamily: 'Roboto' }}>
                                    {datos.fecha_nacimiento}
                                </Card.Text>
                            </Row>
                            <Card.Text>
                                <small className="text-muted" style={{ fontFamily: 'Roboto' }}>Acciones</small>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Link to={'/nivel/all'} title="Regresar" className="btn btn-primary">
                                        <FontAwesomeIcon icon={faBackward} />
                                    </Link>
                                    <Link to={'/usuario/paciente/registro'} className="btn btn-primary" title="Editar perfil">
                                        <FontAwesomeIcon icon={faPencil} />
                                    </Link>
                                    <Button title="Eliminar perfil" className="btn btn-danger"
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Está seguro que desea eliminar su perfil?',
                                                text: "Eliminación de perfil",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, eliminar perfil'
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    await UsuarioEliminar(datos.identificador);
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('loginTimestamp');
                                                    navigate('/login');
                                                }
                                            })
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}