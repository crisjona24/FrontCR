// Objetivo: Edición de nivel
// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "react-bootstrap";
// Componentes
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister';
import { Link } from 'react-router-dom';
// Estilos
import { FormularioEdicionNivel } from '../../components/edicion/Formularo_edicion';

export function NivelEdición() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <CabeceraRegister />
            <Container className="contenedor__edicion">
                <Container className='barraSup mt-5' >
                    <Row className='col-md-12'>
                        <div className="card-body col-md-9">
                            <h4 className="titulo__CE"> Edición de nivel</h4>
                        </div>
                        <div className='card-body col-md-2'>
                            <Link to={'/nivel/all'} className='btn btn-danger mt-2'>
                                Cancelar
                            </Link>
                        </div>
                    </Row>
                </Container>
                <Container className='form container pb-1 borde__CE'>
                    <h6 className='pl-0 pt-3 pb-3'> Ingrese los datos solicitados</h6>
                    <div className='pb-2'>
                        <FormularioEdicionNivel />
                    </div>
                </Container>
            </Container>
            <PieRegister />
        </div>
    )
}