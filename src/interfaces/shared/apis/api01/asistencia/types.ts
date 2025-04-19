import { ActoresSistema } from "../../../ActoresSistema";
import { ModoRegistro } from "../../../ModoRegistroPersonal";
import { NivelEducativo } from "../../../NivelEducativo";


export interface RegistrarAsistenciaIndividualRequestBody {
  DNI: string;
  Actor: ActoresSistema;
  ModoRegistro: ModoRegistro;
  FechaHoraEsperadaISO: string;
  NivelDelEstudiante?: NivelEducativo;
  AulaDelEstudiante?: string;
}
