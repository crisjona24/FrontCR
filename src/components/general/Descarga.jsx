// Metodos
import { handleDownload } from "../../controles/alert_user"
import { faDownload } from '@fortawesome/free-solid-svg-icons';
// Componentes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
//import { CloudinaryContext, Image, Transformation } from 'cloudinary-react';


/*
export function MyComponent() {
    return (
        <CloudinaryContext cloudName="dccz4uwhg">
            <a href="https://res.cloudinary.com/dccz4uwhg/raw/upload/v1692749725/samples/peticion/Comandos_en_dispositivos_Cisco_-_Cristobal_Rios_n0gqpp.pdf" download>
                Comandos_en_dispositivos_Cisco_-_Cristobal_Rios.pdf
                <Image publicId="Comandos_en_dispositivos_Cisco_-_Cristobal_Rios_n0gqpp.pdf">
                    <Transformation flags="attachment" />
                </Image>
            </a>
        </CloudinaryContext>
    );
}
*/
export function DownloadLink({ cloudinaryUrl }) {
    return (
        <button onClick={() => handleDownload(cloudinaryUrl)} className="btn btn-success separacion--boton">
            <FontAwesomeIcon icon={faDownload} />
        </button>
    );
}

export function PdfViewer() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);  // inicialmente se mostrará la primera página

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const pdfUrl = "https://res.cloudinary.com/dccz4uwhg/raw/upload/v1692749725/samples/peticion/Comandos_en_dispositivos_Cisco_-_Cristobal_Rios_n0gqpp.pdf";

    return (
        <div>
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <div>
                <p>Página {pageNumber} de {numPages}</p>
                <button onClick={() => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1))}>Anterior</button>
                <button onClick={() => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages))}>Siguiente</button>
            </div>
        </div>
    );
}

