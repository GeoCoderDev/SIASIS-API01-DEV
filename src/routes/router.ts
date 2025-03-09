// routes/index.ts
import { Router } from "express";
import loginRouter from "./api/login";

const router = Router();

router.use("/login", loginRouter);

export default router;
