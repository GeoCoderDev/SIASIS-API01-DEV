import { RolesSistema } from "./RolesSistema";

export interface JWTPayload {
  ID_Usuario: string;
  Rol: RolesSistema;
  Nombre_Usuario: string;
  iat: number;
  exp: number;
}
