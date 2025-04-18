// import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
const router = express();

// const prisma = new PrismaClient();

router.post("/marcar", (req: Request, res: Response) => {
  res.send(JSON.stringify({ message: "Hola mundo marcar" }));
});

export default router;
