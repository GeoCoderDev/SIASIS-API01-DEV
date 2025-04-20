import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { NivelEducativo } from "../../../../interfaces/shared/NivelEducativo";
import { ModoRegistro } from "../../../../interfaces/shared/ModoRegistroPersonal";
import { EstadosAsistencia } from "../../../../interfaces/shared/EstadosAsistenciaEstudiantes";
import { ActoresSistema } from "../../../../interfaces/shared/ActoresSistema";
import express from "express";
import {
  RegistrarAsistenciaIndividualRequestBody,
  RegistrarAsistenciaIndividualSuccessResponse,
} from "../../../../interfaces/shared/apis/api01/asistencia/types";
import { validateDNI } from "../../../../lib/helpers/validators/data/validateDNI";
import {
  RequestErrorTypes,
  SystemErrorTypes,
} from "../../../../interfaces/shared/apis/errors";
import { redisClient } from "../../../../../config/Redis/RedisClient";
import { handlePrismaError } from "../../../../lib/helpers/handlers/errors/prisma";
import { ErrorResponseAPIBase } from "../../../../interfaces/shared/apis/types";
import { RolesSistema } from "../../../../interfaces/shared/RolesSistema";

const prisma = new PrismaClient();

const router = express();

// Función para obtener la fecha actual en Perú (UTC-5)
const obtenerFechaActualPeru = (): string => {
  const fecha = new Date();
  fecha.setHours(fecha.getHours() - 5); // Ajustar a hora de Perú (UTC-5)
  return fecha.toISOString().split("T")[0]; // Formato YYYY-MM-DD
};

// Función para obtener el mes actual en Perú (1-12)
const obtenerMesActualPeru = (): number => {
  const fecha = new Date();
  fecha.setHours(fecha.getHours() - 5); // Ajustar a hora de Perú (UTC-5)
  return fecha.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1 para obtener 1-12
};

// Función para obtener el día actual del mes en Perú (1-31)
const obtenerDiaActualPeru = (): number => {
  const fecha = new Date();
  fecha.setHours(fecha.getHours() - 5); // Ajustar a hora de Perú (UTC-5)
  return fecha.getDate();
};

// Constantes de configuración
const MINUTOS_TOLERANCIA = 5; // 5 minutos de tolerancia para considerar llegada temprana
const ASUMIR_REDIS_SI_EN_BD = true; // Si está en BD, asumir que también está en Redis

