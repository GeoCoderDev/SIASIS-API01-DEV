// routes/index.ts
import { Router } from "express";

import path from "path";
import findAllIndexTsFiles from "../lib/helpers/functions/findAllIndexTsFiles";

const router = Router();
const PATH_ROUTER = __dirname;

// Encontrar todos los archivos index.ts
const indexFiles = findAllIndexTsFiles(PATH_ROUTER);

// Ahora puedes usar los resultados para crear tus rutas como prefieras
indexFiles.forEach((file) => {
  // Ejemplo: Extraer partes de la ruta para crear el endpoint
  const routeParts = path.relative(PATH_ROUTER, file.dirPath).split(path.sep);
  const endpointPath = "/" + routeParts.join("/");

  // Aquí puedes implementar tu lógica para registrar las rutas
  
  console.log("./" + file.relativePath.replace(/\\/g, "/"));

  import("./" + file.relativePath.replace(/\\/g, "/")).then((module) => {
    router.use(endpointPath, module.router);
  });
});

export default router;
