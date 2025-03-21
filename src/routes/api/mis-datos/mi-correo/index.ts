import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  ErrorResponseAPIBase,
  SuccessResponseAPIBase,
} from "../../../../interfaces/shared/apis/types";
import isDirectivoAuthenticated from "../../../../middlewares/isDirectivoAuthenticated";
import isTutorAuthenticated from "../../../../middlewares/isTutorAuthenticated";
import checkAuthentication from "../../../../middlewares/checkAuthentication";
import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";
import {
  RequestErrorTypes,
  SystemErrorTypes,
  UserErrorTypes,
  ValidationErrorTypes,
} from "../../../../interfaces/shared/apis/errors";
import {
  DirectivoAuthenticated,
  ProfesorTutorSecundariaAuthenticated,
} from "../../../../interfaces/JWTPayload";
import { handlePrismaError } from "../../../../lib/helpers/handlers/errors/prisma";
import { ValidatorConfig } from "../../../../lib/helpers/validators/data/types";
import { validateData } from "../../../../lib/helpers/validators/data/validateData";
import { validateEmail } from "../../../../lib/helpers/validators/data/validateCorreo";
import { enviarCorreoOTP } from "../../../../lib/helpers/email/enviarCorreoOTP";
import generarCodigoOTP from "../../../../lib/helpers/security/generarCodigoOTP";
import {
  CambiarCorreoRequestBody,
  CambiarCorreoSuccessResponse,
  ConfirmarCorreoRequestBody,
} from "../../../../interfaces/shared/apis/api01/mis-datos/cambiar-correo/types";

const router = Router();
const prisma = new PrismaClient();

router.put(
  "/solicitar-cambio-correo",
  isDirectivoAuthenticated,
  isTutorAuthenticated,
  checkAuthentication as any,
  (async (req: Request, res: Response) => {
    try {
      const userData = req.user!;
      const userRole = req.userRole!;
      const { nuevoCorreo } = req.body as CambiarCorreoRequestBody;

      // Verificar que el rol es uno de los permitidos
      if (
        userRole !== RolesSistema.Directivo &&
        userRole !== RolesSistema.Tutor
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Este endpoint solo está disponible para Directivos y Tutores",
          errorType: RequestErrorTypes.INVALID_PARAMETERS,
        } as ErrorResponseAPIBase);
      }

      // Configurar validadores
      const validators: ValidatorConfig[] = [
        { field: "nuevoCorreo", validator: validateEmail },
      ];

      // Validar el correo electrónico
      const validationResult = validateData({ nuevoCorreo }, validators);

      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: validationResult.errorMessage,
          errorType: validationResult.errorType,
        } as ErrorResponseAPIBase);
      }

      // Verificar si el correo ya existe en cualquiera de las tablas donde es único
      const correoExistente = await prisma.$transaction(async (tx) => {
        // Verificar en la tabla de Directivos
        const directivo = await tx.t_Directivos.findFirst({
          where: {
            Correo_Electronico: nuevoCorreo,
          },
        });

        if (directivo) return true;

        // Verificar en la tabla de Profesores Secundaria (para Tutores)
        const profesor = await tx.t_Profesores_Secundaria.findFirst({
          where: {
            Correo_Electronico: nuevoCorreo,
          },
        });

        return !!profesor;
      });

      if (correoExistente) {
        return res.status(409).json({
          success: false,
          message: "El correo electrónico ya está registrado en el sistema",
          errorType: ValidationErrorTypes.INVALID_EMAIL,
        } as ErrorResponseAPIBase);
      }

      // Obtener información del usuario según su rol
      let nombreCompleto = "";

      if (userRole === RolesSistema.Directivo) {
        const directivo = await prisma.t_Directivos.findUnique({
          where: {
            Id_Directivo: (userData as DirectivoAuthenticated).Id_Directivo,
          },
          select: {
            Nombres: true,
            Apellidos: true,
          },
        });

        if (!directivo) {
          return res.status(404).json({
            success: false,
            message: "Directivo no encontrado",
            errorType: UserErrorTypes.USER_NOT_FOUND,
          } as ErrorResponseAPIBase);
        }

        nombreCompleto = `${directivo.Nombres} ${directivo.Apellidos}`;
      } else {
        // Rol es Tutor
        const tutor = await prisma.t_Profesores_Secundaria.findUnique({
          where: {
            DNI_Profesor_Secundaria: (
              userData as ProfesorTutorSecundariaAuthenticated
            ).DNI_Profesor_Secundaria,
          },
          select: {
            Nombres: true,
            Apellidos: true,
          },
        });

        if (!tutor) {
          return res.status(404).json({
            success: false,
            message: "Tutor no encontrado",
            errorType: UserErrorTypes.USER_NOT_FOUND,
          } as ErrorResponseAPIBase);
        }

        nombreCompleto = `${tutor.Nombres} ${tutor.Apellidos}`;
      }

      // Generar código OTP
      const codigoOTP = generarCodigoOTP();

      // Calcular tiempo de expiración (30 minutos desde ahora)
      const fechaExpiracion = new Date();
      fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 30);

      // Guardar código OTP en la base de datos
      await prisma.t_Codigos_OTP.create({
        data: {
          Codigo: codigoOTP,
          Fecha_Creacion: new Date(), // La fecha actual
          // Guardamos el correo nuevo y el ID del usuario para la verificación posterior
          Correo_Destino: nuevoCorreo,
          Rol_Usuario: userRole,
          Id_Usuario:
            userRole === RolesSistema.Directivo
              ? String((userData as DirectivoAuthenticated).Id_Directivo)
              : (userData as ProfesorTutorSecundariaAuthenticated)
                  .DNI_Profesor_Secundaria,
          Fecha_Expiracion: fechaExpiracion,
        },
      });

      // Enviar correo electrónico con el código OTP
      await enviarCorreoOTP(nuevoCorreo, codigoOTP, nombreCompleto);

      // Calcular tiempo de expiración en segundos
      const tiempoExpiracionSegundos = Math.floor(
        (fechaExpiracion.getTime() - Date.now()) / 1000
      );

      return res.status(200).json({
        success: true,
        message:
          "Se ha enviado un código de verificación al nuevo correo electrónico",
        otpExpireTime: tiempoExpiracionSegundos,
      } as CambiarCorreoSuccessResponse);
    } catch (error) {
      console.error("Error al verificar correo electrónico:", error);

      // Manejar error del servicio de correo
      if (
        (error instanceof Error &&
          error.message === "No se pudo enviar el correo de verificación") ||
        ((error as any).name === "Error" &&
          (error as Error).message.includes("gmail"))
      ) {
        return res.status(500).json({
          success: false,
          message: "Error al enviar el correo electrónico de verificación",
          errorType: SystemErrorTypes.EXTERNAL_SERVICE_ERROR,
          details: (error as any).message,
        } as ErrorResponseAPIBase);
      }

      // Intentar manejar el error con la función específica para errores de Prisma
      const handledError = handlePrismaError(error);
      if (handledError) {
        return res.status(handledError.status).json(handledError.response);
      }

      return res.status(500).json({
        success: false,
        message:
          "Error al procesar la solicitud de cambio de correo electrónico",
        errorType: SystemErrorTypes.UNKNOWN_ERROR,
        details: error,
      } as ErrorResponseAPIBase);
    }
  }) as any
);