// Función para registrar asistencia de estudiantes
const registrarAsistenciaEstudiante = async (
  dni: string,
  nivel: NivelEducativo,
  aula: string,
  timestampActual: number,
  fechaHoraEsperada: Date,
  idRegistroMensual?: number
): Promise<{ registroId: number; esNuevoRegistro: boolean }> => {
  // Calcular desfase en segundos
  const desfaseSegundos = Math.floor(
    (timestampActual - fechaHoraEsperada.getTime()) / 1000
  );

  // Determinar el estado de asistencia basado en el desfase con tolerancia
  let estado = EstadosAsistencia.Temprano;
  if (desfaseSegundos > MINUTOS_TOLERANCIA * 60) {
    estado = EstadosAsistencia.Tarde;
  }

  const mes = obtenerMesActualPeru();
  const dia = obtenerDiaActualPeru();

  // Extraer el grado del aula (primer carácter numérico)
  const grado = parseInt(aula.match(/\d/)![0]);

  // Determinar la tabla donde se registrará la asistencia
  let tabla;
  if (nivel === NivelEducativo.PRIMARIA) {
    tabla = `t_A_E_P_${grado}`;
  } else {
    tabla = `t_A_E_S_${grado}`;
  }

  let registroExistente = null;

  // Si tenemos el ID del registro, lo buscamos directamente por ID (más rápido)
  if (idRegistroMensual !== undefined) {
    registroExistente = await (prisma as any)[tabla].findUnique({
      where: {
        Id_Asistencia_Escolar_Mensual: idRegistroMensual,
      },
    });

    // Verificar que el registro encontrado coincide con el DNI proporcionado
    if (registroExistente && registroExistente.DNI_Estudiante !== dni) {
      registroExistente = null; // El ID no corresponde al DNI, invalidamos
    }
  }

  // Si no tenemos el ID o no se encontró, buscamos por DNI y mes
  if (!registroExistente) {
    registroExistente = await (prisma as any)[tabla].findFirst({
      where: {
        DNI_Estudiante: dni,
        Mes: mes,
      },
    });
  }

  if (registroExistente) {
    // Si ya existe un registro, verificar si ya se registró asistencia para el día actual
    let estadosActuales = registroExistente.Estados;

    // Si ya tiene registro para el día actual
    if (estadosActuales.length >= dia) {
      return {
        registroId: registroExistente.Id_Asistencia_Escolar_Mensual,
        esNuevoRegistro: false,
      };
    }

    // Completar con faltas hasta el día anterior
    while (estadosActuales.length < dia - 1) {
      estadosActuales += EstadosAsistencia.Falta;
    }

    // Agregar el estado actual
    estadosActuales += estado;

    // Actualizar en la base de datos
    const registroActualizado = await (prisma as any)[tabla].update({
      where: {
        Id_Asistencia_Escolar_Mensual:
          registroExistente.Id_Asistencia_Escolar_Mensual,
      },
      data: {
        Estados: estadosActuales,
      },
    });

    return {
      registroId: registroActualizado.Id_Asistencia_Escolar_Mensual,
      esNuevoRegistro: true,
    };
  } else {
    // Si no existe, crear un nuevo registro
    let estados = "";

    // Llenar con faltas hasta el día anterior
    for (let i = 1; i < dia; i++) {
      estados += EstadosAsistencia.Falta;
    }

    // Agregar el estado actual
    estados += estado;

    // Crear el registro en la base de datos
    const nuevoRegistro = await (prisma as any)[tabla].create({
      data: {
        DNI_Estudiante: dni,
        Mes: mes,
        Estados: estados,
      },
    });

    return {
      registroId: nuevoRegistro.Id_Asistencia_Escolar_Mensual,
      esNuevoRegistro: true,
    };
  }
};

