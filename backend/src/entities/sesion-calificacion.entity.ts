import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SesionCalificacion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  estudiante!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tema!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  actividad!: string | null;

  @Column({ type: 'int' })
  puntaje!: number;

  @Column({ type: 'int' })
  totalPreguntas!: number;

  @CreateDateColumn()
  createdAt!: Date;
}