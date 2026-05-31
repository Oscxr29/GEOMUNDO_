import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pregunta } from "./pregunta.entity";

@Entity()
export class Opcion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  texto!: string;

  @Column({ default: false })
  esCorrecta!: boolean;

  @Column({ default: 0 })
  orden!: number;

  @ManyToOne(() => Pregunta, (pregunta) => pregunta.opciones, { onDelete: "CASCADE" })
  pregunta!: Pregunta;
}