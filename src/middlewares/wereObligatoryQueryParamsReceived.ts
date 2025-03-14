import { NextFunction, Request, Response } from "express";

/**
 * Verifica si se recibieron todos los parámetros de consulta obligatorios
 * @param requiredParams Array con los nombres de los parámetros obligatorios
 * @returns Middleware para Express
 */
const wereObligatoryQueryParamsReceived = (requiredParams: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingParams: string[] = [];
    
    // Verificar cada parámetro obligatorio
    for (const paramName of requiredParams) {
      if (req.query[paramName] === undefined || req.query[paramName] === '') {
        missingParams.push(paramName);
      }
    }
    
    // Si hay parámetros obligatorios faltantes, devolver error
    if (missingParams.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan parámetros obligatorios: ${missingParams.join(', ')}`,
        missingParams
      });
    }
    
    // Si todos los parámetros obligatorios están presentes, continuar
    next();
  };
};

export default wereObligatoryQueryParamsReceived;