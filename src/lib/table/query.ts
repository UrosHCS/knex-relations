import knex from "knex";
import { Row } from "../types";

export class QueryBuilder<Model extends Row> {
  query(table: string) {
    return knex<Model>(table);
  }
}
