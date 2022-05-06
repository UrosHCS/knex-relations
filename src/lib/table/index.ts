import { Knex } from 'knex';

export type DB = Knex;
export type KnexQB<Model> = Knex.QueryBuilder<Model>;

let db: DB;

export function getDatabase(): DB {
  if (!db) {
    throw new Error('Database not set. Use setDatabase function to set it (setDatabase(knex(config)).');
  }

  return db;
}

export function setDatabase(database: DB): void {
  db = database;
}

export { db };

export * from './table';
export * from './repository';