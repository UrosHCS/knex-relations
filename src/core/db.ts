import knex, { Knex } from 'knex';

import { config } from './config';

let db: Knex;

export function connect() {
  if (db) {
    return db;
  }

  db = knex(config.db.sqlite);

  return db;
}

export async function disconnect() {
  if (!db) {
    return;
  }

  await db.destroy();
}

export { db };
