import { Request, Response, Router } from "express";

import { PrismaClient } from "@prisma/client";

import { generateDirectivoToken } from "../../../../lib/helpers/generators/JWT/directivoToken";
import { verifyDirectivoPassword } from "../../../../lib/helpers/encriptations/directivo.encriptation";
import { RolesSistema } from "../../../../interfaces/RolesSistema";
import { ResponseSuccessLogin } from "../../../../interfaces/SiasisAPIs";
import { Genero } from "../../../../interfaces/Genero";

const router = Router();
const prisma = new PrismaClient();

export interface LoginBody {
  Nombre_Usuario: string;
  Contraseña: string;
}

router.get("/", (async (req: Request, res: Response) => {
  return res.json({ message: "Login Directivo" });
}) as any);

// Ruta de login
router.post("/", (async (req: Request, res: Response) => {
  try {
    const { Nombre_Usuario, Contraseña }: LoginBody = req.body;

    // Validar que se proporcionen ambos campos
    if (!Nombre_Usuario || !Contraseña) {
      return res.status(400).json({
        message: "El nombre de usuario y la contraseña son obligatorios",
      });
    }

    // Buscar el directivo por nombre de usuario
    const directivo = await prisma.t_Directivos.findUnique({
      where: {
        Nombre_Usuario: Nombre_Usuario,
      },
      select: {
        Id_Directivo: true,
        Nombre_Usuario: true,
        Contraseña: true,
        Nombres: true,
        Apellidos: true,
        Google_Drive_Foto_ID: true,
        Genero: true,
      },
    });

    // Si no existe el directivo o las credenciales son incorrectas, retornar error
    if (!directivo) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar la contraseña
    const isContraseñaValid = verifyDirectivoPassword(
      Contraseña,
      directivo.Contraseña
    );

    if (!isContraseñaValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token JWT
    const token = generateDirectivoToken(
      directivo.Id_Directivo,
      directivo.Nombre_Usuario
    );

    // const cookies = [
    //   createCookie("token", token),
    //   createCookie("Nombre_Usuario", directivo.Nombre_Usuario),
    //   createCookie("Rol", "D"),
    //   createCookie("Nombres", directivo.Nombres),
    //   createCookie("Apellidos", directivo.Apellidos),
    // ];

    // // Establecer las cookies en la respuesta
    // res.setHeader("Set-Cookie", cookies.join(", "));

    // return new Response(null, {
    //   status: 201,
    //   headers: { "Set-Cookie": `${tokenSerialize}, ${roleSerialize}` },

    const response: ResponseSuccessLogin = {
      message: "Inicio de sesión exitoso",
      data: {
        Apellidos: directivo.Apellidos,
        Nombres: directivo.Nombres,
        Rol: RolesSistema.Directivo,
        token,
        Google_Drive_Foto_ID: directivo.Google_Drive_Foto_ID,
        Genero: directivo.Genero as Genero,
      },
    };

    // Responder con el token y datos básicos del usuario
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor, por favor intente más tarde",
    });
  }
}) as any);

export default router;
