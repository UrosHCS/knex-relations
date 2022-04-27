import { Relation } from "../relations/relation";
import { Row } from "../types";
import { Table } from "./table";

export type RelationsMap<Parent, T extends string | number | symbol> = Record<T, Relation<Parent, any, string, any>>;

export class TableRelations<Model extends Row<keyof Model>, R extends RelationsMap<Model, keyof R>> {
  constructor(
    public readonly table: Table<Model>,
    public readonly map: R,
  ) {}

  async populateMany(results: Model[], relationNames: string[]): Promise<void> {
    await Promise.all(relationNames.map(relationName => {
      this.populate(results, relationName);
    }));
  }

  getRelation(relationName: string): R[keyof R] {
    const relation = this.map[relationName as keyof R];

    if (!relation) {
      throw new Error(`Relation "${relationName}" does not exist.`);
    }

    return relation;
  }

  populate(results: Model[], relationName: string): ReturnType<R[keyof R]['populate']> {
    const relation = this.getRelation(relationName);
    // @ts-expect-error
    return relation.populate(results);
  }

  async populateNested<T extends Model[]>(results: Model[], nestedRelationNames: string): Promise<T> {
    const relationNames = nestedRelationNames.split('.');

    // relationNames.length should never be zero because .split()
    // always returns an array with at least one element

    return this.doLoadNested(results, relationNames);
  }

  private async doLoadNested<T extends Model[]>(results: Model[], nestedRelationNames: string[]): Promise<T> {
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

    relation.childTable.relations.doLoadNested(children, nestedRelationNames.slice(1));

    relation.mapChildrenToParents(results, children);

    return results as T;
  }
}