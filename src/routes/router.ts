// routes/index.ts
import { Router } from "express";
import loginRouter from "./api/login";
import directivoRouter from "./api/directivo";
import misDatosRouter from "./api/mis-datos";
import { AuthErrorTypes } from "../interfaces/shared/errors/AuthErrorTypes";
import { UserAuthenticatedAPI01 } from "../interfaces/JWTPayload";
const router = Router();

// Extender la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: UserAuthenticatedAPI01;
      isAuthenticated?: boolean;
      userRole?: string;
      authError?: {
        type: AuthErrorTypes;
        message: string;
        details?: any;
      };
    }
  }
}

router.use("/login", loginRouter);
router.use("/directivo", directivoRouter);
router.use("/mis-datos", misDatosRouter);

export default router;
