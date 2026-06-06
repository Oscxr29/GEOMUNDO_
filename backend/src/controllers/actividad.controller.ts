import { Request, Response } from "express";
import { ActividadService } from "../services/actividad.service";
import { IActividad } from "../interfaces/actividad.interface";

export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  async getActividadesByTemaId(req: Request, res: Response) {
    try {
      const temaId = req.params.temaId;

      if (typeof temaId !== "string" || temaId.length === 0) {
        return res.status(400).json({ message: "Tema inválido" });
      }

      const actividades = await this.actividadService.getActividadesByTemaId(temaId);
      return res.status(200).json({ data: actividades });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudieron obtener las actividades" });
    }
  }

  async createActividad(req: Request, res: Response) {
    try {
      const actividad: IActividad = req.body;

      if (!actividad.nombre || !actividad.descripcion || !actividad.temaId) {
        return res.status(400).json({ message: "Nombre, descripción y temaId son obligatorios" });
      }

      const created = await this.actividadService.createActividad(actividad);

      if (!created) {
        return res.status(404).json({ message: "Tema no encontrado" });
      }

      return res.status(201).json({ data: created });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "No se pudo crear la actividad" });
    }
  }
}