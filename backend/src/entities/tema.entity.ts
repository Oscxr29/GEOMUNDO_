import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Actividad } from "./actividad.entity";

@Entity()
export class Tema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  nombre!: string;

  @Column({ type: "text" })
  descripcion!: string;

  @Column({ default: 0 })
  orden!: number;

  @OneToMany(() => Actividad, (actividad) => actividad.tema)
  actividades!: Actividad[];
}