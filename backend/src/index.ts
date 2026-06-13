import 'dotenv/config';
import express, { Request, Response } from "express";
import 'reflect-metadata';
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Database } from "./database/db";
import { errorHandler } from "./middlewares/error-handler";
import temaRouter from "./routes/tema.routes";
import actividadRouter from "./routes/actividad.routes";
import preguntaRouter from "./routes/pregunta.routes";
import sesionCalificacionRouter from "./routes/sesion-calificacion.routes";

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
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

app.use(errorHandler);

async function main(): Promise<void> {
  const db: Database = Database.getDataBaseInstance();

  if (process.env.NODE_ENV === 'development') {
    console.log("DB config:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });
  }

  try {
    await db.init();
    console.log("Conexion a MySQL inicializada correctamente");
  } catch (error) {
    console.error("Error al conectar con MySQL. El servidor continuara iniciando:", error);
  }

  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
  });
}

main();