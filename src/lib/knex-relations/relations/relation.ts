import { Knex } from 'knex';

import { Table, ChildShape, ID, QBCallback, Row } from '..';

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
  abstract queryForMany(ids: ID[]): Knex.QueryBuilder<Child>;

  /**
   * Return a query builder that resolves to an array of child models
   * based on the given id. For has-one, it resolves just one child.
   * The id is the parent id in a has-many and belongs-to-many
   * relations, and parent foreign key id in a belongs-to relation.
   */
  abstract queryForOne(ids: ID): Knex.QueryBuilder<Child>;

  /**
   * Get column name in the parent table that points to the child table.
   */
  protected abstract getParentRelationColumn(): keyof Parent;

  /**
   * Column in loaded child that will be used to build the dictionary. The
   * same column that corresponds to the parent's foreign key or id.
   *
   * Note: when the return type is "keyof Child", the ResolveChild<R[N]> will
   * not work in the Table.load() method. Wat?
   *
   * Also, in BelongsToMany, the returned colum is the joined column from the
   * pivot table, so that is another reason why the return type of this method
   * should not be "keyof Child".
   */
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
   * Load children and assign them to the given parent.
   */
  loadForOne(parent: Parent): Promise<Parent & { [key in N]: ChildShape<IsOne, Child> }>;
  loadForOne<T>(parent: Parent, callback: QBCallback<Child, T>): Promise<Parent & { [key in N]: ChildShape<IsOne, T> }>;
  async loadForOne<T>(parent: Parent, callback?: QBCallback<Child, T>) {
    const id = this.getIdValue(parent, this.getParentRelationColumn());

    let qb: any = this.queryForOne(id);

    if (callback) {
      qb = callback(qb);
    }

    this.setRelation(parent, (await qb) || this.emptyRelation());

    return parent;
  }

  /**
   * Assign the given children to the given parents, where the key will be the relationName.
   */
  mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    const empty = this.emptyRelation();

    for (const parent of parents) {
      const value = parent[this.getParentRelationColumn()] as ID;
      const children = childDictionary[value];
      this.setRelation(parent, children || empty);
    }
  }

  /**
   * Return a promise that resolves to an array of child models or any value returned from the callback
   */
  loadChildren<T>(parents: Parent[], callback?: QBCallback<Child, T>): Promise<Array<Child | T>> {
    const key = this.getParentRelationColumn();

    const ids = parents.map(parent => this.getIdValue(parent, key));

    const qb = this.queryForMany(ids);

    if (callback) {
      return callback(qb);
    }

    return qb;
  }

  /**
   * Build a hash map of children so that we can map them to parents in a more performant way.
   */
  protected buildDictionary(children: Child[]): Record<ID, ChildShape<IsOne, Child>> {
    const keyColumn = this.getColumnForDictionaryKey();

    const reducer = this.isToOne
      ? (d: Record<ID, Child>, c: Child) => this.singleChildDictionaryReducer(d, c, keyColumn)
      : (d: Record<ID, Child[]>, c: Child) => this.childArrayDictionaryReducer(d, c, keyColumn);

    // TODO: Remove as any
    return children.reduce<Record<ID, ChildShape<IsOne, Child>>>(reducer as any, {});
  }

  /**
   * Dictionary builder for *-to-one relations.
   */
  protected singleChildDictionaryReducer(
    dictionary: Record<ID, Child>,
    child: Child,
    keyColumn: keyof Child,
  ): Record<ID, Child> {
    const value = this.getIdValue(child, keyColumn);
    dictionary[value] = child;
    return dictionary;
  }

  /**
   * Dictionary builder for *-to-many relations.
   */
  protected childArrayDictionaryReducer(
    dictionary: Record<ID, Child[]>,
    child: Child,
    keyColumn: keyof Child,
  ): Record<ID, Child[]> {
    const value = this.getIdValue(child, keyColumn);
    if (!dictionary[value]) {
      dictionary[value] = [];
    }
    dictionary[value].push(child);
    return dictionary;
  }

  /**
   * Sets a new property on the given parent object. The property name is the relation name.
   * The property value is the given child/children.
   */
  protected setRelation(parent: Parent, children: unknown): void {
    // @ts-expect-error - We are adding new properties here, which is not something that TS likes.
    parent[this.relationName] = children;
  }

  /**
   * For *-to-one relations, the empty relation is null.
   * For *-to-many relations, the empty relation is an empty array.
   */
  private emptyRelation() {
    return this.isToOne ? null : [];
  }

  /**
   * Method that deals with casting the accessed property to ID
   */
  private getIdValue<T extends Parent | Child>(row: T, column: keyof T): ID {
    return row[column] as ID;
  }
}
