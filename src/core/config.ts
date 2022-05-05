import { Knex } from "knex";

const sqlite: Knex.Config = {
  client: 'better-sqlite3',
  // connection: 'file:memDb?mode=memory&cache=shared', 
  connection: {
    filename: 'file:memDb?mode=memory&cache=shared',
  }, 
  pool: {
    min: 1,
    max: 1,
    destroyTimeoutMillis: 360000*1000, 
    idleTimeoutMillis: 360000*1000 
  },
  useNullAsDefault: true,
};

const db = {
  sqlite,
};

export const config = { db };
