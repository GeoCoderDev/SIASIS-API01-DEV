import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";

import wereObligatoryQueryParamsReceived from "../../../../middlewares/wereObligatoryQueryParamsReceived";
import isDirectivoAuthenticated from "../../../../middlewares/isDirectivoAuthenticated";
import isProfesorPrimariaAuthenticated from "../../../../middlewares/isProfesorPrimariaAuthenticated";
import isProfesorSecundariaAuthenticated from "../../../../middlewares/isProfesorSecundariaAuthenticated";
import isTutorAuthenticated from "../../../../middlewares/isTutorAuthenticated";
import isPersonalAdministrativoAuthenticated from "../../../../middlewares/isPersonalAdministrativoAuthenticated";
import isAuxiliarAuthenticated from "../../../../middlewares/isAuxiliarAuthenticated";
import checkAuthentication from "../../../../middlewares/checkAuthentication";
import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";
import {
  RequestErrorTypes,
  SystemErrorTypes,
  TokenErrorTypes,
  UserErrorTypes,
} from "../../../../interfaces/shared/apis/errors";
import { RolesTexto } from "../../../../../assets/RolesTextosEspañol";
import { ErrorResponseAPIBase } from "../../../../interfaces/shared/apis/types";
import { validateImageType } from "../../../../lib/helpers/validators/images/validateImageType";
import { validateFileSize } from "../../../../lib/helpers/validators/validateFileSize";
import {
  AuxiliarAuthenticated,
  DirectivoAuthenticated,
  PersonalAdministrativoAuthenticated,
  ProfesorPrimariaAuthenticated,
  ProfesorTutorSecundariaAuthenticated,
} from "../../../../interfaces/JWTPayload";
import { handlePrismaError } from "../../../../lib/helpers/handlers/errors/prisma";
import { deleteFileFromDrive } from "../../../../lib/helpers/functions/GoogleDrive/deleteFileFromDrive";
import { uploadFileToDrive } from "../../../../lib/helpers/functions/GoogleDrive/uploadFileToDrive";
import { CambiarFotoPerfilSuccessResponse } from "../../../../interfaces/shared/apis/shared/mis-datos/mi-foto-perfil/types";

// Definimos un nuevo enum para errores relacionados con archivos/imágenes
export enum FileErrorTypes {
  FILE_MISSING = "FILE_MISSING",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  FILE_UPLOAD_FAILED = "FILE_UPLOAD_FAILED",
  FILE_DELETE_FAILED = "FILE_DELETE_FAILED",
}

const router = Router();
const prisma = new PrismaClient();

// Configuración de Multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

