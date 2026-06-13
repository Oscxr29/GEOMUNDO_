import "reflect-metadata";
import { DataSource } from "typeorm";
import { Tema } from "../entities/tema.entity";
import { Actividad } from "../entities/actividad.entity";
import { Pregunta } from "../entities/pregunta.entity";
import { Opcion } from "../entities/opcion.entity";
import { SesionCalificacion } from "../entities/sesion-calificacion.entity";

import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Tema,
    Actividad,
    Pregunta,
    Opcion,
    SesionCalificacion,
  ],
});