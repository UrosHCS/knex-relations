import { db } from '.';

export type ID = string | number;

export interface Row {
  [key: string]: any;
}

/**
 * Callback that accepts a knex query builder and returns a promise of results.
 */
export type QBCallback<Model, T> = (qb: KnexQB<Model>) => Promise<T[]>;

export type ChildShape<IsOne, T> = IsOne extends true ? T : T[];

// Waiting for typescript 4.7, but until then we need this hack.
// This class's only purpose is to extract the type of db<T>('any').
class Wrapper<T> {
  // wrapped has no explicit return type so we can infer it
  wrapped() {
    return db<T>('any');
  }
}

export type KnexQB<Model> = ReturnType<Wrapper<Model>['wrapped']>;
