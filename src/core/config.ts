import { Knex } from 'knex';

const sqlite: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: 'db/file:memDb?mode=memory&cache=shared',
  },
  pool: {
    min: 1,
    max: 1,
    destroyTimeoutMillis: 360000 * 1000,
    idleTimeoutMillis: 360000 * 1000,
  },
  migrations: {
    tableName: 'migrations',
    directory: './dist/database/migrations',
  },
  seeds: {
    directory: './dist/database/seeds',
  },
  useNullAsDefault: true,
};

const db = {
  sqlite,
};

export const config = { db };
