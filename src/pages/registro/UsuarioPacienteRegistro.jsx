// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister'
import { PieRegister } from '../../components/partes/PieRegister'
import { Link } from 'react-router-dom';
// Metodos
import { FormularioPaciente } from '../../components/registro/Formulario_usuario'

export function UsuarioPacienteRegistro() {
    // Obtener token
    const token = localStorage.getItem('token');
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <CabeceraRegister />
            <Container className='mb-5' style={{ width: '45%' }}>
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-9">
                            <h4 style={{ padding: '10px' }}> Registro de estudiante</h4>
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
                        <FormularioPaciente />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}