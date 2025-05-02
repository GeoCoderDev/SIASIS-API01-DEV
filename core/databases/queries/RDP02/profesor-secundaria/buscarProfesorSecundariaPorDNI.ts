import { T_Profesores_Secundaria } from "@prisma/client";
import { RDP02 } from "../../../../../src/interfaces/shared/RDP02Instancias";
import { query } from "../../../connectors/postgres";
import { RolesSistema } from "../../../../../src/interfaces/shared/RolesSistema";

/**
 * Busca un profesor de secundaria por su DNI
 * @param dniProfesor DNI del profesor de secundaria
 * @param instanciaEnUso Instancia específica donde ejecutar la consulta (opcional)
 * @returns Datos del profesor o null si no existe
 */
export async function buscarProfesorSecundariaPorDNI(
  dniProfesor: string,
  instanciaEnUso?: RDP02
): Promise<T_Profesores_Secundaria | null> {
  const sql = `
    SELECT *
    FROM "T_Profesores_Secundaria"
    WHERE "DNI_Profesor_Secundaria" = $1
  `;

  // Operación de lectura
  const result = await query<T_Profesores_Secundaria>(
    instanciaEnUso,
    sql,
    [dniProfesor],
    RolesSistema.ProfesorSecundaria
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  return null;
}

/**
 * Busca un profesor de secundaria por su DNI y selecciona campos específicos
 * @param dniProfesor DNI del profesor de secundaria
 * @param campos Campos específicos a seleccionar (keyof T_Profesores_Secundaria)
 * @param instanciaEnUso Instancia específica donde ejecutar la consulta (opcional)
 * @returns Datos parciales del profesor o null si no existe
 */
export async function buscarProfesorSecundariaPorDNISelect<
  K extends keyof T_Profesores_Secundaria
>(
  dniProfesor: string,
  campos: K[],
  instanciaEnUso?: RDP02
): Promise<Pick<T_Profesores_Secundaria, K> | null> {
  // Construir la consulta SQL con los campos especificados
  const camposStr = campos.map((campo) => `"${String(campo)}"`).join(", ");

  const sql = `
    SELECT ${camposStr}
    FROM "T_Profesores_Secundaria"
    WHERE "DNI_Profesor_Secundaria" = $1
  `;

  // Operación de lectura
  const result = await query<Pick<T_Profesores_Secundaria, K>>(
    instanciaEnUso,
    sql,
    [dniProfesor],
    RolesSistema.ProfesorSecundaria
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  return null;
}

/**
 * Verifica si un profesor tiene aulas asignadas (para determinar si es tutor)
 * @param dniProfesor DNI del profesor de secundaria
 * @param instanciaEnUso Instancia específica donde ejecutar la consulta (opcional)
 * @returns Información de aulas asignadas o null si no existe
 */
export async function buscarAulasAsignadasProfesorSecundaria(
  dniProfesor: string,
  instanciaEnUso?: RDP02
): Promise<{ Estado: boolean; aulas: { Id_Aula: number }[] } | null> {
  const sql = `
    SELECT 
      p."Estado",
      COALESCE(
        (
          SELECT json_agg(json_build_object('Id_Aula', a."Id_Aula"))
          FROM "T_Aulas" a
          WHERE a."DNI_Profesor_Secundaria" = p."DNI_Profesor_Secundaria"
        ),
        '[]'
      ) as aulas
    FROM "T_Profesores_Secundaria" p
    WHERE p."DNI_Profesor_Secundaria" = $1
  `;

  // Operación de lectura
  const result = await query<{ Estado: boolean; aulas: { Id_Aula: number }[] }>(
    instanciaEnUso,
    sql,
    [dniProfesor],
    RolesSistema.Tutor
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  return null;
}
