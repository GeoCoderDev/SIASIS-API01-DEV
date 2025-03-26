// routes/index.ts
import { Router } from "express";

import { UserAuthenticatedAPI01 } from "../interfaces/JWTPayload";
import AllErrorTypes from "../interfaces/shared/apis/errors";
import { ErrorDetails } from "../interfaces/shared/apis/errors/details";
import isDirectivoAuthenticated from "../middlewares/isDirectivoAuthenticated";
import checkAuthentication from "../middlewares/checkAuthentication";

import loginRouter from "./api/login";
import misDatosRouter from "./api/mis-datos";
import auxiliaresRouter from "./api/auxiliares";
import personalAdministrativoRouter from "./api/personal-administrativo";

const router = Router();

// Extender la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: UserAuthenticatedAPI01;
      isAuthenticated?: boolean;
      userRole?: string;
      authError?: {
        type: AllErrorTypes;
        message: string;
        details?: ErrorDetails;
      };
    }
  }
}

router.use("/login", loginRouter);
router.use("/mis-datos", misDatosRouter);
router.use(
  "/auxiliares",
  isDirectivoAuthenticated as any,
  checkAuthentication as any,
  auxiliaresRouter
);

router.use("/login", loginRouter);
router.use("/mis-datos", misDatosRouter);
router.use(
  "/personal-administrativo",
  isDirectivoAuthenticated as any,
  checkAuthentication as any,
  personalAdministrativoRouter
);

export default router;
