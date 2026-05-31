import { AppDataSource } from "../config/database";
import { Actividad } from "../entities/actividad.entity";
import { IActividad } from "../interfaces/actividad.interface";
import { Tema } from "../entities/tema.entity";

export class ActividadService {
  private actividadRepository = AppDataSource.getRepository(Actividad);
  private temaRepository = AppDataSource.getRepository(Tema);

  getActividadesByTemaId(temaId: string) {
    return this.actividadRepository.find({
      where: { tema: { id: temaId } },
      relations: { tema: true },
      order: { orden: "ASC" },
    });
  }

  async createActividad(actividad: IActividad) {
    const tema = await this.temaRepository.findOneBy({ id: actividad.temaId! });

    if (!tema) {
      return null;
    }

    const entity = this.actividadRepository.create({
      nombre: actividad.nombre,
      descripcion: actividad.descripcion,
      nivel: actividad.nivel ?? 1,
      orden: actividad.orden ?? 0,
      tema,
    });

    return this.actividadRepository.save(entity);
  }
}