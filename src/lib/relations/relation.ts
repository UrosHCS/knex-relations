import { Knex } from "knex";
import { Table } from "../table/table";
import { ID, Row } from "../types";

export abstract class Relation<Parent extends Row, Child extends Row> {
  constructor(
    protected parentTable: Table<Parent>,
    protected childTable: Table<Child>,
    protected relationName: string,
  ) {}

  /**
   * Return a promise that resolves to an array of child models
   * based on the given ids. The ids are parent ids in a has-many
   * and belongs-to-many relations, and parent foreign key ids
   * in a belongs-to relation.
   */
  public abstract load(ids: ID[]): Promise<Child[]>;
  
  /**
   * Return a query builder that can be used to query for child models.
   */
  public abstract queryFor(ids: ID[]): Knex.QueryBuilder<Child>;

  /**
   * Assign the given children to the given parents. The key will be this.relationName.
   */
  public abstract mapChildrenToParents(parents: Parent[], children: Child[]): void;

  /**
   * Load children and assign them to the given parents.
   */
  public abstract populate(parents: Parent[]): Promise<void>;

  protected setRelation(parent: Parent, children: unknown): void {
    // @ts-ignore
    parent[this.relationName] = children;
  }

}