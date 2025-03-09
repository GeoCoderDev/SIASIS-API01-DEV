import { T_Directivos } from "@prisma/client";
import { RolesSistema } from "./RolesSistema";
import { ApiResponseBase } from "./SiasisAPIs";

export type DirectivoResponseSuccessLogin = ApiResponseBase & {
  data: Pick<
    T_Directivos,
    "Id_Directivo" | "Nombres" | "Apellidos" | "Nombre_Usuario"
  > & { Rol: RolesSistema; token: string };
};
