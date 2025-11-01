import { Producer } from '../../producers/entities/producer.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('uq_movies_title_year', ['title', 'year'])
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

  @ManyToMany(() => Producer, (p) => p.movies, { cascade: ['insert'] })
  @JoinTable({
    name: 'movies_producers',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'producer_id', referencedColumnName: 'id' },
  })
  producers!: Producer[];

}
