import { Relation } from './relations/relation';

import { getDatabase } from '.';

export type ID = string | number;

export interface Row {
  [key: string]: any;
}

/**
 * Generic relations map.
 */
export interface RelationsMap<Parent extends Row> {
  [key: string]: Relation<Parent, any, string, boolean>;
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
    return getDatabase()<T>('any');
  }
}

// Without DeferredKeySelection as the second generic parameter in the Knex.QueryBuilder
// the table.load method would not return the right type for the relation (child).
export type KnexQB<Model> = ReturnType<Wrapper<Model>['wrapped']>;
