import { Knex } from "knex";

const sqlite: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    // filename: 'file:memDb?mode=memory&cache=shared',
    filename: ':memory:',
  }, 
  pool: {
    min: 1,
    max: 1,
    destroyTimeoutMillis: 360000*1000, 
    idleTimeoutMillis: 360000*1000 
  },
  migrations: {
    tableName: 'migrations',
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
  useNullAsDefault: true,
};

const db = {
  sqlite,
};

export const config = { db };
