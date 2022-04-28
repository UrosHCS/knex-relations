import knex from "knex";
import { Row } from "../types";
import { RelationsMap, TableRelations } from "./table-relations";

export class Table<Model extends Row, R extends RelationsMap<Model> = any> {
  // Initialized so that it can't be undefined.
  relations: TableRelations<Model, R> = new TableRelations<Model, any>(this, {});

  constructor(
    public readonly name: string,
    public readonly singular: string,
    public readonly primaryKey: keyof Model = 'id',
  ) {}

  query() {
    return knex<Model>(this.name);
  }

  setRelations(relations: TableRelations<Model, R>): void {
    this.relations = relations;
  }
}
