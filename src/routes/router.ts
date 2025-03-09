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

  const routeParts = path.relative(PATH_ROUTER, file.dirPath).split(path.sep);
  const endpointPath = "/" + routeParts.join("/");

  //Importando dinamicamente los routers de los archivos index.ts de cualquier nivel dentro de la carpeta routes 
  import("./" + file.relativePath).then((module) => {
    router.use(endpointPath, module.router);
  });
});

export default router;
