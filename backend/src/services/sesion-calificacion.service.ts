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

  async getRanking(actividad?: string, limit = 20): Promise<SesionCalificacion[]> {
    const qb = this.sesionRepository
      .createQueryBuilder("s")
      .orderBy("s.puntaje", "DESC")
      .addOrderBy("s.createdAt", "ASC")
      .take(limit);

    if (actividad && actividad.trim().length > 0) {
      qb.where("s.actividad = :actividad", { actividad: actividad.trim() });
    }

    return qb.getMany();
  }
}