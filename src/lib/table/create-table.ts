import { Knex } from "knex";
import { DB, getDatabase } from ".";
import { Row } from "../types";
import { RelationBuilder, RelationsMap, Table } from "./table";

function resolveDb<Model>(db: TableConfig<Model>['db']): Knex {
  if (!db) {
    return getDatabase();
  }

  return dbIsFunction(db) ? db() : db;
}


function dbIsFunction<Model>(db: TableConfig<Model>['db']): db is (() => Knex) {
  return typeof db === 'function';
}

export type TableConfig<Model> = {
  // Table's primary key. Default is "id".
  primaryKey?: keyof Model;
  // Database connection or a function that returns it.
  db?: DB | (() => DB);
}

export function createTable<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>>(name: string, singular: string, relationBuilder?: RelationBuilder<Model, R>, config?: TableConfig<Model>): Table<Model, R> {
  const primaryKey = config?.primaryKey ?? 'id';

  return new Table(name, singular, primaryKey, resolveDb(config?.db), relationBuilder);
}
