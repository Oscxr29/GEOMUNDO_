import { AppDataSource } from "../config/database";
import { SesionCalificacion } from "../entities/sesion-calificacion.entity";
import { ISesionCalificacion } from "../interfaces/sesion-calificacion.interface";

export class SesionCalificacionService {
  private sesionRepository = AppDataSource.getRepository(SesionCalificacion);

  createSesionCalificacion(sesion: ISesionCalificacion) {
    const entity = this.sesionRepository.create({
      estudiante: sesion.estudiante ?? null,
      tema: sesion.tema ?? null,
      actividad: sesion.actividad ?? null,
      puntaje: sesion.puntaje,
      totalPreguntas: sesion.totalPreguntas,
    });

    return this.sesionRepository.save(entity);
  }
}