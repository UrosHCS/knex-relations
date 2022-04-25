import knex from "knex";
import { BelongsTo } from "../relations/belongs-to";
import { BelongsToMany } from "../relations/belongs-to-many";
import { HasMany } from "../relations/has-many";
import { HasOne } from "../relations/has-one";
import { Relation } from "../relations/relation";
import { Row } from "../types";

type Relations<Parent> = Record<string, Relation<Parent, any>>;

export class Table<Model extends Row> {
  relations: Relations<Model>;

  constructor(
    public readonly name: string,
    public readonly singular: string,
    public readonly primaryKey: string = 'id',
    relationBuilder?: (table: Table<Model>) => Relations<Model>,
  ) {
    this.relations = relationBuilder ? relationBuilder(this) : {};
  }

  setRelations(relations: Relations<Model>): void {
    this.relations = relations;
  }

  getRelation<Child extends Row>(relationName: string): Relation<Model, Child> {
    const relation = this.relations[relationName];
    if (!relation) {
      throw new Error(`Relation ${relationName} does not exit on table ${this.name}`);
    }

    return relation;
  }

  hasMany<ChildModel extends Row>(childTable: Table<ChildModel>) {
    return new HasMany<Model, ChildModel>(this, childTable);
  }

  hasOne<ChildModel extends Row>(childTable: Table<ChildModel>) {
    return new HasOne<Model, ChildModel>(this, childTable);
  }

  belongsTo<ChildModel extends Row>(childTable: Table<ChildModel>) {
    return new BelongsTo<Model, ChildModel>(this, childTable);
  }

  belongsToMany<ChildModel extends Row>(childTable: Table<ChildModel>) {
    return new BelongsToMany<Model, ChildModel>(this, childTable);
  }

  query() {
    return knex<Model>(this.name);
  }

  async loadRelations(results: Model[], relationNames: string[]): Promise<void> {
    await Promise.all(relationNames.map(relationName => {
      this.loadRelation(results, relationName);
    }));
  }

  loadRelation<C, R extends string>(results: Model[], relationName: R): Promise<Array<Model & { [key in R]: C }>> {
    return this.getRelation(relationName).populate(results, relationName);
  }
}