// Función para registrar asistencia de personal
const registrarAsistenciaPersonal = async (
  dni: string,
  actor: ActoresSistema | RolesSistema,
  modoRegistro: ModoRegistro,
  timestampActual: number,
  fechaHoraEsperada: Date,
  idRegistroMensual?: number
): Promise<{ registroId: number; esNuevoRegistro: boolean }> => {
  const mes = obtenerMesActualPeru();
  const dia = obtenerDiaActualPeru();
  const desfaseSegundos = Math.floor(
    (timestampActual - fechaHoraEsperada.getTime()) / 1000
  );

  // Determinar la tabla según el actor y el modo de registro
  let tabla;
  let campoId;
  let campoDNI;
  const campoJson =
    modoRegistro === ModoRegistro.Entrada ? "Entradas" : "Salidas";

  switch (actor) {
    case ActoresSistema.ProfesorPrimaria:
      tabla =
        modoRegistro === ModoRegistro.Entrada
          ? "t_Control_Entrada_Mensual_Profesores_Primaria"
          : "t_Control_Salida_Mensual_Profesores_Primaria";
      campoId = "Id_C_E_M_P_Profesores_Primaria";
      campoDNI = "DNI_Profesor_Primaria";
      break;

    case ActoresSistema.ProfesorSecundaria:
    case ActoresSistema.Tutor:
      tabla =
        modoRegistro === ModoRegistro.Entrada
          ? "t_Control_Entrada_Mensual_Profesores_Secundaria"
          : "t_Control_Salida_Mensual_Profesores_Secundaria";
      campoId = "Id_C_E_M_P_Profesores_Secundaria";
      campoDNI = "DNI_Profesor_Secundaria";
      break;

    case ActoresSistema.Auxiliar:
      tabla =
        modoRegistro === ModoRegistro.Entrada
          ? "t_Control_Entrada_Mensual_Auxiliar"
          : "t_Control_Salida_Mensual_Auxiliar";
      campoId = "Id_C_E_M_P_Auxiliar";
      campoDNI = "DNI_Auxiliar";
      break;

    case ActoresSistema.PersonalAdministrativo:
      tabla =
        modoRegistro === ModoRegistro.Entrada
          ? "t_Control_Entrada_Mensual_Personal_Administrativo"
          : "t_Control_Salida_Mensual_Personal_Administrativo";
      campoId = "Id_C_E_M_P_Administrativo";
      campoDNI = "DNI_Personal_Administrativo";
      break;

    default:
      throw new Error("Actor no soportado para registro de asistencia");
  }

  let registroExistente = null;

  // Si tenemos el ID del registro, lo buscamos directamente por ID (más rápido)
  if (idRegistroMensual !== undefined) {
    registroExistente = await (prisma as any)[tabla].findUnique({
      where: {
        [campoId]: idRegistroMensual,
      },
    });

    // Verificar que el registro encontrado coincide con el DNI proporcionado
    if (registroExistente && registroExistente[campoDNI] !== dni) {
      registroExistente = null; // El ID no corresponde al DNI, invalidamos
    }
  }

  // Si no tenemos el ID o no se encontró, buscamos por DNI y mes
  if (!registroExistente) {
    registroExistente = await (prisma as any)[tabla].findFirst({
      where: {
        [campoDNI]: dni,
        Mes: mes,
      },
    });
  }

  if (registroExistente) {
    // Si ya existe un registro, verificar si ya se registró asistencia para el día actual
    const jsonActual = registroExistente[campoJson] || {};

    // Verificar si ya existe un registro para este día
    if (jsonActual[dia.toString()]) {
      return {
        registroId: registroExistente[campoId],
        esNuevoRegistro: false,
      };
    }

    // Si no existe un registro para este día, agregarlo
    jsonActual[dia.toString()] = {
      Timestamp: timestampActual,
      DesfaseSegundos: desfaseSegundos,
    };

    // Actualizar en la base de datos
    const registroActualizado = await (prisma as any)[tabla].update({
      where: {
        [campoId]: registroExistente[campoId],
      },
      data: {
        [campoJson]: jsonActual,
      },
    });

    return {
      registroId: registroActualizado[campoId],
      esNuevoRegistro: true,
    };
  } else {
    // Si no existe, crear un nuevo registro
    const nuevoJson: any = {};
    nuevoJson[dia.toString()] = {
      Timestamp: timestampActual,
      DesfaseSegundos: desfaseSegundos,
    };

    const datosCreacion: any = {
      [campoDNI]: dni,
      Mes: mes,
    };
    datosCreacion[campoJson] = nuevoJson;

    const nuevoRegistro = await (prisma as any)[tabla].create({
      data: datosCreacion,
    });

    return {
      registroId: nuevoRegistro[campoId],
      esNuevoRegistro: true,
    };
  }
};

