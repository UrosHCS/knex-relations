import knex from "knex";
import { Row } from "../types";

export class QueryBuilder<Model extends Row<keyof Model>> {
  query(table: string) {
    return knex<Model>(table);
  }
}
