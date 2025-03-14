import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RolesSistema } from "../interfaces/shared/RolesSistema";
import { PrismaClient } from "@prisma/client";
import { AuthErrorTypes } from "../interfaces/shared/errors/AuthErrorTypes";
import { verificarBloqueoRol } from "../lib/helpers/verificators/verificarBloqueoRol";
import {
  JWTPayload,
  PersonalAdministrativoAuthenticated,
} from "../interfaces/JWTPayload";

const prisma = new PrismaClient();

// Middleware para verificar si el usuario es Personal Administrativo
const isPersonalAdministrativoAuthenticated = async (
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
    const jwtSecretKey = process.env.JWT_KEY_PERSONAL_ADMINISTRATIVO!;

    try {
      // Verificar el token
      const decodedPayload = jwt.verify(token, jwtSecretKey) as JWTPayload;

      // Verificar que el rol sea de Personal Administrativo
      if (decodedPayload.Rol !== RolesSistema.PersonalAdministrativo) {
        req.authError = {
          type: AuthErrorTypes.TOKEN_WRONG_ROLE,
          message:
            "El token no corresponde a un usuario de personal administrativo",
        };
        return next();
      }

      // Verificar si el rol está bloqueado
      try {
        // Verificar si el rol está bloqueado
        const bloqueado = await verificarBloqueoRol(
          req,
          RolesSistema.PersonalAdministrativo,
          next
        );

        if (bloqueado) {
          return; // La función verificarBloqueoRol ya llamó a next()
        }

        // Verificar si el personal administrativo existe y está activo
        const personal = await prisma.t_Personal_Administrativo.findUnique({
          where: {
            DNI_Personal_Administrativo: decodedPayload.ID_Usuario,
          },
          select: {
            Estado: true,
          },
        });

        if (!personal || !personal.Estado) {
          req.authError = {
            type: AuthErrorTypes.USER_INACTIVE,
            message:
              "La cuenta de personal administrativo está inactiva o no existe",
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
        DNI_Personal_Administrativo: decodedPayload.ID_Usuario,
        Nombre_Usuario: decodedPayload.Nombre_Usuario,
      } as PersonalAdministrativoAuthenticated;
      // Marcar como autenticado para que los siguientes middlewares no reprocesen
      req.isAuthenticated = true;
      req.userRole = RolesSistema.PersonalAdministrativo;

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
            message: "La firma del token es inválida P. ADMINISTRATIVO",
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
    console.error("Error en middleware de personal administrativo:", error);
    req.authError = {
      type: AuthErrorTypes.UNKNOWN_ERROR,
      message: "Error desconocido en el proceso de autenticación",
      details: error,
    };
    next();
  }
};

export default isPersonalAdministrativoAuthenticated;
