import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hola, soy el login de directivo");
});

export { router };
