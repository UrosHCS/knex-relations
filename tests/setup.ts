import knex, { Knex } from 'knex';

import { config } from '../src/core/config';
import { setDatabase, unsetDatabase } from '../src/lib/knex-relations';

export function initKnex(): Knex {
  return knex(config.db.sqlite);
}

export function dbSetup() {
  const db = initKnex();
  setDatabase(db);
  return db;
}

export function dbTeardown(db: Knex) {
  unsetDatabase();
  db.destroy();
}

export async function migrateAndSeed(db: Knex<any, unknown>) {
  await db.migrate.up();
  await db.seed.run();
}

export async function dbSetupMigrateSeed() {
  const db = dbSetup();
  await migrateAndSeed(db);

  return db;
}
