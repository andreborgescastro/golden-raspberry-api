import { resolve } from 'path';
process.env.NODE_ENV = 'test';
process.env.MOVIES_CSV_PATH = resolve(__dirname, 'fixtures/test-accepted-csv-sample.csv');
