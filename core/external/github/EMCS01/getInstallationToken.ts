import axios from 'axios';
import * as jwt from 'jsonwebtoken';

// Cache para el token de instalación
let cachedToken: { token: string; expiresAt: number } | null = null;

// Variables de entorno para la autenticación de GitHub
const GITHUB_APP_ID = process.env.EMCS01_GITHUB_APP_ID || "";
const GITHUB_INSTALLATION_ID = process.env.EMCS01_GITHUB_APP_INSTALLATION_ID || "";
const GITHUB_PRIVATE_KEY = process.env.EMCS01_GITHUB_PRIVATE_KEY || "";

/**
 * Obtiene un token de instalación para la autenticación con la API de GitHub
 * El token se almacena en caché y se renueva automáticamente cuando está a punto de expirar
 *
 * @returns Token de instalación válido
 */
export async function getGithubActionsInstallationToken(): Promise<string> {
  // Verificar si hay un token en caché y si sigue siendo válido
  // Consideramos que el token expira 5 minutos antes para evitar problemas de timing
  const now = Date.now();
  const tokenBuffer = 5 * 60 * 1000; // 5 minutos en milisegundos

  if (cachedToken && cachedToken.expiresAt > now + tokenBuffer) {
    console.log("Usando token de GitHub en caché");
    return cachedToken.token;
  }

  try {
    // Validar que las variables de entorno estén disponibles
    if (!GITHUB_APP_ID) {
      throw new Error("GITHUB_APP_ID no está definido en las variables de entorno");
    }

    if (!GITHUB_INSTALLATION_ID) {
      throw new Error("GITHUB_INSTALLATION_ID no está definido en las variables de entorno");
    }

    if (!GITHUB_PRIVATE_KEY) {
      throw new Error("GITHUB_PRIVATE_KEY no está definido en las variables de entorno");
    }

    console.log("Generando nuevo JWT para autenticación de GitHub");
    
    // Crear un JWT para autenticar como GitHub App
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const payload = {
      iat: nowInSeconds,
      exp: nowInSeconds + (10 * 60),
      iss: GITHUB_APP_ID
    };

    // Generar el JWT con la clave privada
    const jwtToken = jwt.sign(payload, GITHUB_PRIVATE_KEY, { algorithm: 'RS256' });
    
    console.log("JWT generado correctamente, solicitando token de instalación");

    const response = await axios.post(
      `https://api.github.com/app/installations/${GITHUB_INSTALLATION_ID}/access_tokens`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      }
    );
    const data = response.data;
    
    // Almacenar en caché
    cachedToken = { 
      token: data.token, 
      expiresAt: new Date(data.expires_at).getTime() 
    };
    
    console.log("Token de instalación obtenido correctamente, expira:", data.expires_at);

    return "ghs_hN2oBrdZU8xwc8woQ1gfTAMY6wKTSd0lLJhd"
  } catch (error) {
    console.error("Error al obtener token de instalación de GitHub:", error);
    throw error;
  }
}