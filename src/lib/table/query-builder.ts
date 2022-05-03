import { Knex } from "knex";
import { KnexQB, RelationsMap, Table } from ".";
import { Row } from "../types";

export type FullQB<Model extends Row, QB> = QB & Knex.QueryBuilder<Model, any>;

export type QBConstructor<Model extends Row, R extends RelationsMap<Model>, QB extends QueryBuilder<Model, R>> = new () => QB;

export abstract class QueryBuilder<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>> {
  base: KnexQB<Model>;

  constructor(readonly table: Table<Model, R>) {
    this.base = this.table.query();
  }

  relation(relationName: keyof R) {
    return this.table.getRelation(relationName);
  }
}

export function createQB<Model extends Row, R extends RelationsMap<Model>, QB extends QueryBuilder<Model, R>>(Constructor: QBConstructor<Model, R, QB>): FullQB<Model, QB> {
  const qb = new Constructor();

  const proxy: QB = new Proxy(qb, {
    get(qb, prop, receiver) {
      // If the property exists in the query builder, just return it.
      if (prop in qb) {
        return Reflect.get(qb, prop, receiver);
      }

      const knexFn = Reflect.get(qb.base, prop, receiver);

      // If the property is a function, we need to proxy it also.
      if (typeof knexFn === 'function') {
        return new Proxy(knexFn, {
          apply(knexFn, thisArg, argumentsList) {
            const returnValue = Reflect.apply(knexFn, thisArg, argumentsList);
            // If the knex function returns the knex query builder instance (this), we will return
            // the wrapper query builder because we can assume that we want to chain methods.
            if (returnValue === qb.base) {
              return proxy;
            }

            return returnValue;
          }
        });
      }

      // Here we know that the property is not a function, so we can just return it.
      return knexFn;
    }
  });

  return proxy as FullQB<Model, QB>;
}