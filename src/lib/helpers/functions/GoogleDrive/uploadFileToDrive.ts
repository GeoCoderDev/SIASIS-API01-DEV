import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

/**
 * Interfaz para el resultado de la subida a Google Drive
 */
interface UploadResult {
  id: string;
  webContentLink: string;
  webViewLink: string;
}

/**
 * Sube un archivo a Google Drive en la ruta especificada
 * @param file Archivo de Multer (puede ser buffer o ruta física)
 * @param folderPath Ruta de carpetas en Google Drive (ej: "Fotos de Perfil/Directivos")
 * @param fileName Nombre del archivo en Google Drive
 * @param oauth2Client Cliente OAuth2 configurado
 * @returns Objeto con el id y enlaces del archivo
 */
export async function uploadFileToDrive(
  file: Express.Multer.File,
  folderPath: string,
  fileName: string,
  oauth2Client: any
): Promise<UploadResult> {
  try {
    // Crear cliente de Google Drive
    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });

    // Variable para el archivo temporal si se necesita
    let tempFilePath: string | null = null;
    
    // Si el archivo viene como buffer (como en Vercel), guardarlo temporalmente
    if (file.buffer) {
      const tempDir = os.tmpdir();
      tempFilePath = path.join(tempDir, `temp_${uuidv4()}_${fileName}`);
      fs.writeFileSync(tempFilePath, file.buffer);
    }

    // Ruta real del archivo (temporal o el path original)
    const filePath = tempFilePath || file.path;
    
    // Separar la ruta en carpetas
    const folders = folderPath.split('/').filter(f => f.trim() !== '');
    
    // ID de la carpeta raíz (Mi unidad)
    let parentFolderId = 'root';
    
    // Recorrer/crear la estructura de carpetas
    for (const folderName of folders) {
      // Buscar si la carpeta ya existe
      const folderResponse = await drive.files.list({
        q: `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });
      
      // Verificar si encontramos la carpeta
      if (folderResponse.data.files && folderResponse.data.files.length > 0) {
        // Usar la carpeta existente
        parentFolderId = folderResponse.data.files[0].id || '';
      } else {
        // Crear la carpeta si no existe
        const newFolder = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
          },
        });
        parentFolderId = newFolder.data.id || '';
      }
    }
    
    // Verificar si ya existe un archivo con el mismo nombre en la carpeta destino
    const existingFiles = await drive.files.list({
      q: `name='${fileName}' and '${parentFolderId}' in parents and trashed=false`,
      fields: 'files(id, name)',
    });
    
    let fileId = '';
    let body: fs.ReadStream | Readable;
    
    // Crear stream para subir el archivo
    if (filePath) {
      body = fs.createReadStream(filePath);
    } else if (file.buffer) {
      // Si por alguna razón no tenemos filePath pero sí buffer
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null); // Indicar fin del stream
      body = bufferStream;
    } else {
      throw new Error('No se pudo crear un stream del archivo');
    }
    
    if (existingFiles.data.files && existingFiles.data.files.length > 0) {
      // Actualizar el archivo existente
      fileId = existingFiles.data.files[0].id || '';
      await drive.files.update({
        fileId: fileId,
        media: {
          mimeType: file.mimetype,
          body: body,
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
          body: body,
        },
      });
      fileId = response.data.id || '';
    }
    
    // Configurar permisos para que sea accesible públicamente
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    
    // Obtener los links del archivo
    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: 'id, webContentLink, webViewLink',
    });
    
    // Limpiar archivos temporales si se crearon
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
    return {
      id: fileInfo.data.id || '',
      webContentLink: fileInfo.data.webContentLink || '',
      webViewLink: fileInfo.data.webViewLink || '',
    };
  } catch (error) {
    console.error('Error subiendo archivo a Google Drive:', error);
    // Relanzar el error para que sea manejado por el controlador
    throw error;
  }
}