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
                &copy; 2023 WAPIPTDAH, Todos los Derechos Reservados
                <img className='imagen_pie' src={imageUrl1} alt="" />
                <img className='imagen_pie' src={imageUrl2} alt="" />
            </div>
        </footer>
    )
}