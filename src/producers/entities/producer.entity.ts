import { Movie } from '../../movies/entities/movie.entity';
import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToMany, Unique } from 'typeorm';

@Unique('uq_producers_name', ['name'])
@Entity({ name: 'producers' })
export class Producer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ type: 'text' })
  name!: string;

  @ManyToMany(() => Movie, (m) => m.producers)
  movies!: Movie[];
}
