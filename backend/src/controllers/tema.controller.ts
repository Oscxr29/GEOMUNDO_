import { Request, Response } from "express";
import { TemaService } from "../services/tema.service";
import { ITema } from "../interfaces/tema.interface";

export class TemaController {
  constructor(private readonly temaService: TemaService) {}

  async getAllTemas(_req: Request, res: Response) {
    const temas = await this.temaService.getAllTemas();
    res.status(200).json({ data: temas });
  }

  async getTemaById(req: Request, res: Response) {
    const id = req.params.id;

    if (typeof id !== "string" || id.length === 0) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const tema = await this.temaService.getTemaById(id);

    if (!tema) {
      return res.status(404).json({ message: "Tema no encontrado" });
    }

    return res.status(200).json({ data: tema });
  }

  async createTema(req: Request, res: Response) {
    const tema: ITema = req.body;

    if (!tema.nombre || !tema.descripcion) {
      return res.status(400).json({ message: "Nombre y descripción son obligatorios" });
    }

    const created = await this.temaService.createTema(tema);

    return res.status(201).json({ data: created });
  }
}