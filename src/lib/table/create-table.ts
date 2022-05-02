import { Knex } from "knex";
import { getDatabase } from ".";
import { Row } from "../types";
import { QBConstructor, QueryBuilder } from "./query-builder";
import { RelationBuilder, RelationsMap, Table } from "./table";

function resolveDb<Model>(config: TableConfig<Model> | undefined): Knex {
  if (!config || !config.db) {
    return getDatabase();
  }

  if (dbIsFunction(config.db)) {
    return config.db();
  }

  return config.db;
}


function dbIsFunction<Model>(db: TableConfig<Model>['db']): db is (() => Knex) {
  return typeof db === 'function';
}

export type TableConfig<Model, QB extends QueryBuilder<Model> = QueryBuilder<Model>> = {
  // Table's primary key. Default is "id".
  primaryKey?: keyof Model;
  // Database connection or a function that returns it.
  db?: Knex | (() => Knex);
  qb?: QBConstructor<Model, QB>
}

export function createTable<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>, QB extends QueryBuilder<Model> = never>(name: string, singular: string, relationBuilder?: RelationBuilder<Model, R, QB>, config?: TableConfig<Model, QB>): Table<Model, R> {
  const primaryKey = config?.primaryKey ?? 'id';

  return new Table(name, singular, primaryKey, resolveDb(config), config?.qb, relationBuilder);
}
