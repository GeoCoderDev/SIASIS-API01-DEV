import { ModoRegistro } from "./ModoRegistroPersonal";
import { RolesSistema } from "./RolesSistema";
import { Meses } from "./Meses";

export interface DetallesAsistenciaUnitariaPersonal {
  Timestamp: number;
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
