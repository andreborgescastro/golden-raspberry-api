import { INestApplication, Logger, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { readFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { Movie } from '../movies/entities/movie.entity';
import { Producer } from '../producers/entities/producer.entity';

type RawRow = {
  year?: string;
  title?: string;
  studios?: string;
  producers?: string;
  winner?: string;
};

const log = new Logger('Seed');

function splitProducers(raw?: string | null): string[] {
  if (!raw) return [];
  // troca " and " por vírgula, depois split e trim
  return raw.replace(/\sand\s/gi, ',')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
}

function toBoolWinner(x?: string): boolean {
  return !!x && /^yes$/i.test(x.trim());
}

export async function runSeed(app: INestApplication) {
  const movieRepo = app.get<Repository<Movie>>(getRepositoryToken(Movie));
  const producerRepo = app.get<Repository<Producer>>(getRepositoryToken(Producer));

  const csvPath = process.env.MOVIES_CSV_PATH
  if(!csvPath){
    throw new NotFoundException("Missing path of CSV file on .env")
  }  

  log.log(`Loading CSV: ${csvPath}`);

  const buf = await readFile(csvPath);
  const rows = parse(buf, { delimiter:';', columns: true, skip_empty_lines: true, trim: true }) as RawRow[];

  for (const r of rows) {
    const year = Number(r.year);
    const title = (r.title ?? '').trim();
    if (!title || !Number.isFinite(year)) {
      log.warn(`Skipping invalid row: ${JSON.stringify(r)}`);
      continue;
    }

    // upsert de produtores por nonme
    const names = splitProducers(r.producers);
    const producersToEnsure = [...new Set(names)];

    for (const name of producersToEnsure) {
      await producerRepo.upsert({ name }, ['name']);
    }

    // upsert de filmes por título e ano
    await movieRepo.upsert(
      {
        title,
        year,
        studios: r.studios ?? null,
        winner: toBoolWinner(r.winner),
      },
      ['title', 'year'],
    );

    const movie = await movieRepo.findOne({ where: { title, year } });
    if (!movie) {
      log.warn(`Could not retrieve movie just upserted: ${title} (${year})`);
      continue;
    }

    // relaciona Filme <-> Produtor
    const ensuredProducers = producersToEnsure.length
      ? await producerRepo.find({ where: { name: In(producersToEnsure) } })
      : [];

    const producerIds = ensuredProducers.map((p) => p.id);

    if (producerIds.length > 0) {
      await movieRepo
        .createQueryBuilder()
        .relation(Movie, 'producers')
        .of(movie.id)
        .addAndRemove(producerIds, []); 
    }
  }

  log.log(`Seed finished. Movies in DB: ${await movieRepo.count()}, Producers: ${await producerRepo.count()}`);
}