// Modificación del endpoint para usar el Id_Registro_Mensual
router.post("/marcar", (async (req: Request, res: Response) => {
  try {
    const {
      Actor,
      DNI,
      FechaHoraEsperadaISO,
      ModoRegistro,
      AulaDelEstudiante,
      NivelDelEstudiante,
      Id_Registro_Mensual,
    } = req.body as RegistrarAsistenciaIndividualRequestBody;

    // Validar DNI
    const dniValidation = validateDNI(DNI, true);
    if (!dniValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dniValidation.errorMessage,
        errorType: dniValidation.errorType,
      });
    }

    // Validar Actor
    if (!Object.values(ActoresSistema).includes(Actor as ActoresSistema)) {
      return res.status(400).json({
        success: false,
        message: "Actor no válido",
        errorType: RequestErrorTypes.INVALID_PARAMETERS,
      });
    }

    // Validar Modo de Registro
    if (!Object.values(ModoRegistro).includes(ModoRegistro)) {
      return res.status(400).json({
        success: false,
        message: "Modo de registro no válido",
        errorType: RequestErrorTypes.INVALID_PARAMETERS,
      });
    }

    // Obtener timestamp actual (en Perú, UTC-5)
    const fechaActualPeru = new Date();
    fechaActualPeru.setHours(fechaActualPeru.getHours() - 5);
    const timestampActual = fechaActualPeru.getTime();

    let resultado;
    const esEstudiante = Actor === ActoresSistema.Estudiante;

    if (esEstudiante) {
      // Validar que se proporcionaron nivel y aula para estudiantes
      if (!NivelDelEstudiante || !AulaDelEstudiante) {
        return res.status(400).json({
          success: false,
          message:
            "Se requiere nivel educativo y aula para registrar asistencia de estudiantes",
          errorType: RequestErrorTypes.INVALID_PARAMETERS,
        });
      }

      // Registrar asistencia de estudiante
      resultado = await registrarAsistenciaEstudiante(
        DNI,
        NivelDelEstudiante,
        AulaDelEstudiante,
        timestampActual,
        new Date(FechaHoraEsperadaISO),
        Id_Registro_Mensual
      );
    } else {
      // Registrar asistencia de personal
      resultado = await registrarAsistenciaPersonal(
        DNI,
        Actor,
        ModoRegistro,
        timestampActual,
        new Date(FechaHoraEsperadaISO),
        Id_Registro_Mensual
      );
    }

    // Calcular desfase en segundos
    const desfaseSegundos = Math.floor(
      (timestampActual - new Date(FechaHoraEsperadaISO).getTime()) / 1000
    );

    // Crear clave para Redis
    const ModoRegistroActor = `${ModoRegistro}:${Actor}`;
    const clave = `${obtenerFechaActualPeru()}:${ModoRegistroActor}:${DNI}${
      NivelDelEstudiante ? ":" + NivelDelEstudiante : ""
    }${AulaDelEstudiante ? ":" + AulaDelEstudiante : ""}`;

    // Crear valor para Redis
    const valor = [
      ModoRegistroActor,
      timestampActual.toString(),
      desfaseSegundos.toString(),
    ];

    // Guardar en Redis solo si es un nuevo registro o no asumimos que si está en BD está en Redis
    if (resultado.esNuevoRegistro || !ASUMIR_REDIS_SI_EN_BD) {
      await redisClient.set(clave, valor);
    }

    return res.status(200).json({
      success: true,
      message: resultado.esNuevoRegistro
        ? "Asistencia registrada correctamente"
        : "La asistencia ya había sido registrada anteriormente",
      data: {
        Id_Registro_Mensual: resultado.registroId,
        timestamp: timestampActual,
        desfaseSegundos,
        esNuevoRegistro: resultado.esNuevoRegistro,
      },
    } as RegistrarAsistenciaIndividualSuccessResponse);
  } catch (error) {
    console.error("Error al registrar asistencia:", error);

    // Usar handlePrismaError para manejar errores específicos de Prisma
    const handledError = handlePrismaError(error, {
      DNI_Estudiante: "DNI del estudiante",
      DNI_Profesor_Primaria: "DNI del profesor de primaria",
      DNI_Profesor_Secundaria: "DNI del profesor de secundaria",
      DNI_Auxiliar: "DNI del auxiliar",
      DNI_Personal_Administrativo: "DNI del personal administrativo",
      Mes: "mes de registro",
    });

    if (handledError) {
      return res.status(handledError.status).json(handledError.response);
    }

    // Si no fue un error de Prisma o no pudo ser manejado específicamente
    return res.status(500).json({
      success: false,
      message: "Error al registrar asistencia",
      errorType: SystemErrorTypes.UNKNOWN_ERROR,
      ErrorDetails: error instanceof Error ? error.message : String(error),
    } as ErrorResponseAPIBase);
  }
}) as any);
