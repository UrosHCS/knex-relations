import { Row } from '../types';
import { Relation } from './relation';
import { ID } from '.';
import { Knex } from 'knex';

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
        `${pivotTable}.${this.getChildForeignKey()}`,
        '=',
        `${this.childTable.name}.${this.childTable.primaryKey}`,
      )
      .whereIn(`${pivotTable}.${this.getParentForeignKey()}`, parentIds);
  }

  protected override getColumnForDictionaryKey(): string {
    return this.getParentForeignKey();
  }

  protected override getParentRelationKey() {
    return this.parentTable.primaryKey;
  }

  /**
   * Get column name in pivot table that points to the parent table.
   */
  private getParentForeignKey() {
    return `${this.parentTable.singular}_id`;
  }

  /**
   * Get column name in pivot table that points to the child table.
   */
  private getChildForeignKey() {
    return `${this.childTable.singular}_id`;
  }

  /**
   * Generate pivot table name by joining sorted parent and child table names.
   */
  private getPivotTableName(): string {
    return [this.parentTable.name, this.childTable.name].sort().join('_');
  }
}
