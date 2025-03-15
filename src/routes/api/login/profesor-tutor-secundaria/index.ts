import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateProfesorSecundariaToken } from "../../../../lib/helpers/generators/JWT/profesorSecundariaToken";

import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";
import { Genero } from "../../../../interfaces/shared/Genero";
import { generateTutorToken } from "../../../../lib/helpers/generators/JWT/tutorToken";
import { verifyProfesorTutorSecundariaPassword } from "../../../../lib/helpers/encriptations/profesorTutotSecundaria.encriptation";
import { ResponseSuccessLogin } from "../../../../interfaces/shared/apis/shared/login/types";

const router = Router();
const prisma = new PrismaClient();

export interface LoginBody {
  Nombre_Usuario: string;
  Contraseña: string;
}

router.get("/", (async (req: Request, res: Response) => {
  return res.json({ message: "Login Profesor Secundaria / Tutor" });
}) as any);

// Ruta de login para Profesores de Secundaria / Tutores
router.post("/", (async (req: Request, res: Response) => {
  try {
    const { Nombre_Usuario, Contraseña }: LoginBody = req.body;

    // Validar que se proporcionen ambos campos
    if (!Nombre_Usuario || !Contraseña) {
      return res.status(400).json({
        message: "El nombre de usuario y la contraseña son obligatorios",
      });
    }

    // Buscar el profesor de secundaria por nombre de usuario
    const profesorSecundaria = await prisma.t_Profesores_Secundaria.findUnique({
      where: {
        Nombre_Usuario: Nombre_Usuario,
      },
      select: {
        DNI_Profesor_Secundaria: true,
        Nombre_Usuario: true,
        Contraseña: true,
        Nombres: true,
        Apellidos: true,
        Google_Drive_Foto_ID: true,
        Genero: true,
        Estado: true,
        // Verificar si es tutor mediante la relación con un aula
        aulas: {
          select: {
            Id_Aula: true,
            Nivel: true,
            Grado: true,
            Seccion: true,
            Color: true,
          },
        },
        // // Información de cursos asignados
        // cursos: {
        //   select: {
        //     Id_Curso_Horario: true,
        //     Nombre_Curso: true,
        //     Dia_Semana: true,
        //     Indice_Hora_Academica_Inicio: true,
        //     Cant_Hora_Academicas: true,
        //   },
        // },
      },
    });

    // Si no existe el profesor de secundaria o las credenciales son incorrectas, retornar error
    if (!profesorSecundaria) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar si la cuenta está activa
    if (!profesorSecundaria.Estado) {
      return res.status(403).json({
        success: false,
        message: "Tu cuenta está inactiva. Contacta al administrador.",
      });
    }

    // Verificar la contraseña
    const isContraseñaValid = verifyProfesorTutorSecundariaPassword(
      Contraseña,
      profesorSecundaria.Contraseña
    );

    if (!isContraseñaValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Determinar si es tutor (tiene aula asignada)
    const esTutor = profesorSecundaria.aulas.length > 0;

    // Generar token JWT según el rol
    let token;
    let rol;

    if (esTutor) {
      token = generateTutorToken(
        profesorSecundaria.DNI_Profesor_Secundaria,
        profesorSecundaria.Nombre_Usuario
      );
      rol = RolesSistema.Tutor;
    } else {
      token = generateProfesorSecundariaToken(
        profesorSecundaria.DNI_Profesor_Secundaria,
        profesorSecundaria.Nombre_Usuario
      );
      rol = RolesSistema.ProfesorSecundaria;
    }

    // Preparar información del aula asignada si es tutor
    // const aulaInfo = esTutor
    //   ? {
    //       Id_Aula: profesorSecundaria.aulas[0].Id_Aula,
    //       Nivel: profesorSecundaria.aulas[0].Nivel,
    //       Grado: profesorSecundaria.aulas[0].Grado,
    //       Seccion: profesorSecundaria.aulas[0].Seccion,
    //       Color: profesorSecundaria.aulas[0].Color,
    //     }
    //   : null;

    // // Preparar información de cursos
    // const cursosInfo = profesorSecundaria.cursos.map((curso) => ({
    //   Id_Curso_Horario: curso.Id_Curso_Horario,
    //   Nombre_Curso: curso.Nombre_Curso,
    //   Dia_Semana: curso.Dia_Semana,
    //   Indice_Hora_Academica_Inicio: curso.Indice_Hora_Academica_Inicio,
    //   Cant_Hora_Academicas: curso.Cant_Hora_Academicas,
    // }));

    const response: ResponseSuccessLogin = {
      message: "Inicio de sesión exitoso",
      data: {
        Apellidos: profesorSecundaria.Apellidos,
        Nombres: profesorSecundaria.Nombres,
        Rol: rol,
        token,
        Google_Drive_Foto_ID: profesorSecundaria.Google_Drive_Foto_ID,
        Genero: profesorSecundaria.Genero as Genero,
        // Solo incluir el aula si es tutor
        // ...(esTutor && { Aula: aulaInfo }),
        // // Incluir cursos para ambos roles
        // Cursos: cursosInfo,
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
