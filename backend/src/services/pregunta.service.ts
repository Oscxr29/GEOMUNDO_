import { AppDataSource } from "../config/database";
import { Pregunta } from "../entities/pregunta.entity";
import { IPregunta } from "../interfaces/pregunta.interface";
import { Actividad } from "../entities/actividad.entity";

export class PreguntaService {
  private preguntaRepository = AppDataSource.getRepository(Pregunta);
  private actividadRepository = AppDataSource.getRepository(Actividad);

  getPreguntasByActividadId(actividadId: string) {
    return this.preguntaRepository.find({
      where: { actividad: { id: actividadId } },
      relations: { opciones: true, actividad: true },
      order: {
        orden: "ASC",
        opciones: { orden: "ASC" },
      },
    });
  }

  async createPregunta(pregunta: IPregunta) {
    const actividad = await this.actividadRepository.findOneBy({ id: pregunta.actividadId! });

    if (!actividad) {
      return null;
    }

    const entity = this.preguntaRepository.create({
      enunciado: pregunta.enunciado,
      explicacion: pregunta.explicacion ?? null,
      orden: pregunta.orden ?? 0,
      actividad,
    });

    return this.preguntaRepository.save(entity);
  }
}