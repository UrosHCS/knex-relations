import { Knex } from 'knex';
import { Table } from '../table/table';
import { QBCallback, Row } from '../types';
import { ID } from '.';

export abstract class Relation<Parent extends Row, Child extends Row, N extends string, IsOne extends boolean> {
  constructor(readonly parentTable: Table<Parent>, readonly childTable: Table<Child>, readonly relationName: N) {
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

  loadChildren<T>(parents: Parent[], callback?: QBCallback<Child, T>): Promise<Array<Child | T>> {
    const key = this.getParentRelationKey();

    const ids = parents.map(parent => parent[key] as ID);

    const qb = this.queryFor(ids);

    if (callback) {
      return callback(qb);
    }

    return qb;
  }

  /**
   * Load children and assign them to the given parents.
   */
  load(parents: Parent[]): Promise<Array<Parent & { [key in N]: IsOne extends true ? Child : Child[] }>>;
  load<T>(
    parents: Parent[],
    callback: QBCallback<Child, T>,
  ): Promise<Array<Parent & { [key in N]: IsOne extends true ? T : T[] }>>;
  async load<T>(parents: Parent[], callback?: QBCallback<Child, T>) {
    const children = await this.loadChildren(parents, callback);

    this.mapChildrenToParents(parents, children as Child[]);

    return parents;
  }

  /**
   * Get column name in the parent table that points to the child table.
   */
  protected abstract getParentRelationKey(): keyof Parent;

  protected setRelation(parent: Parent, children: unknown): void {
    // @ts-expect-error - We are adding new properties here, which is not something that TS likes.
    parent[this.relationName] = children;
  }
}
