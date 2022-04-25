import knex from "knex";
import { Row } from "../types";

export class Table<Model extends Row> {
  constructor(
    public readonly name: string,
    public readonly singular: string,
    public readonly primaryKey: string = 'id',
  ) {}

  query() {
    return knex<Model>(this.name);
  }
}