// Endpoint para confirmar el cambio de correo con el código OTP
router.post(
  "/confirmar-correo",
  isDirectivoAuthenticated,
  isTutorAuthenticated,
  checkAuthentication as any,
  (async (req: Request, res: Response) => {
    try {
      const userData = req.user!;
      const userRole = req.userRole!;
      const { codigo, nuevoCorreo } = req.body as ConfirmarCorreoRequestBody;

      // Verificar que el rol es uno de los permitidos
      if (
        userRole !== RolesSistema.Directivo &&
        userRole !== RolesSistema.Tutor
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Este endpoint solo está disponible para Directivos y Tutores",
          errorType: RequestErrorTypes.INVALID_PARAMETERS,
        } as ErrorResponseAPIBase);
      }

      // Validar que se proporcionaron los parámetros necesarios
      if (!codigo || !nuevoCorreo) {
        return res.status(400).json({
          success: false,
          message:
            "Se requiere el código de verificación y el nuevo correo electrónico",
          errorType: RequestErrorTypes.MISSING_PARAMETERS,
        } as ErrorResponseAPIBase);
      }

      // Validar el formato del correo electrónico nuevamente
      const validators: ValidatorConfig[] = [
        { field: "nuevoCorreo", validator: validateEmail },
      ];

      // Validar el correo electrónico
      const validationResult = validateData({ nuevoCorreo }, validators);

      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: validationResult.errorMessage,
          errorType: validationResult.errorType,
        } as ErrorResponseAPIBase);
      }

      // Obtener ID del usuario según su rol
      const idUsuario =
        userRole === RolesSistema.Directivo
          ? String((userData as DirectivoAuthenticated).Id_Directivo)
          : (userData as ProfesorTutorSecundariaAuthenticated)
              .DNI_Profesor_Secundaria;

      // Buscar el código OTP en la base de datos
      const codigoOTP = await prisma.t_Codigos_OTP.findFirst({
        where: {
          Codigo: codigo,
          Correo_Destino: nuevoCorreo,
          Rol_Usuario: userRole,
          Id_Usuario: idUsuario,
          Fecha_Expiracion: {
            gte: new Date(), // No ha expirado
          },
        },
      });

      if (!codigoOTP) {
        return res.status(400).json({
          success: false,
          message: "Código de verificación inválido o expirado",
          errorType: ValidationErrorTypes.INVALID_FORMAT,
        } as ErrorResponseAPIBase);
      }

      // Actualizar el correo electrónico en la base de datos según el rol
      if (userRole === RolesSistema.Directivo) {
        await prisma.t_Directivos.update({
          where: {
            Id_Directivo: (userData as DirectivoAuthenticated).Id_Directivo,
          },
          data: {
            Correo_Electronico: nuevoCorreo,
          },
        });
      } else {
        // Rol es Tutor
        await prisma.t_Profesores_Secundaria.update({
          where: {
            DNI_Profesor_Secundaria: (
              userData as ProfesorTutorSecundariaAuthenticated
            ).DNI_Profesor_Secundaria,
          },
          data: {
            Correo_Electronico: nuevoCorreo,
          },
        });
      }

      // Eliminar el código OTP utilizado
      await prisma.t_Codigos_OTP.delete({
        where: {
          Id_Codigo_OTP: codigoOTP.Id_Codigo_OTP,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Correo electrónico actualizado correctamente",
      } as SuccessResponseAPIBase);
    } catch (error) {
      console.error("Error al confirmar cambio de correo electrónico:", error);

      // Intentar manejar el error con la función específica para errores de Prisma
      const handledError = handlePrismaError(error);
      if (handledError) {
        return res.status(handledError.status).json(handledError.response);
      }

      return res.status(500).json({
        success: false,
        message:
          "Error al procesar la confirmación de cambio de correo electrónico",
        errorType: SystemErrorTypes.UNKNOWN_ERROR,
        details: error,
      } as ErrorResponseAPIBase);
    }
  }) as any
);

export default router;
