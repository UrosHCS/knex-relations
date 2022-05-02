import knex, { Knex } from "knex";
import { Row } from "../types";

export type FullQB<Model extends Row, QB extends QueryBuilder<Model>> = QB & Knex.QueryBuilder<Model, any>;

export type QBConstructor<Model extends Row, QB extends QueryBuilder<Model>> = new (table: string) => QB;

export function knexQueryBuilder<Model extends Row>(table: string) {
  return knex<Model>(table).queryBuilder();
}

export class QueryBuilder<Model extends Row> {
  qb: Knex.QueryBuilder<Model, any>;

  constructor(table: string) {
    this.qb = knexQueryBuilder(table);
  }
}

export function createQB<Model extends Row, QB extends QueryBuilder<Model>>(table: string, Constructor: QBConstructor<Model, QB>): QB & Knex.QueryBuilder<Model> {
  const qb = new Constructor(table);

  const proxy = new Proxy(qb, {
    get(qb, prop, receiver) {
      if (prop in qb) {
        return Reflect.get(qb, prop, receiver);
      }

      return Reflect.get(qb.qb, prop, receiver);
    }
  });

  return proxy as FullQB<Model, QB>;
}