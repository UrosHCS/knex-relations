import knex from 'knex';

import { postsTable } from '../src/app/post/posts-table';
import { usersTable } from '../src/app/user/users-table';

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
  await db.migrate.down();
  await db.migrate.up();
}

export async function dbSetupMigrate(): Promise<DB> {
  const db = dbSetup();
  await migrate(db);

  const app = await import('../src/app');

  tables().forEach(table => table.init());

  return db;
}

function tables() {
  return [usersTable, postsTable];
}
