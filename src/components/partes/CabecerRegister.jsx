// Estilos
import { Link } from "react-router-dom";
import "../../styles/Registro.css"

export function CabeceraRegister() {
    // Obtenemos el token
    const token = localStorage.getItem("token");
    return (
        <header className="header" id="mysection2">
            <div className="left-section">
                <h1 className="title_header">
                    WAPIPTDAH
                </h1>
                <h5 className="subtitle_header">
                    Ayudamos a nuestros niños
                </h5>
            </div>
            <div className="right-section">
                <ul className="menu">
                    {
                        token &&
                        <>
                            <li><Link to="/ver/datos" className="tam_cabecera">Conócenos</Link></li>
                            <li><Link to="/registro/contacto" className="tam_cabecera">Contáctanos</Link></li>
                        </>
                    }

                </ul>
            </div>
        </header>
    )
}