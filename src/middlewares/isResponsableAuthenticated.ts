import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RolesSistema } from "../interfaces/shared/RolesSistema";
import { PrismaClient } from "@prisma/client";
import { AuthErrorTypes } from "../interfaces/shared/errors/AuthErrorTypes";
import { verificarBloqueoRol } from "../lib/helpers/verificators/verificarBloqueoRol";
import { JWTPayload, ResponsableAuthenticated } from "../interfaces/JWTPayload";

const prisma = new PrismaClient();

// Middleware para verificar si el usuario es un Responsable (Padre/Apoderado)
const isResponsableAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Si ya está autenticado con algún rol, continuar
    if (req.isAuthenticated) {
      return next();
    }

    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // Almacenar el error en req para que checkAuthentication pueda usarlo
      req.authError = {
        type: AuthErrorTypes.TOKEN_MISSING,
        message: "No se ha proporcionado un token de autenticación",
      };
      return next();
    }

    // Verificar el formato "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      req.authError = {
        type: AuthErrorTypes.TOKEN_INVALID_FORMAT,
        message: "Formato de token no válido",
      };
      return next();
    }

    const token = parts[1];
    const jwtSecretKey = process.env.JWT_KEY_RESPONSABLES!;

    try {
      // Verificar el token
      const decodedPayload = jwt.verify(token, jwtSecretKey) as JWTPayload;

      // Verificar que el rol sea de Responsable
      if (decodedPayload.Rol !== RolesSistema.Responsable) {
        req.authError = {
          type: AuthErrorTypes.TOKEN_WRONG_ROLE,
          message: "El token no corresponde a un usuario responsable",
        };
        return next();
      }

      // Verificar si el rol está bloqueado
      try {
        // Verificar si el rol está bloqueado
        const bloqueado = await verificarBloqueoRol(
          req,
          RolesSistema.Responsable,
          next
        );

        if (bloqueado) {
          return; // La función verificarBloqueoRol ya llamó a next()
        }

        // Verificar si el responsable existe
        const responsable = await prisma.t_Responsables.findUnique({
          where: {
            DNI_Responsable: decodedPayload.ID_Usuario,
          },
        });

        if (!responsable) {
          req.authError = {
            type: AuthErrorTypes.USER_INACTIVE,
            message: "La cuenta de responsable no existe",
          };
          return next();
        }

        // Verificar si tiene al menos un estudiante relacionado activo
        const relacionesActivas = await prisma.t_Relaciones_E_R.findFirst({
          where: {
            DNI_Responsable: decodedPayload.ID_Usuario,
            estudiante: {
              Estado: true,
            },
          },
        });

        if (!relacionesActivas) {
          req.authError = {
            type: AuthErrorTypes.USER_INACTIVE,
            message: "No tiene estudiantes activos asociados a su cuenta",
          };
          return next();
        }
      } catch (dbError) {
        req.authError = {
          type: AuthErrorTypes.DATABASE_ERROR,
          message: "Error al verificar el estado del usuario o rol",
          details: dbError,
        };
        return next();
      }

      // Agregar información del usuario decodificada a la solicitud para uso posterior
      req.user = {
        DNI_Responsable: decodedPayload.ID_Usuario,
        Nombre_Usuario: decodedPayload.Nombre_Usuario,
      } as ResponsableAuthenticated;
      // Marcar como autenticado para que los siguientes middlewares no reprocesen
      req.isAuthenticated = true;
      req.userRole = RolesSistema.Responsable;

      // Si todo está bien, continuar
      next();
    } catch (jwtError: any) {
      // Capturar errores específicos de JWT
      if (jwtError.name === "TokenExpiredError") {
        req.authError = {
          type: AuthErrorTypes.TOKEN_EXPIRED,
          message: "El token ha expirado",
          details: {
            expiredAt: jwtError.expiredAt,
          },
        };
      } else if (jwtError.name === "JsonWebTokenError") {
        if (jwtError.message === "invalid signature") {
          req.authError = {
            type: AuthErrorTypes.TOKEN_INVALID_SIGNATURE,
            message: "La firma del token es inválida RESPONSABLE",
          };
        } else {
          req.authError = {
            type: AuthErrorTypes.TOKEN_MALFORMED,
            message: "El token tiene un formato incorrecto",
            details: jwtError.message,
          };
        }
      } else {
        req.authError = {
          type: AuthErrorTypes.UNKNOWN_ERROR,
          message: "Error desconocido al verificar el token",
          details: jwtError,
        };
      }
      // Continuar al siguiente middleware
      next();
    }
  } catch (error) {
    console.error("Error en middleware de responsable:", error);
    req.authError = {
      type: AuthErrorTypes.UNKNOWN_ERROR,
      message: "Error desconocido en el proceso de autenticación",
      details: error,
    };
    next();
  }
};

export default isResponsableAuthenticated;
