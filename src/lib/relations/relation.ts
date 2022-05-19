import { Knex } from 'knex';
import { Table } from '../table/table';
import { ChildShape, QBCallback, Row } from '../types';
import { ID } from '.';

export abstract class Relation<Parent extends Row, Child extends Row, N extends string, IsOne extends boolean> {
  /**
   * Boolean if the relation is a *-to-one relation.
   */
  protected abstract isToOne: IsOne;

  constructor(readonly parentTable: Table<Parent>, readonly childTable: Table<Child>, readonly relationName: N) {}

  /**
   * Return a query builder that resolves to an array of child models
   * based on the given ids. The ids are parent ids in a has-many
   * and belongs-to-many relations, and parent foreign key ids
   * in a belongs-to relation.
   */
  abstract queryFor(ids: ID[]): Knex.QueryBuilder<Child>;

  /**
   * Get column name in the parent table that points to the child table.
   */
  protected abstract getParentRelationKey(): keyof Parent;

  protected abstract getColumnForDictionaryKey(): string;

  /**
   * Load children and assign them to the given parents.
   */
  load(parents: Parent[]): Promise<Array<Parent & { [key in N]: ChildShape<IsOne, Child> }>>;
  load<T>(
    parents: Parent[],
    callback: QBCallback<Child, T>,
  ): Promise<Array<Parent & { [key in N]: ChildShape<IsOne, T> }>>;
  async load<T>(parents: Parent[], callback?: QBCallback<Child, T>) {
    const children = await this.loadChildren(parents, callback);

    this.mapChildrenToParents(parents, children as Child[]);

    return parents;
  }

  /**
   * Assign the given children to the given parents, where the key will be the relationName.
   */
  mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    const empty = this.emptyRelation();

    for (const parent of parents) {
      const value = parent[this.getParentRelationKey()] as ID;
      const children = childDictionary[value];
      this.setRelation(parent, children || empty);
    }
  }

  loadChildren<T>(parents: Parent[], callback?: QBCallback<Child, T>): Promise<Array<Child | T>> {
    const key = this.getParentRelationKey();

    const ids = parents.map(parent => parent[key] as ID);

    const qb = this.queryFor(ids);

    if (callback) {
      return callback(qb);
    }

    return qb;
  }

  protected buildDictionary(children: Child[]): Record<ID, ChildShape<IsOne, Child>> {
    const keyColumn = this.getColumnForDictionaryKey();

    const reducer = this.isToOne
      ? (d: Record<ID, Child>, c: Child) => this.singleChildDictionaryReducer(d, c, keyColumn)
      : (d: Record<ID, Child[]>, c: Child) => this.childArrayDictionaryReducer(d, c, keyColumn);

    // TODO: Remove as any
    return children.reduce<Record<ID, ChildShape<IsOne, Child>>>(reducer as any, {});
  }

  protected singleChildDictionaryReducer(
    dictionary: Record<ID, Child>,
    child: Child,
    keyColumn: string,
  ): Record<ID, Child> {
    const key = child[keyColumn] as ID;
    dictionary[key] = child;
    return dictionary;
  }

  protected childArrayDictionaryReducer(
    dictionary: Record<ID, Child[]>,
    child: Child,
    keyColumn: string,
  ): Record<ID, Child[]> {
    const key = child[keyColumn] as ID;
    if (!dictionary[key]) {
      dictionary[key] = [];
    }
    dictionary[key].push(child);
    return dictionary;
  }

  protected setRelation(parent: Parent, children: unknown): void {
    // @ts-expect-error - We are adding new properties here, which is not something that TS likes.
    parent[this.relationName] = children;
  }

  private emptyRelation() {
    return this.isToOne ? null : [];
  }
}
