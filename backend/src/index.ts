import 'dotenv/config';
import express, { Request, Response } from "express";
import 'reflect-metadata';
import cors from "cors";
import { Database } from "./database/db";
import temaRouter from "./routes/tema.routes";
import actividadRouter from "./routes/actividad.routes";
import preguntaRouter from "./routes/pregunta.routes";
import sesionCalificacionRouter from "./routes/sesion-calificacion.routes";

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

// Rutas
app.use("/api", temaRouter);
app.use("/api", actividadRouter);
app.use("/api", preguntaRouter);
app.use("/api", sesionCalificacionRouter);

// Ruta principal
app.get(
  '/',
  (req: Request, res: Response): Response =>
    res.json({ ok: true, proyecto: "GeoMundo" })
);

async function main(): Promise<void> {

  const db: Database = Database.getDataBaseInstance();

  await db.init();

  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
  });

}

main();