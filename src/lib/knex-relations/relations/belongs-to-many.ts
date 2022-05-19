import { Knex } from 'knex';

import { Row, ID, Relation } from '..';

/**
 * many-to-many relation
 */
export class BelongsToMany<Parent extends Row, Child extends Row, N extends string> extends Relation<
  Parent,
  Child,
  N,
  false
> {
  protected override isToOne: false = false;

  queryFor(parentIds: ID[]): Knex.QueryBuilder<Child> {
    const pivotTable = this.getPivotTableName();

    return this.childTable
      .query()
      .join(
        pivotTable,
        `${pivotTable}.${this.getPivotChildColumn()}`,
        '=',
        `${this.childTable.name}.${this.childTable.primaryKey}`,
      )
      .whereIn(`${pivotTable}.${this.getPivotParentColumn()}`, parentIds);
  }

  protected override getColumnForDictionaryKey(): string {
    return this.getPivotParentColumn();
  }

  /**
   * In many-to-many the parent's primary key is used as the foreign key in the pivot table.
   */
  protected override getParentRelationColumn() {
    return this.parentTable.primaryKey;
  }

  /**
   * Get column name in pivot table that points to the parent table.
   */
  private getPivotParentColumn() {
    return `${this.parentTable.singular}_id`;
  }

  /**
   * Get column name in pivot table that points to the child table.
   */
  private getPivotChildColumn() {
    return `${this.childTable.singular}_id`;
  }

  /**
   * Generate pivot table name by joining sorted parent and child table names.
   */
  private getPivotTableName(): string {
    return [this.parentTable.name, this.childTable.name].sort().join('_');
  }
}
