import knex, { Knex } from "knex";
import { Relation } from "../relations/relation";
import { Row } from "../types";
import { Table } from "./table";

export type RelationsMap<Parent> = Record<string, Relation<Parent, any, string, any>>;

export class TableRelations<M extends Row, R extends RelationsMap<M>> {
  constructor(
    public readonly table: Table<M>,
    public readonly map: R,
  ) {}

  async populateMany<N extends keyof R>(results: M[], relationNames: N[]): Promise<void> {
    await Promise.all(relationNames.map(relationName => {
      this.populate(results, relationName);
    }));
  }

  getRelation<N extends keyof R>(relationName: N): R[N] {
    const relation =  this.map[relationName];

    if (!relation) {
      throw new Error(`Relation "${relationName}" does not exist.`);
    }

    return relation;
  }

  populate<N extends keyof R>(results: M[], relationName: N): ReturnType<R[N]['populate']> {
    const relation = this.getRelation<N>(relationName);
    // @ts-expect-error
    return relation.populate(results);
  }

  async populateNested<T extends M[]>(results: M[], nestedRelationNames: string): Promise<T> {
    const relationNames = nestedRelationNames.split('.');

    // relationNames.length should never be zero because .split()
    // always returns an array with at least one element

    return this.doLoadNested(results, relationNames);
  }

  private async doLoadNested<T extends M[]>(results: M[], nestedRelationNames: string[]): Promise<T> {
    if (nestedRelationNames.length === 0) {
      return results as T;
    }

    const relationName = nestedRelationNames[0];

    if (relationName === '') {
      return results as T;
    }

    if (nestedRelationNames.length === 1) {
      return this.populate(results, relationName) as Promise<T>;
    }

    const relation = this.getRelation(relationName);

    const children = await relation.loadChildren(results);

    if (!relation.childTable.relations) {
      throw new Error(`Can't load "${relationName}" relation, relations not defined on ${relation.childTable.name} table.`);
    }

    relation.childTable.relations.doLoadNested(children, nestedRelationNames.slice(1));

    relation.mapChildrenToParents(results, children);

    return results as T;
  }
}