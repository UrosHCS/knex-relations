import knex from "knex";
import { Relation } from "../relations/relation";
import { Row } from "../types";

type Relations<Parent> = Record<string, Relation<Parent, any, string, any>>;

export class Table<Model extends Row> {
  constructor(
    public readonly name: string,
    public readonly singular: string,
    public readonly primaryKey: string = 'id',
  ) {}

  query() {
    return knex<Model>(this.name);
  }

  // async loadRelations(results: Model[], relationNames: string[]): Promise<void> {
  //   await Promise.all(relationNames.map(relationName => {
  //     this.loadRelation(results, relationName);
  //   }));
  // }

  // loadRelation<C, R extends string>(results: Model[], relationName: R): Promise<Array<Model & { [key in R]: C }>> {
  //   return this.getRelation(relationName).populate(results, relationName);
  // }
}
