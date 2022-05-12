import { Knex } from 'knex';

export type DB = Knex;
// export type KnexQB1<Model> = Knex.QueryBuilder<
//   Model,
//   // This is the DeferredKeySelection type which is not available in knex typings.
//   {
//     _base: Model;
//     _hasSelection: false;
//     _keys: never;
//     // eslint-disable-next-line @typescript-eslint/ban-types
//     _aliases: {};
//     _single: false;
//     // eslint-disable-next-line @typescript-eslint/ban-types
//     _intersectProps: {};
//     _unionProps: never;
//   }[]
// >;

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

// Waiting for typescript 4.7, but until then we need this hack.
// This class's only purpose is to extract the type of db<T>('any').
class Wrapper<T> {
  // wrapped has no explicit return type so we can infer it
  wrapped() {
    return db<T>('any');
  }
}

export type KnexQB<Model> = ReturnType<Wrapper<Model>['wrapped']>;

export * from './table';
export * from './repository';
