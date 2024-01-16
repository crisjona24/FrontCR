// Estilos
import "../../../styles/Perfil.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
export function Tecnico({ datos, isActive }) {
    const navigate = useNavigate();
    return (
        <div className="align-items-center contenedor_perfil">
            <Card className="tarjeta_perfil">
                <Row>
                    <Col md={4}>
                        <Image
                            className={isActive ? "img-fluid img_perfil_" : "img-fluid img_perfil"}
                            src="/img/tarjeta-perfil.png" alt="Imagen de tarjeta de perfil"
                            fluid
                        />
                        <hr />
                        <Row className="mb-3">
                            <Card.Title className="titulo_union">Fecha de unión</Card.Title>
                            <Card.Text className="descrip_union">
                                {datos.fecha_union}
                            </Card.Text>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="titulo-peticion mb-3">Datos de usuario </Card.Title>
                            <Row className="mb-3">
                                <Col md={8} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Nombre y Apellido</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.nombre} {datos.apellido}
                                    </Card.Text>
                                </Col>
                                <Col md={4} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_ text-center' : 'titulo_tarjeta text-center'}>Edad</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_ text-center' : 'descrip_tarjeta text-center'}>
                                        {datos.edad} años
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Correo electrónico</Card.Title>
                                <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                    {datos.email}
                                </Card.Text>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={5} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Username</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.username}
                                    </Card.Text>
                                </Col>
                                <Col md={7} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_ text-center' : 'titulo_tarjeta text-center'}>Fecha de nacimiento</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_ text-center' : 'descrip_tarjeta text-center'}>
                                        {datos.fecha_nacimiento}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Número de contacto</Card.Title>
                                <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                    {datos.celular}
                                </Card.Text>
                            </Row>
                            <Card.Text>
                                <small className="text-muted" style={{ fontFamily: 'Roboto' }}>Acciones</small>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Link to={'/nivel/all'} title="Regresar" className="btn btn-primary tam_icon">
                                        <FontAwesomeIcon icon={faBackward} />
                                    </Link>
                                    <Link to={'/usuario/registro'} className="btn btn-primary tam_icon" title="Editar perfil">
                                        <FontAwesomeIcon icon={faPencil} />
                                    </Link>
                                    <Button title="Eliminar perfil" className="btn btn-danger tam_icon"
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
export function Comun({ datos, isActive }) {
    const navigate = useNavigate();
    return (
        <div className="align-items-center contenedor_perfil">
            <Card className="tarjeta_perfil">
                <Row >
                    <Col md={4}>
                        <Image
                            className={isActive ? "img-fluid img_perfil_" : "img-fluid img_perfil"}
                            src="/img/tarjeta-perfil.png" alt="Imagen de tarjeta de perfil"
                            fluid
                        />
                        <hr />
                        <Row className="mb-3">
                            <Card.Title className="titulo_union">Fecha de unión</Card.Title>
                            <Card.Text className="descrip_union">
                                {datos.fecha_union}
                            </Card.Text>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="titulo-peticion mb-3">Datos de usuario </Card.Title>
                            <Row className="mb-3">
                                <Col md={8} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Nombre y Apellido</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.nombre} {datos.apellido}
                                    </Card.Text>
                                </Col>
                                <Col md={4} >
                                    <Card.Title className={isActive ? 'text-center titulo_tarjeta_' : 'text-center titulo_tarjeta'}>Edad</Card.Title>
                                    <Card.Text className={isActive ? 'text-center descrip_tarjeta_' : 'text-center descrip_tarjeta'}>
                                        {datos.edad} años
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Correo electrónico</Card.Title>
                                <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                    {datos.email}
                                </Card.Text>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={7} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Área de ocupación</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.area_estudio}
                                    </Card.Text>
                                </Col>
                                <Col md={5} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Género</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.genero}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={5} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Celular</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.celular}
                                    </Card.Text>
                                </Col>
                                <Col md={7} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Fecha de nacimiento</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
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
export function Paciente({ datos, isActive }) {
    const navigate = useNavigate();
    return (
        <div className="align-items-center contenedor_perfil_p">
            <Card className="tarjeta_perfil">
                <Row >
                    <Col md={4}>
                        <Image
                            className={isActive ? "img-fluid img_perfil_" : "img-fluid img_perfil"}
                            src="/img/tarjeta-perfil.png" alt="Imagen de tarjeta de perfil"
                            fluid
                        />
                        <hr />
                        <Row className="mb-3">
                            <Card.Title className="titulo_union">Fecha de unión</Card.Title>
                            <Card.Text className="descrip_union">
                                {datos.fecha_union}
                            </Card.Text>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="titulo-peticion mb-3">Datos de usuario </Card.Title>
                            <Row className="mb-3">
                                <Col md={8} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Nombre y Apellido</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.nombre} {datos.apellido}
                                    </Card.Text>
                                </Col>
                                <Col md={4} >
                                    <Card.Title className={isActive ? 'text-center titulo_tarjeta_' : 'text-center titulo_tarjeta'}>Edad</Card.Title>
                                    <Card.Text className={isActive ? 'text-center descrip_tarjeta_' : 'text-center descrip_tarjeta'}>
                                        {datos.edad}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Correo electrónico</Card.Title>
                                <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                    {datos.email}
                                </Card.Text>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col md={5} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Celular</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.celular}
                                    </Card.Text>
                                </Col>
                                <Col md={7} >
                                    <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Número de Emergencia</Card.Title>
                                    <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
                                        {datos.contacto_emergencia}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Card.Title className={isActive ? 'titulo_tarjeta_' : 'titulo_tarjeta'}>Fecha de nacimiento</Card.Title>
                                <Card.Text className={isActive ? 'descrip_tarjeta_' : 'descrip_tarjeta'}>
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