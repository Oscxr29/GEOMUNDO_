import { Request, Response } from "express";
import { SesionCalificacionService } from "../services/sesion-calificacion.service";
import { ISesionCalificacion } from "../interfaces/sesion-calificacion.interface";

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
}