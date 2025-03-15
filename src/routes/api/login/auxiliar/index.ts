import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateAuxiliarToken } from "../../../../lib/helpers/generators/JWT/auxiliarToken";
import { verifyAuxiliarPassword } from "../../../../lib/helpers/encriptations/auxiliar.encriptation";
import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";
import { Genero } from "../../../../interfaces/shared/Genero";
import { ResponseSuccessLogin } from "../../../../interfaces/shared/apis/shared/login/types";

const router = Router();
const prisma = new PrismaClient();

export interface LoginBody {
  Nombre_Usuario: string;
  Contraseña: string;
}

router.get("/", (async (req: Request, res: Response) => {
  return res.json({ message: "Login Auxiliar" });
}) as any);

// Ruta de login para Auxiliares
router.post("/", (async (req: Request, res: Response) => {
  try {
    const { Nombre_Usuario, Contraseña }: LoginBody = req.body;

    // Validar que se proporcionen ambos campos
    if (!Nombre_Usuario || !Contraseña) {
      return res.status(400).json({
        message: "El nombre de usuario y la contraseña son obligatorios",
      });
    }

    // Buscar el auxiliar por nombre de usuario
    const auxiliar = await prisma.t_Auxiliares.findUnique({
      where: {
        Nombre_Usuario: Nombre_Usuario,
      },
      select: {
        DNI_Auxiliar: true,
        Nombre_Usuario: true,
        Contraseña: true,
        Nombres: true,
        Apellidos: true,
        Google_Drive_Foto_ID: true,
        Genero: true,
        Estado: true,
      },
    });

    // Si no existe el auxiliar o las credenciales son incorrectas, retornar error
    if (!auxiliar) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar si la cuenta está activa
    if (!auxiliar.Estado) {
      return res.status(403).json({
        success: false,
        message: "Tu cuenta está inactiva. Contacta al administrador.",
      });
    }

    // Verificar la contraseña
    const isContraseñaValid = verifyAuxiliarPassword(
      Contraseña,
      auxiliar.Contraseña
    );

    if (!isContraseñaValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token JWT
    const token = generateAuxiliarToken(
      auxiliar.DNI_Auxiliar,
      auxiliar.Nombre_Usuario
    );

    const response: ResponseSuccessLogin = {
      message: "Inicio de sesión exitoso",
      data: {
        Apellidos: auxiliar.Apellidos,
        Nombres: auxiliar.Nombres,
        Rol: RolesSistema.Auxiliar,
        token,
        Google_Drive_Foto_ID: auxiliar.Google_Drive_Foto_ID,
        Genero: auxiliar.Genero as Genero,
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
