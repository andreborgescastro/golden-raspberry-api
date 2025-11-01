import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'text', nullable: true })
  studios!: string | null;

  @Column({ type: 'boolean', default: false })
  winner!: boolean;

}
