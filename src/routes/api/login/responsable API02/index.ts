import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateResponsableToken } from "../../../../lib/helpers/generators/JWT/responsableToken";
import { verifyResponsablePassword } from "../../../../lib/helpers/encriptations/responsable.encriptation";
import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";
import { ResponseSuccessLogin } from "../../../../interfaces/shared/apis/shared/login/types";

const router = Router();
const prisma = new PrismaClient();

export interface LoginBody {
  Nombre_Usuario: string;
  Contraseña: string;
}

router.get("/", (async (req: Request, res: Response) => {
  return res.json({ message: "Login Responsable" });
}) as any);

// Ruta de login para Responsables (Padres/Apoderados)
router.post("/", (async (req: Request, res: Response) => {
  try {
    const { Nombre_Usuario, Contraseña }: LoginBody = req.body;

    // Validar que se proporcionen ambos campos
    if (!Nombre_Usuario || !Contraseña) {
      return res.status(400).json({
        message: "El nombre de usuario y la contraseña son obligatorios",
      });
    }

    // Buscar el responsable por nombre de usuario
    const responsable = await prisma.t_Responsables.findUnique({
      where: {
        Nombre_Usuario: Nombre_Usuario,
      },
      select: {
        DNI_Responsable: true,
        Nombre_Usuario: true,
        Contraseña: true,
        Nombres: true,
        Apellidos: true,
        Google_Drive_Foto_ID: true,
        // Obtener información de estudiantes relacionados
        // relaciones: {
        //   select: {
        //     Tipo: true,
        //     estudiante: {
        //       select: {
        //         DNI_Estudiante: true,
        //         Nombres: true,
        //         Apellidos: true,
        //         Estado: true,
        //         Google_Drive_Foto_ID: true,
        //         aula: {
        //           select: {
        //             Id_Aula: true,
        //             Nivel: true,
        //             Grado: true,
        //             Seccion: true,
        //             profesor_primaria: {
        //               select: {
        //                 Nombres: true,
        //                 Apellidos: true,
        //                 Celular: true
        //               }
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
      },
    });

    // Si no existe el responsable o las credenciales son incorrectas, retornar error
    if (!responsable) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar la contraseña
    const isContraseñaValid = verifyResponsablePassword(
      Contraseña,
      responsable.Contraseña
    );

    if (!isContraseñaValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Obtener estudiantes activos relacionados
    // const estudiantesRelacionados = responsable.relaciones
    //   .filter(relacion => relacion.estudiante.Estado)
    //   .map(relacion => ({
    //     DNI_Estudiante: relacion.estudiante.DNI_Estudiante,
    //     Nombres: relacion.estudiante.Nombres,
    //     Apellidos: relacion.estudiante.Apellidos,
    //     Google_Drive_Foto_ID: relacion.estudiante.Google_Drive_Foto_ID,
    //     TipoRelacion: relacion.Tipo === "H" ? "Hijo/a" : "A cargo",
    //     Aula: relacion.estudiante.aula ? {
    //       Id_Aula: relacion.estudiante.aula.Id_Aula,
    //       Nivel: relacion.estudiante.aula.Nivel,
    //       Grado: relacion.estudiante.aula.Grado,
    //       Seccion: relacion.estudiante.aula.Seccion,
    //       Profesor: relacion.estudiante.aula.profesor_primaria ? {
    //         Nombres: relacion.estudiante.aula.profesor_primaria.Nombres,
    //         Apellidos: relacion.estudiante.aula.profesor_primaria.Apellidos,
    //         Celular: relacion.estudiante.aula.profesor_primaria.Celular
    //       } : null
    //     } : null
    //   }));

    // Generar token JWT
    const token = generateResponsableToken(
      responsable.DNI_Responsable,
      responsable.Nombre_Usuario
    );

    const response: ResponseSuccessLogin = {
      message: "Inicio de sesión exitoso",
      data: {
        Apellidos: responsable.Apellidos,
        Nombres: responsable.Nombres,
        Rol: RolesSistema.Responsable,
        token,
        Google_Drive_Foto_ID: responsable.Google_Drive_Foto_ID,
        // Estudiantes: estudiantesRelacionados
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
