import knex from 'knex';

import { DB } from '../lib/knex-relations';

import { config } from './config';

let db: DB;

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
