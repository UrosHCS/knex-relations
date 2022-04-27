import knex from "knex";
import { Row } from "../types";
import { RelationsMap, TableRelations } from "./table-relations";

export class Table<Model extends Row<string>, R extends RelationsMap<Model, keyof R> = {}> {
  // Initialized so that it can't be undefined.
  relations: TableRelations<Model, R> = new TableRelations(this, {} as R);

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
