import knex from 'knex';

import { initApp } from '../src/app';
import { config } from '../src/core/config';
import { DB, setDatabase, unsetDatabase } from '../src/lib/knex-relations';

export function initKnex(): DB {
  return knex(config.db.sqlite);
}

export function dbSetup(): DB {
  const db = initKnex();
  setDatabase(db);
  return db;
}

export function dbTeardown(db: DB) {
  unsetDatabase();
  db.destroy();
}

export async function migrate(db: DB): Promise<void> {
  await db.migrate.down();
  await db.migrate.up();
}

export async function dbSetupMigrate(): Promise<DB> {
  const db = dbSetup();
  await migrate(db);

  await initApp();

  return db;
}

export async function dbSetupAndCleanup() {
  const db = await dbSetupMigrate();
  return () => dbTeardown(db);
}
