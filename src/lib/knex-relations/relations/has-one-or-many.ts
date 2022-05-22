import { Row, ID } from '..';

import { Relation } from './relation';

export abstract class HasOneOrMany<
  Parent extends Row,
  Child extends Row,
  N extends string,
  IsOne extends boolean,
> extends Relation<Parent, Child, N, IsOne> {
  queryFor(parentIds: ID[]) {
    return this.childTable.query().whereIn(this.getForeignKeyName(), parentIds);
  }

  protected override getColumnForDictionaryKey(): string {
    return this.getForeignKeyName();
  }

  protected override getParentRelationColumn() {
    return this.parentTable.primaryKey;
  }

  /**
   * Get column name in the child table that points to the parent table.
   */
  private getForeignKeyName() {
    return `${this.parentTable.singular}_id`;
  }
}
