import { Knex } from "knex";
import { getDatabase } from ".";
import { Row } from "../types";
import { RelationBuilder, RelationsMap, Table } from "./table";

function resolveDb<Model>(config: RelationConfig<Model> | undefined): Knex {
  if (!config || !config.db) {
    return getDatabase();
  }

  if (dbIsFunction(config.db)) {
    return config.db();
  }

  return config.db;
}


function dbIsFunction<Model>(db: RelationConfig<Model>['db']): db is (() => Knex) {
  return typeof db === 'function';
}

export type RelationConfig<Model> = {
  // Table's primary key. Default is "id".
  primaryKey?: keyof Model;
  // Database connection or a function that returns it.
  db?: Knex | (() => Knex);
}

export function createTable<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>>(name: string, singular: string, relationBuilder?: RelationBuilder<Model, R>, config?: RelationConfig<Model>): Table<Model, R> {
  const primaryKey = config?.primaryKey ?? 'id';

  return new Table(name, singular, primaryKey, resolveDb(config), relationBuilder);
}
