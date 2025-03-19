// routes/index.ts
import { Router } from "express";
import loginRouter from "./api/login";
<<<<<<< HEAD

=======
import directivoRouter from "./api/directivo";
>>>>>>> e45d1bcaed99d651f98de1b356752afde81b9965
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
<<<<<<< HEAD
=======
router.use("/directivo", directivoRouter);
>>>>>>> e45d1bcaed99d651f98de1b356752afde81b9965
router.use("/mis-datos", misDatosRouter);

export default router;
