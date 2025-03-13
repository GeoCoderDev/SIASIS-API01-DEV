import { Router } from "express";
import directivoLoginRouter from "./directivo";
import profesorPrimariaLoginRouter from "./profesor-primaria";
import auxiliarLoginRouter from "./auxiliar";
import profesorTutorSecundariaRouter from "./profesor-tutor-secundaria";
const loginRouter = Router();

loginRouter.use("/directivo", directivoLoginRouter);
loginRouter.use("/profesor-primaria", profesorPrimariaLoginRouter);
loginRouter.use("/auxiliar", auxiliarLoginRouter);
loginRouter.use("/profesor-tutor-secundaria", profesorTutorSecundariaRouter);
loginRouter.use("/personal-administrativo", directivoLoginRouter);

export default loginRouter;
