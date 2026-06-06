import { Request, Response } from "express";
import { PreguntaService } from "../services/pregunta.service";
import { IPregunta } from "../interfaces/pregunta.interface";

export class PreguntaController {
  constructor(private readonly preguntaService: PreguntaService) {}

  async getPreguntasByActividadId(req: Request, res: Response) {
    try {
      const actividadId = req.params.actividadId;

      if (typeof actividadId !== "string" || actividadId.length === 0) {
        return res.status(400).json({ message: "Actividad inválida" });
      }

      const preguntas = await this.preguntaService.getPreguntasByActividadId(actividadId);
      return res.status(200).json({ data: preguntas });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudieron obtener las preguntas" });
    }
  }

  async createPregunta(req: Request, res: Response) {
    try {
      const pregunta: IPregunta = req.body;

      if (!pregunta.enunciado || !pregunta.actividadId) {
        return res.status(400).json({ message: "Enunciado y actividadId son obligatorios" });
      }

      const created = await this.preguntaService.createPregunta(pregunta);

      if (!created) {
        return res.status(404).json({ message: "Actividad no encontrada" });
      }

      return res.status(201).json({ data: created });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudo crear la pregunta" });
    }
  }
}