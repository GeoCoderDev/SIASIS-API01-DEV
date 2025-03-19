// routes/index.ts
import { Router } from "express";
import loginRouter from "./api/login";

import misDatosRouter from "./api/mis-datos";
import { UserAuthenticatedAPI01 } from "../interfaces/JWTPayload";
import AllErrorTypes from "../interfaces/shared/apis/errors";
import { ErrorDetails } from "../interfaces/shared/apis/errors/details";
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

export default router;
