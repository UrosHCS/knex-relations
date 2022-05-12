import { KnexQB } from './table';

export type Row = Record<string, unknown>;

export type QBCallback<Model, T> = (qb: KnexQB<Model>) => Promise<T[]>;
