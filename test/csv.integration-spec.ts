import { promises as fs } from 'fs';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync';

type Row = Record<string, string>;

const PARSE_OPTS = {
  delimiter: ';',
  columns: true,
  skip_empty_lines: true,
  trim: true,
} as const;

const EXPECTED_HEADERS = ['year', 'title', 'studios', 'producers', 'winner'] as const;
const NUMERIC_COLUMNS = ['year'] as const;
const WINNER_ALLOWED = new Set(['', 'yes']); // somente "yes" ou vazio

function unionKeys(rows: Row[]): Set<string> {
  return new Set(
    rows.reduce<string[]>((acc, r) => {
      acc.push(...Object.keys(r).map(k => k.toLowerCase()));
      return acc;
    }, [])
  );
}

describe('CSV ', () => {
  let csvPath: string;
  let content: string;
  let headerLine: string;
  let rows: Row[];

  beforeAll(async () => {
    if (!process.env.MOVIES_CSV_PATH) {
      throw new Error(
        'Env MOVIES_CSV_PATH not defined. Configure test/setup-env.ts with the path of CSV file.'
      );
    }
    csvPath = resolve(process.env.MOVIES_CSV_PATH);
    await fs.access(csvPath); // garante que o arquivo existe

    content = await fs.readFile(csvPath, 'utf8');
    headerLine = content.split(/\r?\n/, 1)[0]?.trim() ?? '';

    // parse usando os MESMOS parâmetros da app
    rows = parse(content, PARSE_OPTS) as Row[];
  });

  it('should be valid CSV (header and at least 1 content line)', () => {
    expect(headerLine.length).toBeGreaterThan(0);
    expect(rows.length).toBeGreaterThan(0);
  });

  it(' should use ; as separator', () => {
    // valida o header separado por ';'
    const headerTokens = headerLine.split(';').map((h) => h.trim().toLowerCase());
    expect(headerTokens).toEqual(EXPECTED_HEADERS);
    expect(headerLine.includes(',')).toBe(false);
  });

  it('should have all the needed columns', () => {
    const keys = unionKeys(rows);
    const missing = EXPECTED_HEADERS.filter((k) => !keys.has(k));
    expect(missing).toEqual([]); // nenhum header ausente
  });

  it('shouldn`t have extra columns', () => {
    const keys = unionKeys(rows);
    const extras = [...keys].filter((k) => !EXPECTED_HEADERS.includes(k as any));
    expect(extras).toEqual([]); // nenhuma coluna extra
  });

  it('should have numbers on numbered columns', () => {
    rows.forEach((r, idx) => {
      for (const col of NUMERIC_COLUMNS) {
        const raw = (r[col] ?? '').toString().trim();
        const isInt = /^\d+$/.test(raw); // valida se é inteiro
        expect(isInt).toBe(true);
      }
    });
  });

  it('should have yes or empty on winner column', () => {
    rows.forEach((r) => {
      const v = (r['winner'] ?? '').toString().trim().toLowerCase();
      expect(WINNER_ALLOWED.has(v)).toBe(true);
    });
  });
});
