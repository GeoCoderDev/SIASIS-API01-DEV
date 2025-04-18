import { ActoresSistema } from "./ActoresSistema";
import { ModoRegistro } from "./ModoRegistroPersonal";
import { RolesSistema } from "./RolesSistema";
import { NivelEducativo } from "./NivelEducativo";
import { Meses } from "./Meses";

export interface RegistrarAsistenciaIndividualRequestBody {
  DNI: string;
  Actor: ActoresSistema | RolesSistema;
  ModoRegistro: ModoRegistro;
  FechaHoraEsperada: string;
  NivelDelEstudiante?: NivelEducativo;
  AulaDelEstudiante?: string;
}

export interface DetallesAsistenciaUnitariaPersonal {
  TimestampEntrada: number;
  DesfaseSegundos: number;
}

export interface RegistroAsistenciaUnitariaPersonal {
  ModoRegistro: ModoRegistro;
  DNI: string;
  Rol: RolesSistema;
  Dia: number;
  Detalles: DetallesAsistenciaUnitariaPersonal;
}

export type RegistroAsistenciaMensualPersonal = Pick<
  RegistroAsistenciaUnitariaPersonal,
  "DNI" | "Rol" | "ModoRegistro"
> & {
  Mes: Meses;
  RegistrosDelMes: Record<number, DetallesAsistenciaUnitariaPersonal>;
};
