import { useNavigate, Link } from 'react-router-dom';
// Metodos
import { SalirUsuario } from "../../api/login.api"

export function Logout() {
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem('token'); // Elimina el token
        localStorage.removeItem('loginTimestamp'); // Elimina el token
        navigate('/'); // Redirecciona a la página de inicio de sesión
    };

    return (
        // ...
        <li className="list__inside">
            <a href="#" className="nav__link nav__link--inside" onClick={handleLogout}>Salir</a>
        </li>
        // ...
    )
}

export function LogoutNew() {
    const navigate = useNavigate();
    const salir = async (e) => {
        e.preventDefault();
        // Salir en el backend
        const response = await SalirUsuario();
        if (response.success) {
            localStorage.removeItem('token'); // Elimina el token
            localStorage.removeItem('loginTimestamp'); // Elimina el token
            localStorage.removeItem('color'); // Elimina el color
            navigate('/'); // Redirecciona a la página de inicio de sesión
        }
    };

    return (
        // ...
        <Link className='text__' onClick={salir}>Salir</Link>
        // ...
    )
}