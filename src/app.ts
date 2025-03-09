import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router";
// import {
//   encryptDirectivoPassword,
//   verifyDirectivoPassword,
// } from "./lib/helpers/encriptations/directivo.encriptation";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

//Ruta de 404 NOT FOUND
app.use("*", (req, res) => {
  res.status(404).json({
    message: `La ruta ${req.originalUrl} no existe en este servidor`,
  });
});

// (function () {
//   const passwordHash = encryptDirectivoPassword("12345678");

//   console.log(`Contraseña encriptada: ${passwordHash}`);
//   console.log(
//     `Contraseña desencriptada: ${verifyDirectivoPassword(
//       "12345678",
//       "c67f7e10154221b997e4fff5f08dc4ff:388729510295d16259ad5c94d3bab13f"
//     )}`
//   );


// })();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
