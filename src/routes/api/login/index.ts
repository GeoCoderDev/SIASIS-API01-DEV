import { Router } from "express";
import directivoLoginRouter from "./directivo";

const loginRouter = Router();

loginRouter.use("/directivo", directivoLoginRouter);
loginRouter.use("/profesor-primaria", directivoLoginRouter);
loginRouter.use("/auxiliar", directivoLoginRouter);
loginRouter.use("/profesor-tutor-secundaria", directivoLoginRouter);
loginRouter.use("/responsable", directivoLoginRouter);
loginRouter.use("/personal-administrativo", directivoLoginRouter);

export default loginRouter;
