// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Button, Container } from "react-bootstrap"
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister'
import { Link } from 'react-router-dom';
// Metodos
import { FormularioNivel } from '../../components/registro/Formularios'

export function NivelRegistro() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <CabeceraRegister />
            <Container className='mb-5' style={{ width: '35%' }}>
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-7">
                            <h4 className="titulo__CE"> Registro de Nivel</h4>
                        </div>
                        <div className='card-body col-md-2 pt-1'>
                            <Button className='btn btn-success mt-2' type='button'>
                                Detalle
                            </Button>
                        </div>
                        <div className='card-body col-md-2 pt-1'>
                            <Link to={'/nivel/all'} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        <FormularioNivel />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
};