// REALIZAR IMPORTACIONES
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
{/* Login */ }
import { IniciarSesion } from "./pages/login/LoginUser";

{/* Perfil  - Tarjetas de datos */ }
import { Perfil_User } from "./pages/general/Perfil"

{/* Registro */ }
import { UsuarioRegistro, ConfirmacionCuenta, RecuperacionCuenta, CambioClave } from "./pages/registro/UsuarioRegistro";
import { UsuarioPacienteRegistro } from "./pages/registro/UsuarioPacienteRegistro";
import { UsuarioComunRegistro } from "./pages/registro/UsuarioComunRegistro";
import { DominioRegistro } from "./pages/registro/DominioRegistro";
import { ContenidoRegistro } from "./pages/registro/ContenidoRegistro";
import { NivelRegistro } from "./pages/registro/NivelRegistro";
import { IndividualRegistro } from "./pages/registro/ContenidoIndividualRegistro";
import { CursoRegistro } from "./pages/registro/CursoRegistro";
import { PeticionRegistro } from "./pages/registro/PeticionRegistro";
import { SalaRegistro, RevisionPeticionRegistro } from "./pages/registro/SalaRegistro";
import { Contacto } from "./pages/registro/Contacto";

{/* Listado */ }
import { NivelPrincipalAll } from "./pages/general/NivelPrincipalAll";
import { DominioPrincipalAll } from "./pages/general/DominioPrincipalAll";
import { ContenidoPrincipalAll } from "./pages/general/ContenidoPrincipalAll";
import { IndividualPrincipalAll } from "./pages/general/IndividualPrincipalAll";
import { CursosALL } from "./pages/general/CursosAll";
import { ContenidoIndividual } from "./pages/general/ContenidoIndividual";
import { SeleccionActividad } from "./pages/registro/SeleccionActividad";
import { Peticionall, PeticionAllAtendida, PeticionUC } from "./pages/general/PeticionAll";
import { PacientesALL } from "./pages/general/PacientesAll";
import { Resultadoall } from "./pages/general/ResultadosAll";
import { SalasALL, SalasPaciente, SalasAtendidasALL } from "./pages/general/SalasAll";
import { ReportesALL } from "./pages/general/ReportesAll";

{/* Edicion  */ }
import { ContenidoEdición } from "./pages/edicion/ContenidoEdicion";
import { DominioEdición } from "./pages/edicion/DominioEdicion";
import { IndividualEdición } from "./pages/edicion/IndividualEdicion";
import { NivelEdición } from "./pages/edicion/NivelEdicion";
import { CursoEdicion } from "./pages/edicion/CursoEdicion";
import { ResultadoEdicion } from "./pages/edicion/ResultadoEdicion";
import { SalasEdicion } from "./pages/edicion/SalaEdicion";
import { ReporteEdicion } from "./pages/edicion/ReporteEdicion";
import { Probando } from "./pages/general/Probando"
{/* Informacion */ }
import { Ver, VerPeticion, Juego } from "./pages/general/Verpdf"
import {
  InformacionDominio, InformacionContenido, InformacionIndividual,
  InformacionPaciente, InformacionAPP, InformacionReporte, InformacionResultado
} from "./pages/general/InformacionDatos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA POR DEFECTO */}
        <Route path="/" element={<Navigate to={'/login'} />} />
        {/* LOGIN */}
        <Route path="/login" element={<IniciarSesion />} />
        {/* RUTA DE REGISTRO */}
        <Route path="/verificar/cuenta" element={<ConfirmacionCuenta />} />
        <Route path="/recuperar/cuenta" element={<RecuperacionCuenta />} />
        <Route path="/cambio/clave/cuenta" element={<CambioClave />} />
        <Route path="/registro" element={<SeleccionActividad />} />
        <Route path="/usuario/paciente/registro" element={<UsuarioPacienteRegistro />} />
        <Route path="/usuario/comun/registro" element={<UsuarioComunRegistro />} />
        <Route path="/usuario/registro" element={<UsuarioRegistro />} />
        <Route path="/nivel/registro" element={<NivelRegistro />} />
        <Route path="/dominio/registro" element={<DominioRegistro />} />
        <Route path="/contenido/registro/:slug" element={<ContenidoRegistro />} />
        <Route path="/contenido/individual/registro/:slug" element={<IndividualRegistro />} />
        <Route path="/curso/registro" element={<CursoRegistro />} />
        <Route path="/peticion/registro" element={<PeticionRegistro />} />
        <Route path="/sala/registro" element={<SalaRegistro />} />
        <Route path="/peticion/registro/revision/:slug" element={<RevisionPeticionRegistro />} />
        <Route path="/registro/contacto" element={<Contacto />} />
        {/* RUTA DE CONSULTA */}
        <Route path="/pacientes/all/:slug" element={<PacientesALL />} />
        <Route path="/dominio/all" element={<DominioPrincipalAll />} />
        <Route path="/nivel/all" element={<NivelPrincipalAll />} />
        <Route path="/cursos/all" element={<CursosALL />} />
        <Route path="/peticion/all" element={<Peticionall />} />
        <Route path="/peticion/all/atendida" element={<PeticionAllAtendida />} />
        <Route path="/peticion/all/usuario" element={<PeticionUC />} />
        <Route path="/contenido/all/:slug" element={<ContenidoPrincipalAll />} />
        <Route path="/resultado/all" element={<Resultadoall />} />
        <Route path="/sala/all" element={<SalasALL />} />
        <Route path="/sala/atendida/all" element={<SalasAtendidasALL />} />
        <Route path="/reporte/all" element={<ReportesALL />} />
        <Route path="/sala/paciente/all" element={<SalasPaciente />} />
        <Route path="/contenido/individual/all/:slug" element={<IndividualPrincipalAll />} />
        <Route path="/individual/:slug/:slug2/" element={<ContenidoIndividual />} />
        <Route path="/individual/nuevo/:slug" element={<ContenidoIndividual />} />
        <Route path="/perfil" element={<Perfil_User />} />
        {/* RUTA DE CONSULTA INDIVIDUAL*/}
        <Route path="/dominio/detalle/:slug" element={<InformacionDominio />} />
        <Route path="/contenido/detalle/:slug" element={<InformacionContenido />} />
        <Route path="/individual/detalle/:slug/:slug2/" element={<InformacionIndividual />} />
        <Route path="/ver/peticion/:id" element={<VerPeticion />} />
        <Route path="/ver/paciente/:id" element={<InformacionPaciente />} />
        <Route path="/ver/datos" element={<InformacionAPP />} />
        <Route path="/ver/reporte/:id" element={<InformacionReporte />} />
        <Route path="/ver/resultados/:id" element={<InformacionResultado />} />
        <Route path="/ver" element={<Ver />} />
        {/* RUTA DE EDICION DE INFORMACION */}
        <Route path="/dominio/editar/:slug" element={<DominioEdición />} />
        <Route path="/contenido/editar/:slug" element={<ContenidoEdición />} />
        <Route path="/individual/editar/:slug/:slug2/" element={<IndividualEdición />} />
        <Route path="/nivel/editar/:slug" element={<NivelEdición />} />
        <Route path="/curso/editar/:slug" element={<CursoEdicion />} />
        <Route path="/resultado/editar/:id" element={<ResultadoEdicion />} />
        <Route path="/sala/editar/:id" element={<SalasEdicion />} />
        <Route path="/editar/reporte/:id" element={<ReporteEdicion />} />
        {/*OTRA RUTA */}
        <Route path="/juego/invasion" element={<Juego />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;