import { Request, Response } from "express";
import { SesionCalificacionService } from "../services/sesion-calificacion.service";
import { ISesionCalificacion } from "../interfaces/sesion-calificacion.interface";
import { SesionCalificacion } from "../entities/sesion-calificacion.entity";

export class SesionCalificacionController {
  constructor(private readonly sesionService: SesionCalificacionService) {}

  async createSesionCalificacion(req: Request, res: Response) {
    try {
      const sesion: ISesionCalificacion = req.body;

      if (typeof sesion.puntaje !== "number" || typeof sesion.totalPreguntas !== "number") {
        return res.status(400).json({ message: "Puntaje y totalPreguntas son obligatorios" });
      }

      const created = await this.sesionService.createSesionCalificacion(sesion);
      return res.status(201).json({ data: created });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudo guardar la calificación" });
    }
  }

  async getRanking(req: Request, res: Response) {
    try {
      const actividad = typeof req.query.actividad === "string"
        ? req.query.actividad
        : undefined;

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      if (isNaN(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Parámetro limit inválido (1-100)" });
      }

      const sesiones = await this.sesionService.getRanking(actividad, limit);

      const data = sesiones.map((s: SesionCalificacion, i: number) => ({
        posicion:       i + 1,
        id:             s.id,
        estudiante:     s.estudiante ?? "Anónimo",
        actividad:      s.actividad  ?? "—",
        tema:           s.tema       ?? "—",
        puntaje:        s.puntaje,
        totalPreguntas: s.totalPreguntas,
        fecha:          s.createdAt.toISOString().split("T")[0],
      }));

      return res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudo obtener el ranking" });
    }
  }
}