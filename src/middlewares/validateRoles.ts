import { NextFunction, Request, Response } from "express";
import { RolesSistema } from "../interfaces/shared/RolesSistema";

/**
 * Genera un middleware que valida si el usuario tiene al menos uno de los roles especificados
 * @param {Set<RolesSistema>} rolesRequeridos - Conjunto de roles permitidos para acceder al endpoint
 * @returns {Function} Middleware de Express para validación de roles
 */
const verificarRoles = (rolesRequeridos: Set<RolesSistema>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Asumiendo que el middleware de autenticación ya ha establecido req.usuario
      if (!req.user || !req.user) {
        return res.status(401).json({
          error: "No autorizado",
          mensaje: "Usuario no autenticado o sin información de roles",
        });
      }

      // Verificar si el usuario tiene al menos uno de los roles requeridos
      const tieneRolPermitido = req.user.roles.some((rol) =>
        rolesRequeridos.has(rol)
      );

      // Verificar si hay un bloqueo activo para alguno de los roles del usuario
      const rolesUsuario = new Set(req.usuario.roles);
      const bloqueoActivo = await verificarBloqueoRoles(rolesUsuario);

      if (bloqueoActivo) {
        return res.status(403).json({
          error: "Acceso bloqueado",
          mensaje: "Tu rol se encuentra temporalmente bloqueado en el sistema",
        });
      }

      if (tieneRolPermitido) {
        return next(); // Continuar con la ejecución normal
      }

      // Si llega aquí, el usuario no tiene ninguno de los roles requeridos
      return res.status(403).json({
        error: "Acceso denegado",
        mensaje:
          "No tienes los permisos necesarios para acceder a este recurso",
      });
    } catch (error) {
      console.error("Error en middleware de verificación de roles:", error);
      return res.status(500).json({
        error: "Error interno",
        mensaje: "Error al verificar permisos de usuario",
      });
    }
  };
};

const verificarBloqueoRoles = async (rolesUsuario: Set<RolesSistema>) => {
  const tiempoActual = Math.floor(Date.now() / 1000);

  // Convertir el Set a un array para la consulta
  const rolesArray = Array.from(rolesUsuario);

  const bloqueo = await prisma.t_Bloqueo_Roles.findFirst({
    where: {
      Rol: { in: rolesArray },
      OR: [
        {
          Timestamp_Desbloqueo: {
            gt: tiempoActual, // Bloqueos con tiempo futuro de desbloqueo
          },
        },
        {
          Bloqueo_total: true, // Bloqueos permanentes
        },
      ],
    },
  });

  return !!bloqueo; // Retorna true si se encontró un bloqueo, false en caso contrario
};

// Ejemplo de uso:
// const rolesAdmin = new Set([RolesSistema.Administrador, RolesSistema.SuperAdmin]);
// app.get('/api/admin/usuarios', verificarRoles(rolesAdmin), controladorUsuarios.listar);
