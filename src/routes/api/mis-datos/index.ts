import { Request, Response, Router } from "express";

const router = Router();

router.get("/", ((req: Request, res: Response) => {
  res.json({ message: "hOLA " });
}) as any);

export default router;
