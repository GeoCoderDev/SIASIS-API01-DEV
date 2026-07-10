import { Request, Response, Router } from "express";
import { ErrorResponseAPIBase } from "../../../interfaces/shared/apis/types";
import {
  RequestErrorTypes,
  SystemErrorTypes,
  UserErrorTypes,
  ValidationErrorTypes,
} from "../../../interfaces/shared/errors";
import { validateIdentificadorDeUsuario } from "../../../lib/helpers/validators/data/validateIdentificadorDeUsuario";
import { handleSQLError } from "../../../lib/helpers/handlers/errors/postgreSQL";
import {
  GetProfesorSecundariaSuccessResponse,
  GetProfesoresSecundariaSuccessResponse,
} from "../../../interfaces/shared/apis/api01/profesores-secundaria/types";
import { buscarProfesoresSecundariaConFiltros } from "../../../../core/databases/queries/RDP02/profesor-secundaria/buscarProfesoresSecundariaConFiltros";
import { obtenerDetallesDeProfesorSecundariaPorId } from "../../../../core/databases/queries/RDP02/profesor-secundaria/obtenerDetallesDeProfesorSecundariaPorId";

const router = Router();

// Listar / buscar profesores de secundaria con filtros
router.get("/", (async (req: Request, res: Response) => {
  try {
    const rdp02EnUso = req.RDP02_INSTANCE!;
    const { Identificador, Nombres, Apellidos, SinAula, Aula } = req.query;

    const sinAulaBool =
      typeof SinAula === "string" ? SinAula.toLowerCase() === "true" : false;

    let grado: number | null = null;
    let seccion: string | null = null;

    // ✅ Ya NO depende de sinAulaBool
    if (typeof Aula === "string" && Aula.length > 0) {
      const partes = Aula.split(",");

      if (partes.length !== 2) {
        return res.status(400).json({
          success: false,
          message:
            "El parámetro 'Aula' debe tener el formato 'Grado,Seccion' (ej: T,T | 1,T | 3,B)",
          errorType: RequestErrorTypes.INVALID_PARAMETERS,
        } as ErrorResponseAPIBase);
      }

      const [gradoRaw, seccionRaw] = partes;

      if (gradoRaw !== "T") {
        const gradoNum = parseInt(gradoRaw, 10);
        if (isNaN(gradoNum)) {
          return res.status(400).json({
            success: false,
            message: "El grado indicado en el parámetro 'Aula' es inválido",
            errorType: RequestErrorTypes.INVALID_PARAMETERS,
          } as ErrorResponseAPIBase);
        }
        grado = gradoNum;
      }

      if (seccionRaw !== "T") {
        seccion = seccionRaw;
      }
    }

    const profesores = await buscarProfesoresSecundariaConFiltros(
      {
        Identificador:
          typeof Identificador === "string" && Identificador.length > 0
            ? Identificador
            : undefined,
        Nombres:
          typeof Nombres === "string" && Nombres.length > 0
            ? Nombres
            : undefined,
        Apellidos:
          typeof Apellidos === "string" && Apellidos.length > 0
            ? Apellidos
            : undefined,
        SinAula: sinAulaBool,
        Grado: grado,
        Seccion: seccion,
      },
      rdp02EnUso,
    );

    return res.status(200).json({
      success: true,
      message: "Profesores de secundaria obtenidos exitosamente",
      data: profesores,
    } as GetProfesoresSecundariaSuccessResponse);
  } catch (error) {
    console.error("Error al obtener profesores de secundaria:", error);

    const handledError = handleSQLError(error);
    if (handledError) {
      return res.status(handledError.status).json(handledError.response);
    }

    return res.status(500).json({
      success: false,
      message: "Error al obtener profesores de secundaria",
      errorType: SystemErrorTypes.UNKNOWN_ERROR,
      details: error,
    } as ErrorResponseAPIBase);
  }
}) as any);

// Detalle de un profesor de secundaria
router.get("/:idProfesorSecundaria", (async (req: Request, res: Response) => {
  try {
    const { idProfesorSecundaria } = req.params;
    const rdp02EnUso = req.RDP02_INSTANCE!;

    const idValidation = validateIdentificadorDeUsuario(
      idProfesorSecundaria,
      true,
    );
    if (!idValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: idValidation.errorMessage,
        errorType: ValidationErrorTypes.INVALID_USER_IDENTIFIER,
      } as ErrorResponseAPIBase);
    }

    const profesor = await obtenerDetallesDeProfesorSecundariaPorId(
      idProfesorSecundaria,
      rdp02EnUso,
    );

    if (!profesor) {
      return res.status(404).json({
        success: false,
        message: "Profesor de secundaria no encontrado",
        errorType: UserErrorTypes.USER_NOT_FOUND,
      } as ErrorResponseAPIBase);
    }

    return res.status(200).json({
      success: true,
      message: "Profesor de secundaria obtenido exitosamente",
      data: profesor,
    } as GetProfesorSecundariaSuccessResponse);
  } catch (error) {
    console.error("Error al obtener profesor de secundaria:", error);

    const handledError = handleSQLError(error);
    if (handledError) {
      return res.status(handledError.status).json(handledError.response);
    }

    return res.status(500).json({
      success: false,
      message: "Error al obtener profesor de secundaria",
      errorType: SystemErrorTypes.UNKNOWN_ERROR,
      details: error,
    } as ErrorResponseAPIBase);
  }
}) as any);

export default router;
