import { Request, Response } from "express";
import { TemaService } from "../services/tema.service";
import { ITema } from "../interfaces/tema.interface";

export class TemaController {
  constructor(private readonly temaService: TemaService) {}

  async getAllTemas(_req: Request, res: Response) {
    try {
      const temas = await this.temaService.getAllTemas();
      console.log("Temas encontrados:", temas.length);
      res.status(200).json({ data: temas });
    } catch (error) {
      console.error("Error en controller de temas:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      res.status(500).json({ message: "No se pudieron obtener los temas", error: message });
    }
  }

  async getTemaById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (typeof id !== "string" || id.length === 0) {
        return res.status(400).json({ message: "Id inválido" });
      }

      const tema = await this.temaService.getTemaById(id);

      if (!tema) {
        return res.status(404).json({ message: "Tema no encontrado" });
      }

      return res.status(200).json({ data: tema });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudo obtener el tema" });
    }
  }

  async createTema(req: Request, res: Response) {
    try {
      const tema: ITema = req.body;

      if (!tema.nombre || !tema.descripcion) {
        return res.status(400).json({ message: "Nombre y descripción son obligatorios" });
      }

      const created = await this.temaService.createTema(tema);

      return res.status(201).json({ data: created });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudo crear el tema" });
    }
  }
}