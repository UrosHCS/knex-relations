import knex from "knex";
import { Row } from "../types";
import { RelationsMap, TableRelations } from "./table-relations";

export class Table<Model extends Row, R extends {} = {}> {
  relations?: TableRelations<Model, R>;

  constructor(
    public readonly name: string,
    public readonly singular: string,
    public readonly primaryKey: string = 'id',
  ) {}

  query() {
    return knex<Model>(this.name);
  }

  setRelations(relations: TableRelations<Model, R>): void {
    this.relations = relations;
  }
}
