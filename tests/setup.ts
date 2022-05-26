import knex from 'knex';

import { config } from '../src/core/config';
import { DB, setDatabase, unsetDatabase } from '../src/lib/knex-relations/db-container';

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
  await db.migrate.up();
}

export async function dbSetupMigrate(): Promise<{ app: any; db: DB }> {
  const db = dbSetup();
  await migrate(db);

  const app = await import('../src/app');

  [app.userModule.table, app.postModule.table].forEach(table => table.init());

  return { app, db };
}
