import { KnexQB } from './table';

export type Row = Record<string, unknown>;

/**
 * Callback that accepts a knex query builder and returns a promise of results.
 */
export type QBCallback<Model, T> = (qb: KnexQB<Model>) => Promise<T[]>;

export type ChildShape<IsOne, T> = IsOne extends true ? T : T[];
