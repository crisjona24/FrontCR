import React from 'react';
import "../../styles/Registro.css"

export function PieRegister() {
    const cloudName = 'dccz4uwhg';  // tu cloud_name de Cloudinary
    const folder = 'samples/social_media';  // el nombre de la carpeta
    const imageName = 'twitter_ig';  // el nombre de la imagen
    const imageName2 = 'facebook_log';  // el nombre de la imagen

    // Construye la URL de la imagen
    const imageUrl1 = `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${imageName}.png`;
    const imageUrl2 = `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${imageName2}.png`;
    return (
        <footer className="footer">
            <div className='alineacion'>
                <span className='mt-2'>&copy; 2023 WAPIPTDAH, Todos los Derechos Reservados</span>
                <img className='imagen_pie' src="/img/ComputaciónUNL.jpg" alt="Logo de Computación" />
            </div>
        </footer>
    )
}