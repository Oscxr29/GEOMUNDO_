import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tema } from "./tema.entity";
import { Pregunta } from "./pregunta.entity";

@Entity()
export class Actividad {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  nombre!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ default: 1 })
  nivel!: number;

  @Column({ default: 0 })
  orden!: number;

  @ManyToOne(() => Tema, (tema) => tema.actividades, { onDelete: "CASCADE" })
  tema!: Tema;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.actividad)
  preguntas!: Pregunta[];
}