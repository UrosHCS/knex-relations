import { Knex } from 'knex';

import { Row, ID } from '..';

import { Relation } from './relation';

export abstract class HasOneOrMany<
  Parent extends Row,
  Child extends Row,
  N extends string,
  IsOne extends boolean,
> extends Relation<Parent, Child, N, IsOne> {
  override queryForMany(parentIds: ID[]) {
    return this.childTable.query().whereIn(this.getForeignKeyName(), parentIds);
  }

  override queryForOne(parentId: ID): Knex.QueryBuilder<Child> {
    return this.childTable.query().where(this.getForeignKeyName(), parentId);
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
