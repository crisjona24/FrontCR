// Estilos
import "../../../styles/Carrusel.css";
import "bootstrap/dist/css/bootstrap.min.css";

export function CarruselIndividual({ imagenes, isActive }) {
    return (
        <section className={isActive ? 'section__carrusel_' : 'section__carrusel'}>
            {/* Mapeamos las imagenes en img*/}
            {imagenes.map((imagen, index) => (
                index == 0 ?
                    <img
                        src={imagen}
                        alt="imagen"
                        title="Portada"
                        key={index}
                    />
                    :
                    <img
                        src={imagen}
                        alt="imagen"
                        title="Contenido"
                        key={index}
                    />
            ))}
        </section>
    );
}