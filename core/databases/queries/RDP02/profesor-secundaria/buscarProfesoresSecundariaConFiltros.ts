import { query } from "../../../connectors/postgres";
import { RDP02 } from "../../../../../src/interfaces/shared/RDP02Instancias";
import { ProfesorSecundariaListItem } from "../../../../../src/interfaces/shared/apis/api01/profesores-secundaria/types";

export interface FiltrosBusquedaProfesorSecundaria {
  Identificador?: string;
  Nombres?: string;
  Apellidos?: string;
  SinAula: boolean;
  Grado?: number | null;
  Seccion?: string | null;
}

// Shape crudo tal cual viene de la fila SQL (no es el tipo expuesto por la función)
interface FilaProfesorSecundariaConAula {
  Id_Profesor_Secundaria: string;
  Nombres: string;
  Apellidos: string;
  Estado: boolean;
  Celular: string;
  Google_Drive_Foto_ID: string | null;
  Id_Aula: number | null;
  Nivel: string | null;
  Grado: number | null;
  Seccion: string | null;
  Color: string | null;
}

export async function buscarProfesoresSecundariaConFiltros(
  filtros: FiltrosBusquedaProfesorSecundaria,
  instanciaEnUso?: RDP02,
): Promise<ProfesorSecundariaListItem[]> {
  const condiciones: string[] = [];
  const valores: any[] = [];
  let contador = 1;

  if (filtros.Identificador) {
    condiciones.push(`ps."Id_Profesor_Secundaria" ILIKE $${contador}`);
    valores.push(`%${filtros.Identificador}%`);
    contador++;
  }

  if (filtros.Nombres) {
    condiciones.push(`ps."Nombres" ILIKE $${contador}`);
    valores.push(`%${filtros.Nombres}%`);
    contador++;
  }

  if (filtros.Apellidos) {
    condiciones.push(`ps."Apellidos" ILIKE $${contador}`);
    valores.push(`%${filtros.Apellidos}%`);
    contador++;
  }

  const condicionesAula: string[] = [`a."Id_Aula" IS NOT NULL`];

  if (filtros.Grado !== undefined && filtros.Grado !== null) {
    condicionesAula.push(`a."Grado" = $${contador}`);
    valores.push(filtros.Grado);
    contador++;
  }

  if (filtros.Seccion !== undefined && filtros.Seccion !== null) {
    condicionesAula.push(`a."Seccion" = $${contador}`);
    valores.push(filtros.Seccion);
    contador++;
  }

  const bloqueConAula = `(${condicionesAula.join(" AND ")})`;

  const condicionAulaFinal = filtros.SinAula
    ? `(a."Id_Aula" IS NULL OR ${bloqueConAula})`
    : bloqueConAula;

  condiciones.push(condicionAulaFinal);

  const whereClause =
    condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

  const sql = `
    SELECT 
      ps."Id_Profesor_Secundaria",
      ps."Nombres",
      ps."Apellidos",
      ps."Estado",
      ps."Celular",
      ps."Google_Drive_Foto_ID",
      a."Id_Aula",
      a."Nivel",
      a."Grado",
      a."Seccion",
      a."Color"
    FROM "T_Profesores_Secundaria" ps
    LEFT JOIN "T_Aulas" a ON a."Id_Profesor_Secundaria" = ps."Id_Profesor_Secundaria"
    ${whereClause}
    ORDER BY ps."Apellidos", ps."Nombres"
  `;

  const result = await query<FilaProfesorSecundariaConAula>(
    instanciaEnUso,
    sql,
    valores,
  );

  const profesores: ProfesorSecundariaListItem[] = result.rows.map((fila) => ({
    Id_Profesor_Secundaria: fila.Id_Profesor_Secundaria,
    Nombres: fila.Nombres,
    Apellidos: fila.Apellidos,
    Estado: fila.Estado,
    Celular: fila.Celular,
    Google_Drive_Foto_ID: fila.Google_Drive_Foto_ID,
    Aula: fila.Id_Aula
      ? {
          Id_Aula: fila.Id_Aula,
          Nivel: fila.Nivel!,
          Grado: fila.Grado!,
          Seccion: fila.Seccion!,
          Color: fila.Color!,
        }
      : null,
  }));

  return profesores;
}
