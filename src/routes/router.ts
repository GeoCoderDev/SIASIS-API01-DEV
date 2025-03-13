// routes/index.ts
import { Router } from "express";
import loginRouter from "./api/login";
import directivoRouter from "./api/directivo";
const router = Router();

router.use("/login", loginRouter);
router.use("/directivo", directivoRouter);
// router.use("/mi-data", )


export default router;
