// Estilos
//import "../../styles/Cabecera.css";
import "bootstrap/dist/css/bootstrap.min.css"
// Componentes
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Metodos
import { DatosUser } from "../../api/usuario.api";
import { Tecnico, Paciente, Comun } from './general_perfil/TarjetaPerfil'

export function Tarjeta({ isActive }) {
    /* *** Control de usuario *** */
    const [error, setError] = useState("");
    const [datos, setDatos] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Obtener datos de usuario
    const obtener = async () => {

        // Flujo normal
        try {
            let cont = await DatosUser();
            if (cont.data.success) {
                setDatos(cont.data);
            } else if (cont.data.success === false) {
                navigate('/login');
            }
        } catch (error) {
            if (error.message === "NOT_AUTHENTICATED") {
                navigate('/login');
            } else {
                mostrarError('Error al mostrar perfil de usuario');
            }
        }
    }

    // Obtener datos
    useEffect(() => {
        // Promesa
        if (!token) {
            navigate('/login');
        }
        obtener();
    }, []);

    // Tipo de usuario
    let tipoUser;
    if (datos) {
        switch (datos.tipo) {
            case 'tecnico':
                tipoUser = <Tecnico datos={datos} isActive={isActive} />;
                break;
            case 'paciente':
                tipoUser = <Paciente datos={datos} isActive={isActive} />;
                break;
            case 'comun':
                tipoUser = <Comun datos={datos} isActive={isActive} />;
                break;
            default:
                tipoUser = <div>No hay datos</div>;
                break;
        }
    }

    // Funcion para mostrar errores
    const mostrarError = (message) => {
        setError(message);
        setTimeout(() => {
            setError("");
        }, 5000);
    };

    return (
        <div>
            <>
                {
                    error &&
                    <div id="alert" className="alert alert-success" role="alert">
                        <h5 className="alert-heading">!Atención!</h5>
                        <span className="mb-0">{error}</span>
                    </div>
                }
                <div className="cabeza__Nivel">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h4 className="display-7 mt-2">
                                    Información de perfil
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Componente de navegacion */}
                {tipoUser}
                {/* Componente de opciones */}
            </>
        </div>
    )
}