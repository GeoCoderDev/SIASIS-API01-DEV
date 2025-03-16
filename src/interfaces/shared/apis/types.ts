import AllErrorTypes from "./errors";

/**
 * Base para todas las respuestas de la API
 */
export interface ApiResponseBase {
  message: string;
}

export interface SuccessResponseAPIBase {
  success: true;
  message: string;
  data: any;
}

export interface ErrorResponseAPIBase {
  message: string;
  success: false;
  details?: any;
  errorType: AllErrorTypes;
}
