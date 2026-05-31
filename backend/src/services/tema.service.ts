import { AppDataSource } from "../config/database";
import { Tema } from "../entities/tema.entity";
import { ITema } from "../interfaces/tema.interface";

export class TemaService {
  private temaRepository = AppDataSource.getRepository(Tema);

  getAllTemas() {
    return this.temaRepository.find({ order: { orden: "ASC" } });
  }

  getTemaById(id: string) {
    return this.temaRepository.findOne({
      where: { id },
      relations: { actividades: true },
      order: { actividades: { orden: "ASC" } },
    });
  }

  createTema(tema: ITema) {
    return this.temaRepository.save(this.temaRepository.create(tema));
  }
}