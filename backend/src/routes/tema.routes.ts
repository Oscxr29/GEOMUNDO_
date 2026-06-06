import { Router, Request, Response } from "express";
import { TemaController } from "../controllers/tema.controller";
import { TemaService } from "../services/tema.service";

const temaRouter = Router();
const temaController = new TemaController(new TemaService());
console.log(" Rutas de temas cargadas");

temaRouter.get("/tema", (req: Request, res: Response) => temaController.getAllTemas(req, res));
temaRouter.get("/tema/:id", (req: Request, res: Response) => temaController.getTemaById(req, res));
temaRouter.post("/tema", (req: Request, res: Response) => temaController.createTema(req, res));

export default temaRouter;