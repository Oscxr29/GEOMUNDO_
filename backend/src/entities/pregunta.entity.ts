import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Actividad } from "./actividad.entity";
import { Opcion } from "./opcion.entity";

@Entity()
export class Pregunta {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  enunciado!: string;

  @Column({ type: "text", nullable: true })
  explicacion!: string | null;

  @Column({ default: 0 })
  orden!: number;

  @ManyToOne(() => Actividad, (actividad) => actividad.preguntas, { onDelete: "CASCADE" })
  actividad!: Actividad;

  @OneToMany(() => Opcion, (opcion) => opcion.pregunta)
  opciones!: Opcion[];
}