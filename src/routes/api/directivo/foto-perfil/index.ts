import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import multer from "multer";
import { validateImageType } from "../../../../lib/helpers/validators/validateImageType";
import { validateFileSize } from "../../../../lib/helpers/validators/validateFileSize";
import { google } from "googleapis";
import { deleteFileFromDrive } from "../../../../lib/helpers/functions/GoogleDrive/deleteFileFromDrive";
import { uploadFileToDrive } from "../../../../lib/helpers/upload/uploadFileToDrive";

const router = Router();

// Configuración de Prisma
const prisma = new PrismaClient();

// Configuración de Multer para almacenamiento en memoria (importante para Vercel)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

router.get("/", ((req: Request, res: Response) => {
  res.json({ message: "Hola desde Directivo endpoint" });
}) as any);

// Endpoint para cambiar foto de perfil de directivo
router.put("/", upload.single("profilePhoto"), (async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, nombreUsuario } = req.body;
    const file = req.file;

    // 1. Validar que llegaron los datos requeridos
    if (!userId || !nombreUsuario) {
      return res.status(400).json({
        success: false,
        message: "Se requiere el ID y nombre de usuario del directivo",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó ninguna imagen",
      });
    }

    // 2. Verificar que el usuario existe en la base de datos
    const directivo = await prisma.t_Directivos.findFirst({
      where: {
        Id_Directivo: parseInt(userId.toString()),
        Nombre_Usuario: nombreUsuario,
      },
    });

    if (!directivo) {
      return res.status(404).json({
        success: false,
        message: "Directivo no encontrado",
      });
    }

    // 3. Validar el archivo recibido
    if (!validateImageType(file)) {
      return res.status(400).json({
        success: false,
        message: "El archivo debe ser una imagen válida (JPEG, PNG, GIF, etc.)",
      });
    }

    if (!validateFileSize(file)) {
      return res.status(400).json({
        success: false,
        message: "El archivo excede el tamaño máximo permitido (5MB)",
      });
    }

    // 4. Configurar OAuth2 para Google Drive
    const oauth2Client = new google.auth.OAuth2(
      process.env.RDP01_GOOGLE_CLIENT_ID,
      process.env.RDP01_GOOGLE_CLIENT_SECRET,
      process.env.RDP01_GOOGLE_REDIRECT_URL
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.RDP01_GOOGLE_REFRESH_TOKEN,
    });

    // 5. Eliminar el archivo anterior en Google Drive (si existe)
    if (directivo.Google_Drive_Foto_ID) {
      await deleteFileFromDrive(directivo.Google_Drive_Foto_ID, oauth2Client);
    }

    // 6. Generar nombre del archivo basado en el DNI y nombre de usuario
    const fileExtension = file.originalname.split(".").pop() || "png";
    const fileName = `${nombreUsuario}.${fileExtension}`;

    // 7. Definir la ruta de carpetas en Google Drive
    const folderPath = "Fotos de Perfil/Directivos";

    // 8. Subir el nuevo archivo a Google Drive
    const uploadResult = await uploadFileToDrive(
      file,
      folderPath,
      fileName,
      oauth2Client
    );

    // 9. Actualizar el registro del directivo con el nuevo ID de la imagen
    const updatedDirectivo = await prisma.t_Directivos.update({
      where: {
        Id_Directivo: directivo.Id_Directivo,
      },
      data: {
        Google_Drive_Foto_ID: uploadResult.id,
      },
    });

    // 10. Responder con éxito
    return res.status(200).json({
      success: true,
      message: "Foto de perfil actualizada correctamente",
      data: {
        fileId: uploadResult.id,
        fileName: fileName,
        fileUrl: uploadResult.webContentLink,
        directivoId: updatedDirectivo.Id_Directivo,
      },
    });
  } catch (error) {
    console.error("Error al actualizar la foto de perfil:", error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la foto de perfil",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  } finally {
    // Cerrar conexión con Prisma
    await prisma.$disconnect();
  }
}) as any);

export default router;
