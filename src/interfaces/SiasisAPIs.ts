import { RolesSistema } from "./RolesSistema";

export interface ApiResponseBase {
  message: string;
}

export interface SuccessLoginData {
  Nombres: string;
  Apellidos: string;
  Rol: RolesSistema;
  token: string;
  Google_Drive_Foto_ID: string | null;
}

export type ResponseSuccessLogin = ApiResponseBase & {
  data: SuccessLoginData;
};
