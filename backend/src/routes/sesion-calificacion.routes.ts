import { Router, Request, Response } from "express";
import { SesionCalificacionController } from "../controllers/sesion-calificacion.controller";
import { SesionCalificacionService } from "../services/sesion-calificacion.service";

const sesionCalificacionRouter = Router();
const sesionCalificacionController = new SesionCalificacionController(new SesionCalificacionService());

sesionCalificacionRouter.post(
  "/sesiones/calificacion",
  (req: Request, res: Response) => sesionCalificacionController.createSesionCalificacion(req, res)
);

export default sesionCalificacionRouter;