import { Router, Request, Response } from "express";
import { SesionCalificacionController } from "../controllers/sesion-calificacion.controller";
import { SesionCalificacionService } from "../services/sesion-calificacion.service";

const sesionCalificacionRouter = Router();
const sesionCalificacionController = new SesionCalificacionController(new SesionCalificacionService());

// ── existente — no se toca ──────────────────────────────────────
sesionCalificacionRouter.post(
  "/sesiones/calificacion",
  (req: Request, res: Response) => sesionCalificacionController.createSesionCalificacion(req, res)
);

// ── NUEVO ───────────────────────────────────────────────────────
// GET /api/sesiones/ranking?actividad=<nombre>&limit=20
sesionCalificacionRouter.get(
  "/sesiones/ranking",
  (req: Request, res: Response) => sesionCalificacionController.getRanking(req, res)
);

export default sesionCalificacionRouter;