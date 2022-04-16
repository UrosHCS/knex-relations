import knex from "knex";
import { BelongsTo } from "../relations/belongs-to";
import { HasMany } from "../relations/has-many";
import { Relation } from "../relations/relation";
import { Row } from "../types";

export class Table<Model extends Row> {
  relations: Record<string, Relation<Model, any>> = {};

  constructor(
    public readonly name: string,
    public readonly singular: string,
    public readonly primaryKey: string = 'id',
    private relationBuilder?: (table: Table<Model>) => void
  ) {}

  init() {
    if (this.relationBuilder) {
      this.relationBuilder(this);
    }
  }

  fullPK() {
    return `${this.name}.${this.primaryKey}`;
  }

  hasMany<ChildModel extends Row>(relationName: string, childTable: Table<ChildModel>): void {
    this.relations[relationName] = new HasMany<Model, ChildModel>(this, childTable, relationName);
  }

  belongsTo<ChildModel extends Row>(relationName: string, childTable: Table<ChildModel>): void {
    this.relations[relationName] = new BelongsTo<Model, ChildModel>(this, childTable, relationName);
  }

  // hasOne, belongsToMany

  query() {
    return knex<Model>(this.name);
  }

  async loadRelations(results: Model[], relationNames: string[]): Promise<void> {
    await Promise.all(relationNames.map(relationName => {
      this.loadRelation(results, relationName);
    }));
  }

  loadRelation(results: Model[], relationName: string): Promise<void> {
    const relation = this.relations[relationName];
    if (!relation) {
      throw new Error(`Relation ${relationName} does not exit on table ${this.name}`);
    }

    return relation.populate(results);
  }
}