import { Router, Request, Response } from "express";
import { ActividadController } from "../controllers/actividad.controller";
import { ActividadService } from "../services/actividad.service";

const actividadRouter = Router();
const actividadController = new ActividadController(new ActividadService());

console.log("✅ Rutas de actividades cargadas");

actividadRouter.get("/actividad", (_req: Request, res: Response) => {
  return res.status(400).json({
    message: "Debes usar /api/actividad/:temaId o /api/actividad/tema/:temaId",
  });
});

actividadRouter.get(
  "/actividades/:temaId",
  (req: Request, res: Response) => actividadController.getActividadesByTemaId(req, res)
);

actividadRouter.get(
  "/actividad/:temaId",
  (req: Request, res: Response) => actividadController.getActividadesByTemaId(req, res)
);

actividadRouter.get(
  "/actividad/tema/:temaId",
  (req: Request, res: Response) => actividadController.getActividadesByTemaId(req, res)
);

actividadRouter.post(
  "/actividades",
  (req: Request, res: Response) => actividadController.createActividad(req, res)
);

actividadRouter.post(
  "/actividad",
  (req: Request, res: Response) => actividadController.createActividad(req, res)
);

export default actividadRouter;