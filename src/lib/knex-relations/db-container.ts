import { Knex } from 'knex';

export type DB = Knex;

let db: DB | undefined;

/**
 * Used by Table class if the db is not passed to it directly.
 */
export function getDatabase(): DB {
  if (!db) {
    throw new Error('Database not set. Use setDatabase function to set it (setDatabase(knex(config)).');
  }

  return db;
}

/**
 * Set the knex database object in this module,
 * so that it doesn't have to be set in every table.
 */
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
