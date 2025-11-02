import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Producer } from '../producers/entities/producer.entity';

type Row = {
  kind: 'min' | 'max';
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

@Injectable()
export class AwardsRepository {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Producer) private readonly producerRepo: Repository<Producer>,
  ) {}

  async getIntervalsMinMaxRaw(): Promise<{ min: Row[]; max: Row[] }> {
    const sql = `
      WITH wins AS (
      SELECT DISTINCT
        p.name AS producer,
        m.year AS year
      FROM producers p
      JOIN movies_producers mp ON mp.producer_id = p.id
      JOIN movies m            ON m.id          = mp.movie_id
      WHERE m.winner = 1
    ),
    -- pares consecutivos e seus intervalos
    intervals AS (
      SELECT
        producer,
        LAG(year)  OVER (PARTITION BY producer ORDER BY year) AS previousWin,
        year       AS followingWin,
        (year - LAG(year) OVER (PARTITION BY producer ORDER BY year)) AS interval
      FROM wins
    )
    -- empates de MIN e MAX
    SELECT 'min' AS kind, producer, interval, previousWin, followingWin
    FROM intervals
    WHERE previousWin IS NOT NULL
      AND interval = (SELECT MIN(interval) FROM intervals WHERE previousWin IS NOT NULL)
    UNION ALL
    SELECT 'max' AS kind, producer, interval, previousWin, followingWin
    FROM intervals
    WHERE previousWin IS NOT NULL
      AND interval = (SELECT MAX(interval) FROM intervals WHERE previousWin IS NOT NULL)
    ORDER BY kind, producer;
    `;

    const rows = await this.movieRepo.query(sql) as Row[];

    const min: Row[] = [];
    const max: Row[] = [];
    
    // mapeamento do retorno do banco
    for (const r of rows) {
      const item: Row = {
        kind: r.kind,
        producer: r.producer,
        interval: Number(r.interval),
        previousWin: Number(r.previousWin),
        followingWin: Number(r.followingWin),
      };
      (item.kind === 'min' ? min : max).push(item);
    }
    return { min, max };
  }
}
