import { Knex } from "knex";
import { Table } from "../table/table";
import { ID, Row } from "../types";

export abstract class Relation<Parent extends Row, Child extends Row, R extends string, Population extends Child | Child[]> {
  constructor(
    public readonly parentTable: Table<Parent>,
    public readonly childTable: Table<Child>,
    public readonly relationName: R,
  ) {}

  /**
   * Return a promise that resolves to an array of child models
   * based on the given ids. The ids are parent ids in a has-many
   * and belongs-to-many relations, and parent foreign key ids
   * in a belongs-to relation.
   */
   public load(ids: ID[]): Promise<Child[]> {
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

    return this.load(ids as ID[]);
  }

  /**
   * Load children and assign them to the given parents.
   */
  async populate(parents: Parent[]): Promise<Array<Parent & { [key in R]: Population}>> {
    this.mapChildrenToParents(parents, await this.loadChildren(parents));

    return parents;
  }

  /**
   * Get column name in the parent table that points to the child table.
   */
  protected abstract getParentRelationKey(): string;

  protected setRelation(parent: Parent, children: unknown): void {
    // @ts-expect-error
    parent[this.relationName] = children;
  }
}