import {
  T_Aulas,
  T_Auxiliares,
  T_Directivos,
  T_Personal_Administrativo,
  T_Profesores_Primaria,
  T_Profesores_Secundaria,
  T_Responsables,
} from "@prisma/client";
import { Genero } from "./Genero";
import { RolesSistema } from "./RolesSistema";

export interface LoginBody {
  Nombre_Usuario: string;
  Contraseña: string;
}

export interface ApiResponseBase {
  message: string;
}

export interface SuccessLoginData {
  Nombres: string;
  Apellidos: string;
  Genero?: Genero;
  Rol: RolesSistema;
  token: string;
  Google_Drive_Foto_ID: string | null;
}

export type ResponseSuccessLogin = ApiResponseBase & {
  data: SuccessLoginData;
};

export type MisDatosDirectivo = Omit<T_Directivos, "Contraseña">;
export type MisDatosProfesorPrimaria = Omit<
  T_Profesores_Primaria,
  "Contraseña"
>;

export type MisDatosAuxiliar = Omit<T_Auxiliares, "Contraseña">;

export type MisDatosProfesorSecundaria = Omit<
  T_Profesores_Secundaria,
  "Contraseña"
>;

export type MisDatosTutor = Omit<T_Profesores_Secundaria, "Contraseña"> & {
  Aula_Asignada: Pick<T_Aulas, "DNI_Profesor_Primaria">;
};

//API02
export type MisDatosResponsable = Omit<T_Responsables, "Contraseña">;

export type MisDatosPersonalAdministrativo = Omit<
  T_Personal_Administrativo,
  "Contraseña"
>;

export type MisDatosSuccessAPI01 =
  | MisDatosDirectivo
  | MisDatosProfesorPrimaria
  | MisDatosAuxiliar
  | MisDatosProfesorSecundaria
  | MisDatosTutor
  | MisDatosResponsable
  | MisDatosPersonalAdministrativo;
