import knex, { Knex } from "knex";
import { DB } from ".";
import { Row } from "../types";

export type FullQB<Model extends Row, QB extends QueryBuilder<Model>> = QB & Knex.QueryBuilder<Model, any>;

export type QBConstructor<Model extends Row, QB extends QueryBuilder<Model>> = new (db: DB, table: string) => QB;

export function knexQueryBuilder<Model extends Row>(db: DB, table: string) {
  return db<Model>(table);
}

export class QueryBuilder<Model extends Row> {
  qb: Knex.QueryBuilder<Model, any>;

  constructor(db: DB, table: string) {
    this.qb = knexQueryBuilder(db, table);
  }
}

export function createQB<Model extends Row, QB extends QueryBuilder<Model>>(table: string, db: DB, Constructor: QBConstructor<Model, QB>): QB & Knex.QueryBuilder<Model> {
  const qb = new Constructor(db, table);

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