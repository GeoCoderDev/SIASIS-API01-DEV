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
