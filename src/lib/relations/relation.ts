import { Knex } from "knex";
import { Table } from "../table/table";
import { ID, Row } from "../types";

export abstract class Relation<Parent extends Row, Child extends Row> {
  constructor(
    protected parentTable: Table<Parent>,
    protected childTable: Table<Child>,
  ) {}

  /**
   * Return a promise that resolves to an array of child models
   * based on the given ids. The ids are parent ids in a has-many
   * and belongs-to-many relations, and parent foreign key ids
   * in a belongs-to relation.
   */
  abstract load(ids: ID[]): Promise<Child[]>;
  
  /**
   * Return a query builder that can be used to query for child models.
   */
  abstract queryFor(ids: ID[]): Knex.QueryBuilder<Child>;

  /**
   * Assign the given children to the given parents, where the key will be the relationName.
   */
  abstract mapChildrenToParents(parents: Parent[], children: Child[], relationName: string): void;

  /**
   * Load children and assign them to the given parents.
   */
  async populate<C = unknown, R extends string = never>(parents: Parent[], relationName: R): Promise<Array<Parent & { [key in R]: C }>> {
    const key = this.getParentRelationKey();
  
    const ids = parents.map(parent => parent[key]);

    const children = await this.load(ids as ID[]);

    this.mapChildrenToParents(parents, children, relationName);

    return parents;
  }

  protected abstract getParentRelationKey(): string;

  protected setRelation(relationName: keyof Parent, parent: Parent, children: unknown): void {
    parent[relationName] = children as Parent[keyof Parent];
  }
}