router.put(
  "/",
  wereObligatoryQueryParamsReceived(["Rol"]) as any,
  isDirectivoAuthenticated,
  isProfesorPrimariaAuthenticated,
  isProfesorSecundariaAuthenticated,
  isTutorAuthenticated,
  isAuxiliarAuthenticated,
  isPersonalAdministrativoAuthenticated as any,
  // isResponsableAuthenticated,
  checkAuthentication as any,
  upload.single("foto"),
  (async (req: Request, res: Response) => {
    try {
      const { Rol } = req.query as { Rol: RolesSistema };
      const userData = req.user!;
      const file = req.file;

      // Verificar que el rol del token coincide con el rol solicitado
      if (req.userRole !== Rol) {
        req.authError = {
          type: TokenErrorTypes.TOKEN_WRONG_ROLE,
          message: `El token no corresponde a un ${RolesTexto[Rol].singular}`,
        };
        return res.status(403).json({
          success: false,
          message: req.authError.message,
          errorType: req.authError.type,
        } as ErrorResponseAPIBase);
      }

      // Verificar que se proporcionó un archivo
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No se proporcionó ninguna imagen",
          errorType: FileErrorTypes.FILE_MISSING,
        } as ErrorResponseAPIBase);
      }

      // Validar el tipo de archivo
      if (!validateImageType(file)) {
        return res.status(400).json({
          success: false,
          message:
            "El archivo debe ser una imagen válida (JPEG, PNG, GIF, etc.)",
          errorType: FileErrorTypes.INVALID_FILE_TYPE,
        } as ErrorResponseAPIBase);
      }

      // Validar el tamaño del archivo
      if (!validateFileSize(file)) {
        return res.status(400).json({
          success: false,
          message: "El archivo excede el tamaño máximo permitido (5MB)",
          errorType: FileErrorTypes.FILE_TOO_LARGE,
        } as ErrorResponseAPIBase);
      }

      // Generar nombre del archivo basado en el nombre de usuario y timestamp
      let folderPath = "";
      let fileName = "";
      let googleDriveFotoID: string | null = null;

      // Procesar según el rol
      switch (Rol) {
        case RolesSistema.Directivo: {
          const directivo = await prisma.t_Directivos.findUnique({
            where: {
              Id_Directivo: (userData as DirectivoAuthenticated).Id_Directivo,
            },
            select: {
              Google_Drive_Foto_ID: true,
              Nombre_Usuario: true,
            },
          });

          if (!directivo) {
            return res.status(404).json({
              success: false,
              message: "Directivo no encontrado",
              errorType: UserErrorTypes.USER_NOT_FOUND,
            } as ErrorResponseAPIBase);
          }

          googleDriveFotoID = directivo.Google_Drive_Foto_ID;
          folderPath = "Fotos de Perfil/Directivos";
          // Usar el nombre de usuario como nombre del archivo
          fileName = `${directivo.Nombre_Usuario}.${
            file.originalname.split(".").pop() || "png"
          }`;

          // Eliminar la foto anterior si existe
          if (googleDriveFotoID) {
            await deleteFileFromDrive(googleDriveFotoID);
          }

          // Subir el nuevo archivo
          const uploadResult = await uploadFileToDrive(
            file,
            folderPath,
            fileName
          );

          // Actualizar el registro en la base de datos
          await prisma.t_Directivos.update({
            where: {
              Id_Directivo: (userData as DirectivoAuthenticated).Id_Directivo,
            },
            data: {
              Google_Drive_Foto_ID: uploadResult.id,
            },
          });

          // Responder con éxito
          return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente",
            data: {
              fileId: uploadResult.id,
              fileUrl: uploadResult.webContentLink || uploadResult.webViewLink,
            },
          } as CambiarFotoPerfilSuccessResponse);
        }

        case RolesSistema.Auxiliar: {
          const auxiliar = await prisma.t_Auxiliares.findUnique({
            where: {
              DNI_Auxiliar: (userData as AuxiliarAuthenticated).DNI_Auxiliar,
            },
            select: {
              Google_Drive_Foto_ID: true,
              Nombre_Usuario: true,
            },
          });

          if (!auxiliar) {
            return res.status(404).json({
              success: false,
              message: "Auxiliar no encontrado",
              errorType: UserErrorTypes.USER_NOT_FOUND,
            } as ErrorResponseAPIBase);
          }

          googleDriveFotoID = auxiliar.Google_Drive_Foto_ID;
          folderPath = "Fotos de Perfil/Auxiliares";
          // Usar el nombre de usuario como nombre del archivo
          fileName = `${auxiliar.Nombre_Usuario}.${
            file.originalname.split(".").pop() || "png"
          }`;

          // Eliminar la foto anterior si existe
          if (googleDriveFotoID) {
            await deleteFileFromDrive(googleDriveFotoID);
          }

          // Subir el nuevo archivo
          const uploadResult = await uploadFileToDrive(
            file,
            folderPath,
            fileName
          );

          // Actualizar el registro en la base de datos
          await prisma.t_Auxiliares.update({
            where: {
              DNI_Auxiliar: (userData as AuxiliarAuthenticated).DNI_Auxiliar,
            },
            data: {
              Google_Drive_Foto_ID: uploadResult.id,
            },
          });

          // Responder con éxito
          return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente",
            data: {
              fileId: uploadResult.id,
              fileUrl: uploadResult.webContentLink || uploadResult.webViewLink,
            },
          } as CambiarFotoPerfilSuccessResponse);
        }

        case RolesSistema.ProfesorPrimaria: {
          const profesor = await prisma.t_Profesores_Primaria.findUnique({
            where: {
              DNI_Profesor_Primaria: (userData as ProfesorPrimariaAuthenticated)
                .DNI_Profesor_Primaria,
            },
            select: {
              Google_Drive_Foto_ID: true,
              Nombre_Usuario: true,
            },
          });

          if (!profesor) {
            return res.status(404).json({
              success: false,
              message: "Profesor de primaria no encontrado",
              errorType: UserErrorTypes.USER_NOT_FOUND,
            } as ErrorResponseAPIBase);
          }

          googleDriveFotoID = profesor.Google_Drive_Foto_ID;
          folderPath = "Fotos de Perfil/Profesores Primaria";
          // Usar el nombre de usuario como nombre del archivo
          fileName = `${profesor.Nombre_Usuario}.${
            file.originalname.split(".").pop() || "png"
          }`;

          // Eliminar la foto anterior si existe
          if (googleDriveFotoID) {
            await deleteFileFromDrive(googleDriveFotoID);
          }

          // Subir el nuevo archivo
          const uploadResult = await uploadFileToDrive(
            file,
            folderPath,
            fileName
          );

          // Actualizar el registro en la base de datos
          await prisma.t_Profesores_Primaria.update({
            where: {
              DNI_Profesor_Primaria: (userData as ProfesorPrimariaAuthenticated)
                .DNI_Profesor_Primaria,
            },
            data: {
              Google_Drive_Foto_ID: uploadResult.id,
            },
          });

          // Responder con éxito
          return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente",
            data: {
              fileId: uploadResult.id,
              fileUrl: uploadResult.webContentLink || uploadResult.webViewLink,
            },
          } as CambiarFotoPerfilSuccessResponse);
        }

        case RolesSistema.ProfesorSecundaria:
        case RolesSistema.Tutor: {
          const profesor = await prisma.t_Profesores_Secundaria.findUnique({
            where: {
              DNI_Profesor_Secundaria: (
                userData as ProfesorTutorSecundariaAuthenticated
              ).DNI_Profesor_Secundaria,
            },
            select: {
              Google_Drive_Foto_ID: true,
              Nombre_Usuario: true,
            },
          });

          if (!profesor) {
            return res.status(404).json({
              success: false,
              message: `${
                Rol === RolesSistema.Tutor ? "Tutor" : "Profesor de secundaria"
              } no encontrado`,
              errorType: UserErrorTypes.USER_NOT_FOUND,
            } as ErrorResponseAPIBase);
          }

          googleDriveFotoID = profesor.Google_Drive_Foto_ID;
          folderPath = "Fotos de Perfil/Profesores Secundaria";
          // Usar el nombre de usuario como nombre del archivo
          fileName = `${profesor.Nombre_Usuario}.${
            file.originalname.split(".").pop() || "png"
          }`;

          // Eliminar la foto anterior si existe
          if (googleDriveFotoID) {
            await deleteFileFromDrive(googleDriveFotoID);
          }

          // Subir el nuevo archivo
          const uploadResult = await uploadFileToDrive(
            file,
            folderPath,
            fileName
          );

          // Actualizar el registro en la base de datos
          await prisma.t_Profesores_Secundaria.update({
            where: {
              DNI_Profesor_Secundaria: (
                userData as ProfesorTutorSecundariaAuthenticated
              ).DNI_Profesor_Secundaria,
            },
            data: {
              Google_Drive_Foto_ID: uploadResult.id,
            },
          });

          // Responder con éxito
          return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente",
            data: {
              fileId: uploadResult.id,
              fileUrl: uploadResult.webContentLink || uploadResult.webViewLink,
            },
          } as CambiarFotoPerfilSuccessResponse);
        }

        case RolesSistema.PersonalAdministrativo: {
          const personal = await prisma.t_Personal_Administrativo.findUnique({
            where: {
              DNI_Personal_Administrativo: (
                userData as PersonalAdministrativoAuthenticated
              ).DNI_Personal_Administrativo,
            },
            select: {
              Google_Drive_Foto_ID: true,
              Nombre_Usuario: true,
            },
          });

          if (!personal) {
            return res.status(404).json({
              success: false,
              message: "Personal administrativo no encontrado",
              errorType: UserErrorTypes.USER_NOT_FOUND,
            } as ErrorResponseAPIBase);
          }

          googleDriveFotoID = personal.Google_Drive_Foto_ID;
          folderPath = "Fotos de Perfil/Personal Administrativo";
          // Usar el nombre de usuario como nombre del archivo
          fileName = `${personal.Nombre_Usuario}.${
            file.originalname.split(".").pop() || "png"
          }`;

          // Eliminar la foto anterior si existe
          if (googleDriveFotoID) {
            await deleteFileFromDrive(googleDriveFotoID);
          }

          // Subir el nuevo archivo
          const uploadResult = await uploadFileToDrive(
            file,
            folderPath,
            fileName
          );

          // Actualizar el registro en la base de datos
          await prisma.t_Personal_Administrativo.update({
            where: {
              DNI_Personal_Administrativo: (
                userData as PersonalAdministrativoAuthenticated
              ).DNI_Personal_Administrativo,
            },
            data: {
              Google_Drive_Foto_ID: uploadResult.id,
            },
          });

          // Responder con éxito
          return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente",
            data: {
              fileId: uploadResult.id,
              fileUrl: uploadResult.webContentLink || uploadResult.webViewLink,
            },
          } as CambiarFotoPerfilSuccessResponse);
        }

        /* 
        case RolesSistema.Responsable: {
          const responsable = await prisma.t_Responsables.findUnique({
            where: {
              DNI_Responsable: (userData as ResponsableAuthenticated).DNI_Responsable,
            },
            select: {
              Google_Drive_Foto_ID: true,
              Nombre_Usuario: true,
            },
          });

          if (!responsable) {
            return res.status(404).json({
              success: false,
              message: "Responsable no encontrado",
              errorType: UserErrorTypes.USER_NOT_FOUND,
            } as ErrorResponseAPIBase);
          }

          googleDriveFotoID = responsable.Google_Drive_Foto_ID;
          folderPath = "Fotos de Perfil/Responsables";
          // Usar el nombre de usuario como nombre del archivo
          fileName = `${responsable.Nombre_Usuario}.${file.originalname.split(".").pop() || "png"}`;

          // Eliminar la foto anterior si existe
          if (googleDriveFotoID) {
            await deleteFileFromDrive(googleDriveFotoID);
          }

          // Subir el nuevo archivo
          const uploadResult = await uploadFileToDrive(file, folderPath, fileName);

          // Actualizar el registro en la base de datos
          await prisma.t_Responsables.update({
            where: {
              DNI_Responsable: (userData as ResponsableAuthenticated).DNI_Responsable,
            },
            data: {
              Google_Drive_Foto_ID: uploadResult.id,
            },
          });

          // Responder con éxito
          return res.status(200).json({
            success: true,
            message: "Foto de perfil actualizada correctamente",
            data: {
              fileId: uploadResult.id,
              fileUrl: uploadResult.webContentLink || uploadResult.webViewLink,
            },
          } as CambiarFotoPerfilSuccessResponse);
        }
        */

        default:
          return res.status(400).json({
            success: false,
            message: "Rol no soportado",
            errorType: RequestErrorTypes.INVALID_PARAMETERS,
          } as ErrorResponseAPIBase);
      }
    } catch (error) {
      console.error("Error al actualizar la foto de perfil:", error);

      // Intentar manejar el error con la función específica para errores de Prisma
      const handledError = handlePrismaError(error);
      if (handledError) {
        return res.status(handledError.status).json(handledError.response);
      }

      return res.status(500).json({
        success: false,
        message: "Error al actualizar la foto de perfil",
        errorType: SystemErrorTypes.UNKNOWN_ERROR,
        details:
          error instanceof Error
            ? { message: error.message }
            : { message: "Error desconocido" },
      } as ErrorResponseAPIBase);
    }
  }) as any
);

export default router;
