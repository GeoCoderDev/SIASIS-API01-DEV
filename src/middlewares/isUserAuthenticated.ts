import { Request, Response, NextFunction } from "express";

// Middleware para verificar si hay un token en la cabecera
export const verifyTokenPresence = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No se ha proporcionado un token de autenticación",
      });
    }

    // Verificar el formato "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Formato de token no válido",
      });
    }

    // Si hay un token presente, continuar con la petición
    next();
  } catch (error) {
    console.error("Error en middleware de verificación de token:", error);
    return res.status(500).json({
      success: false,
      message: "Error en la verificación del token",
    });
  }
};