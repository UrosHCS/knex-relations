import { Knex } from 'knex';

export type DB = Knex;
export type KnexQB<Model> = Knex.QueryBuilder<Model>;

let databaseInstance: DB | null = null;

export function getDatabase(): DB {
  if (!databaseInstance) {
    throw new Error('Database not set. Use setDatabase function to set it (setDatabase(knex(config)).');
  }

  return databaseInstance;
}

export function setDatabase(db: DB): void {
  databaseInstance = db;
}

export * from './table';
export * from './repository';