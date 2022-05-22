import { Knex } from 'knex';

export type DB = Knex;

let db: DB | undefined;

export function getDatabase(): DB {
  if (!db) {
    throw new Error('Database not set. Use setDatabase function to set it (setDatabase(knex(config)).');
  }

  return db;
}

export function setDatabase(database: DB): void {
  db = database;
}

/**
 * For tests teardown.
 */
export function unsetDatabase(): void {
  db = undefined;
}

export { db };
