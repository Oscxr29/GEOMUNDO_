import { Router, Request, Response } from "express";
import { PreguntaController } from "../controllers/pregunta.controller";
import { PreguntaService } from "../services/pregunta.service";

const preguntaRouter = Router();
const preguntaController = new PreguntaController(new PreguntaService());

preguntaRouter.get(
  "/preguntas/:actividadId",
  (req: Request, res: Response) => preguntaController.getPreguntasByActividadId(req, res)
);

preguntaRouter.get(
  "/pregunta/actividad/:actividadId",
  (req: Request, res: Response) => preguntaController.getPreguntasByActividadId(req, res)
);

preguntaRouter.post(
  "/preguntas",
  (req: Request, res: Response) => preguntaController.createPregunta(req, res)
);

export default preguntaRouter;