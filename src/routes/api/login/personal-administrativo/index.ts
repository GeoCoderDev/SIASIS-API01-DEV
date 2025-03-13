import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generatePersonalAdministrativoToken } from "../../../../lib/helpers/generators/JWT/personalAdministrativoToken";
import { verifyPersonalAdministrativoPassword } from "../../../../lib/helpers/encriptations/personalAdministrativo.encriptation";
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
  return res.json({ message: "Login Personal Administrativo" });
}) as any);

// Ruta de login para Personal Administrativo
router.post("/", (async (req: Request, res: Response) => {
  try {
    const { Nombre_Usuario, Contraseña }: LoginBody = req.body;

    // Validar que se proporcionen ambos campos
    if (!Nombre_Usuario || !Contraseña) {
      return res.status(400).json({
        message: "El nombre de usuario y la contraseña son obligatorios",
      });
    }

    // Buscar el personal administrativo por nombre de usuario
    const personalAdministrativo = await prisma.t_Personal_Administrativo.findUnique({
      where: {
        Nombre_Usuario: Nombre_Usuario,
      },
      select: {
        DNI_Personal_Administrativo: true,
        Nombre_Usuario: true,
        Contraseña: true,
        Nombres: true,
        Apellidos: true,
        Google_Drive_Foto_ID: true,
        Genero: true,
        Estado: true,
        Horario_Laboral_Entrada: true,
        Horario_Laboral_Salida: true
      },
    });

    // Si no existe el personal administrativo o las credenciales son incorrectas, retornar error
    if (!personalAdministrativo) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar si la cuenta está activa
    if (!personalAdministrativo.Estado) {
      return res.status(403).json({
        success: false,
        message: "Tu cuenta está inactiva. Contacta al administrador.",
      });
    }

    // Verificar la contraseña
    const isContraseñaValid = verifyPersonalAdministrativoPassword(
      Contraseña,
      personalAdministrativo.Contraseña
    );

    if (!isContraseñaValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token JWT
    const token = generatePersonalAdministrativoToken(
      personalAdministrativo.DNI_Personal_Administrativo,
      personalAdministrativo.Nombre_Usuario
    );

    // // Formatear horarios para presentación más amigable
    // const formatearHora = (fecha: Date) => {
    //   return fecha.toTimeString().slice(0, 5); // Obtiene HH:MM
    // };

    const response: ResponseSuccessLogin = {
      message: "Inicio de sesión exitoso",
      data: {
        Apellidos: personalAdministrativo.Apellidos,
        Nombres: personalAdministrativo.Nombres,
        Rol: RolesSistema.PersonalAdministrativo,
        token,
        Google_Drive_Foto_ID: personalAdministrativo.Google_Drive_Foto_ID,
        Genero: personalAdministrativo.Genero as Genero,
        // Horario: {
        //   Entrada: formatearHora(personalAdministrativo.Horario_Laboral_Entrada),
        //   Salida: formatearHora(personalAdministrativo.Horario_Laboral_Salida)
        // }
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