/* **** ESTILOS DE CONTENIDO PRINCIPAL *** */
import "../../styles/Cabecera.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Nav.css";
/* **** COMPONENTES *** */
import { CabeceraRegister } from '../../components/partes/CabecerRegister';
import { PieRegister } from '../../components/partes/PieRegister'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export function Probando() {
    // Establecer estado para saber si sidebar está activo
    const [isActive, setIsActive] = useState(false);

    // Controlador para el evento de clic
    const handleSidebarToggle = () => {
        setIsActive(!isActive);
    };
    return (
        <div className="w-100 h-100">
            <CabeceraRegister />
            <div className="container-fluid p-0 m-0 w-100 h-100">
                <div className="almacenador ml-0">
                    <aside id="sidebar" className={isActive ? 'active' : ''}>
                        {/* COMPONENTE NAVBAR */}
                        
                    </aside>
                    <section className="section col-9" id="mysection" style={{ border: '1px solid gray' }}>
                        <div id="content">
                            <button type="button" id="sidebarCollapse" onClick={handleSidebarToggle}
                                className="btn mb-3" style={{ backgroundColor: '#f0f0f0', color: 'black' }}
                                title="Menú">
                                <i className="fas fa-align-left"></i>
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            {/* COMPONENTE DEL CUERPO */}
                            
                        </div>
                    </section>
                </div>
            </div>
            <PieRegister />
        </div>
    )
}