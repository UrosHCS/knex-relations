import { Knex } from "knex";
import { Table } from "../table/table";
import { Row } from "../types";
import { ID } from ".";

export abstract class Relation<Parent extends Row, Child extends Row, N extends string, Population extends Child | Child[]> {
  constructor(
    readonly parentTable: Table<Parent>,
    readonly childTable: Table<Child>,
    readonly relationName: N,
  ) {
    console.log({
      parent: parentTable.name,
      child: childTable.name,
    });
  }

  /**
   * Return a promise that resolves to an array of child models
   * based on the given ids. The ids are parent ids in a has-many
   * and belongs-to-many relations, and parent foreign key ids
   * in a belongs-to relation.
   */
  loadForIds(ids: ID[]): Promise<Child[]> {
    return this.queryFor(ids);
  }

  /**
   * Return a query builder that can be used to query for child models.
   */
  abstract queryFor(ids: ID[]): Knex.QueryBuilder<Child>;

  /**
   * Assign the given children to the given parents, where the key will be the relationName.
   */
  abstract mapChildrenToParents(parents: Parent[], children: Child[]): void;

  loadChildren(parents: Parent[]): Promise<Child[]> {
    const key = this.getParentRelationKey();
  
    const ids = parents.map(parent => parent[key]);

    return this.loadForIds(ids);
  }

  /**
   * Load children and assign them to the given parents.
   */
  async populate(parents: Parent[]): Promise<Array<Parent & { [key in N]: Population }>> {
    const children = await this.loadChildren(parents);

    this.mapChildrenToParents(parents, children);

    return parents;
  }

  /**
   * Get column name in the parent table that points to the child table.
   */
  protected abstract getParentRelationKey(): keyof Parent;

  protected setRelation(parent: Parent, children: unknown): void {
    // @ts-expect-error
    parent[this.relationName] = children;
  }
}