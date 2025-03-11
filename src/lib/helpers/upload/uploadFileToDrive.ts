import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { createReadStream } from 'fs';

// Función para subir archivo a Google Drive con ruta de carpetas específica
export async function uploadFileToDrive(
  file: Express.Multer.File,
  folderPath: string, // Ejemplo: "Fotos de Perfil/Directivos"
  fileName: string,
  oauth2Client: any
): Promise<{ id: string; webContentLink: string; webViewLink: string }> {
  try {
    // Crear cliente de Google Drive
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    // Guardar temporalmente el archivo si viene como buffer
    let tempFilePath = "";
    if (file.buffer) {
      tempFilePath = path.join(__dirname, "temp_" + fileName);
      fs.writeFileSync(tempFilePath, file.buffer);
    }

    // Ruta real del archivo (temporal o el path original)
    const filePath = tempFilePath || file.path;

    // Separar la ruta en carpetas
    const folders = folderPath.split("/").filter((f) => f.trim() !== "");

    // ID de la carpeta raíz (Mi unidad)
    let parentFolderId:string = "root";

    // Recorrer/crear la estructura de carpetas
    for (const folderName of folders) {
      // Buscar si la carpeta ya existe
      const folderResponse = await drive.files.list({
        q: `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id, name)",
      });

      // Verificar si encontramos la carpeta
      if (folderResponse.data.files && folderResponse.data.files.length > 0) {
        // Usar la carpeta existente
        parentFolderId = folderResponse.data.files[0].id || "";
      } else {
        // Crear la carpeta si no existe
        const newFolder = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentFolderId],
          },
        });
        parentFolderId = newFolder.data.id || "";
      }
    }

    // Verificar si ya existe un archivo con el mismo nombre en la carpeta destino
    const existingFiles = await drive.files.list({
      q: `name='${fileName}' and '${parentFolderId}' in parents and trashed=false`,
      fields: "files(id, name)",
    });

    let fileId = "";

    if (existingFiles.data.files && existingFiles.data.files.length > 0) {
      // Actualizar el archivo existente
      fileId = existingFiles.data.files[0].id || "";
      await drive.files.update({
        fileId: fileId,
        media: {
          mimeType: file.mimetype,
          body: createReadStream(filePath),
        },
      });
    } else {
      // Subir como nuevo archivo
      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: file.mimetype,
          parents: [parentFolderId],
        },
        media: {
          mimeType: file.mimetype,
          body: createReadStream(filePath),
        },
      });
      fileId = response.data.id || "";
    }

    // Configurar permisos para que sea accesible públicamente
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Obtener los links del archivo
    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: "id, webContentLink, webViewLink",
    });

    // Limpiar archivos temporales si se crearon
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return {
      id: fileInfo.data.id || "",
      webContentLink: fileInfo.data.webContentLink || "",
      webViewLink: fileInfo.data.webViewLink || "",
    };
  } catch (error) {
    console.error("Error subiendo archivo a Google Drive:", error);
    throw error;
  }
}
