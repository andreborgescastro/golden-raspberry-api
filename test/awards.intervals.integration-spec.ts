import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import path from 'node:path';
import { runSeed } from '../src/seeds/seed';

describe('GET /awards/intervals (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = modRef.createNestApplication();

    process.env.MOVIES_CSV_PATH = path.resolve(__dirname, '../assets/Movielist.csv');

    await app.init();
    await runSeed(app);
  });

  afterAll(async () => { await app.close(); });

  it('should return a valid contract schema', async () => {
    const res = await request(app.getHttpServer())
      .get('/awards/intervals')
      .expect(200)
      .expect('Content-Type', /json/);

    const body = res.body;
    
    // valida contrato de retorno
    expect(body).toHaveProperty('min');
    expect(body).toHaveProperty('max');
    expect(Array.isArray(body.min)).toBe(true);
    expect(Array.isArray(body.max)).toBe(true);

    for (const item of [...body.min, ...body.max]) {
      
      // valida as propriedades do objeto de retorno
      expect(item).toHaveProperty('producer');
      expect(item).toHaveProperty('interval');
      expect(item).toHaveProperty('previousWin');
      expect(item).toHaveProperty('followingWin');
      
      // valida o tipo dos atributos
      expect(typeof item.producer).toBe('string');
      expect(typeof item.interval).toBe('number');
      expect(typeof item.previousWin).toBe('number');
      expect(typeof item.followingWin).toBe('number');
      expect(item.followingWin - item.previousWin).toBe(item.interval);
    }

  });

  it('should ensure same interval between the tied producers', async () => {
    const res = await request(app.getHttpServer())
      .get('/awards/intervals')
      .expect(200)
      .expect('Content-Type', /json/);

    const { min, max } = res.body as { min: any[]; max: any[] };

    const assertTiedProducers = (list: any[]) => {

      // Valida igualdade quando há mais de um registro (empate).
      if (Array.isArray(list) && list.length > 1) {
        const intervals = list.map((x) => x.interval);
        const unique = new Set(intervals);
        expect(unique.size).toBe(1);
        
        const expected = intervals[0];
        expect(list.every((x) => x.interval === expected)).toBe(true);
      }
    };

    assertTiedProducers(min);
    assertTiedProducers(max);
  });
});
