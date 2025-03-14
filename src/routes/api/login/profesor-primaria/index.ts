import { Request, Response, Router } from "express";

import { PrismaClient } from "@prisma/client";
import {
  LoginBody,
  ResponseSuccessLogin,
} from "../../../../interfaces/shared/SiasisAPIs";
import { verifyProfesorPrimariaPassword } from "../../../../lib/helpers/encriptations/profesorPrimaria.encriptation";
import { generateProfesorPrimariaToken } from "../../../../lib/helpers/generators/JWT/profesorPrimariaToken";
import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";
import { Genero } from "../../../../interfaces/shared/Genero";

const router = Router();
const prisma = new PrismaClient();

router.get("/", (async (req: Request, res: Response) => {
  return res.json({ message: "Login Profesor de Primaria" });
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

    // Buscar el profesor de primaria por nombre de usuario
    const profesorPrimaria = await prisma.t_Profesores_Primaria.findUnique({
      where: {
        Nombre_Usuario: Nombre_Usuario,
      },
      select: {
        DNI_Profesor_Primaria: true,
        Nombre_Usuario: true,
        Contraseña: true,
        Nombres: true,
        Apellidos: true,
        Google_Drive_Foto_ID: true,
        Genero: true,
        Estado: true,
      },
    });

    // Si no existe el profesor de primaria o las credenciales son incorrectas, retornar error
    if (!profesorPrimaria) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar si la cuenta está activa
    if (!profesorPrimaria.Estado) {
      return res.status(403).json({
        success: false,
        message: "Tu cuenta está inactiva. Contacta al administrador.",
      });
    }

    // Verificar la contraseña
    const isContraseñaValid = verifyProfesorPrimariaPassword(
      Contraseña,
      profesorPrimaria.Contraseña
    );

    if (!isContraseñaValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token JWT
    const token = generateProfesorPrimariaToken(
      profesorPrimaria.DNI_Profesor_Primaria,
      profesorPrimaria.Nombre_Usuario
    );

    const response: ResponseSuccessLogin = {
      message: "Inicio de sesión exitoso",
      data: {
        Apellidos: profesorPrimaria.Apellidos,
        Nombres: profesorPrimaria.Nombres,
        Rol: RolesSistema.ProfesorPrimaria,
        token,
        Google_Drive_Foto_ID: profesorPrimaria.Google_Drive_Foto_ID,
        Genero: profesorPrimaria.Genero as Genero,
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
