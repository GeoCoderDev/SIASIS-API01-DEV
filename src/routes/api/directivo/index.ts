import { Router } from "express";
import directivoFotoPerfilRouter from "./foto-perfil";

const router = Router();

router.use("/foto-perfil", directivoFotoPerfilRouter);

export default router;
