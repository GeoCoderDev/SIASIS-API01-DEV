// Enum para errores de autenticación
export enum AuthErrorTypes {
  //Errores de params de solicitudes http
  INVALID_PARAMETERS = "INVALID_PARAMETERS",

  // Errores de token
  TOKEN_MISSING = "TOKEN_MISSING", // No se proporcionó token
  TOKEN_INVALID_FORMAT = "TOKEN_INVALID_FORMAT", // Formato Bearer inválido
  TOKEN_EXPIRED = "TOKEN_EXPIRED", // Token expirado
  TOKEN_MALFORMED = "TOKEN_MALFORMED", // Token mal formado (no decodificable)
  TOKEN_INVALID_SIGNATURE = "TOKEN_INVALID_SIGNATURE", // Firma inválida
  TOKEN_WRONG_ROLE = "TOKEN_WRONG_ROLE", // Token tiene rol equivocado

  //Errores de datos de usaurio
  USER_NOT_FOUND = "USER_NOT_FOUND",

  // Errores de bloqueo
  ROLE_BLOCKED = "ROLE_BLOCKED", // El rol está temporalmente bloqueado
  USER_INACTIVE = "USER_INACTIVE", // El usuario está inactivo

  // Errores del sistema
  DATABASE_ERROR = "DATABASE_ERROR", // Error al conectar con la base de datos
  UNKNOWN_ERROR = "UNKNOWN_ERROR", // Error desconocido

  // Errores de permisos
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS", // Sin permisos suficientes
}

// Interfaz para la respuesta de error
export interface AuthErrorResponse {
  success: boolean;
  message: string;
  errorType: AuthErrorTypes;
  details?: any;
}
