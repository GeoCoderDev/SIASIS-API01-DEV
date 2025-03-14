import { Request, Response, NextFunction } from "express";
import {
  AuthErrorResponse,
  AuthErrorTypes,
} from "../interfaces/shared/errors/AuthErrorTypes";

// Middleware final que verifica si alguno de los middlewares anteriores
// ha autenticado correctamente al usuario
const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated) {
    return next();
  }

  // Si no está autenticado, verificar si hay un error específico
  if (req.authError) {
    const errorResponse: AuthErrorResponse = {
      success: false,
      message: req.authError.message,
      errorType: req.authError.type,
    };

    // Agregar detalles si existen
    if (req.authError.details) {
      errorResponse.details = req.authError.details;
    }

    // Determinar el código de estado HTTP según el tipo de error
    let statusCode = 401; // Unauthorized por defecto

    switch (req.authError.type) {
      case AuthErrorTypes.TOKEN_EXPIRED:
      case AuthErrorTypes.TOKEN_INVALID_SIGNATURE:
      case AuthErrorTypes.TOKEN_MALFORMED:
      case AuthErrorTypes.TOKEN_MISSING:
      case AuthErrorTypes.TOKEN_INVALID_FORMAT:
        statusCode = 401; // Unauthorized
        break;

      case AuthErrorTypes.ROLE_BLOCKED:
      case AuthErrorTypes.USER_INACTIVE:
      case AuthErrorTypes.TOKEN_WRONG_ROLE:
      case AuthErrorTypes.INSUFFICIENT_PERMISSIONS:
        statusCode = 403; // Forbidden
        break;

      case AuthErrorTypes.DATABASE_ERROR:
      case AuthErrorTypes.UNKNOWN_ERROR:
        statusCode = 500; // Internal Server Error
        break;
    }

    return res.status(statusCode).json(errorResponse);
  }

  // Si no hay un error específico, usar un mensaje genérico
  return res.status(403).json({
    success: false,
    message:
      "Acceso denegado. No tiene los permisos necesarios para acceder a este recurso.",
    errorType: AuthErrorTypes.INSUFFICIENT_PERMISSIONS,
  });
};

export default checkAuthentication;
