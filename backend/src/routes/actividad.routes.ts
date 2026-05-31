import { Router, Request, Response } from "express";
import { ActividadController } from "../controllers/actividad.controller";
import { ActividadService } from "../services/actividad.service";

const actividadRouter = Router();
const actividadController = new ActividadController(new ActividadService());

actividadRouter.get(
  "/actividades/:temaId",
  (req: Request, res: Response) => actividadController.getActividadesByTemaId(req, res)
);

actividadRouter.post(
  "/actividades",
  (req: Request, res: Response) => actividadController.createActividad(req, res)
);

export default actividadRouter;