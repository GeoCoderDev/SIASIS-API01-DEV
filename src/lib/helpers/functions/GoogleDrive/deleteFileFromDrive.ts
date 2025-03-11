import { google } from 'googleapis';

/**
 * Elimina un archivo de Google Drive por su ID
 * @param fileId ID del archivo en Google Drive
 * @param oauth2Client Cliente OAuth2 configurado
 * @returns true si se eliminó correctamente, false si no se encontró o hubo un error
 */
export async function deleteFileFromDrive(
  fileId: string | null | undefined,
  oauth2Client: any
): Promise<boolean> {
  // Si no hay ID, no hay nada que eliminar
  if (!fileId) {
    return false;
  }

  try {
    // Crear cliente de Google Drive
    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });

    // Verificar si el archivo existe
    try {
      await drive.files.get({
        fileId: fileId,
        fields: 'id'
      });
    } catch (error) {
      // Si el archivo no existe, retornar false sin lanzar error
      console.log(`El archivo con ID ${fileId} no existe en Google Drive`);
      return false;
    }

    // Eliminar el archivo
    await drive.files.delete({
      fileId: fileId
    });

    console.log(`Archivo con ID ${fileId} eliminado con éxito`);
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de Google Drive:', error);
    // No relanzamos el error para que el flujo pueda continuar
    return false;
  }
}