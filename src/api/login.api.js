// MANEJO DEL LOGIN DE USUARIO

import axios from 'axios';

const baseurl = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

/*
export const LoginUsuario = async (info__form) => {
    try{
        const response = await baseurl.post('/', info__form);
        localStorage.setItem('token', response.data.token);
        return response.data;
    }catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        throw error;
    }
}
*/
// Login
export const LoginUsuario = async (info__form) => {
    try{
        const response = await baseurl.post('login/', info__form);
        return response.data;
    }catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        throw error;
    }
}

// Logout
// Login
export const SalirUsuario = async () => {
    try{
        const response = await baseurl.post('logout/');
        return response.data;
    }catch (error) {
        console.error("Error durante el cierre de sesión:", error);
        throw error;
    }
}