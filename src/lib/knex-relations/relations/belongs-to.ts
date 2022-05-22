import { Row, ID } from '..';

import { Relation } from './relation';
/**
 * many-to-one or one-to-one relation where the parent table has a foreign key to the child table.
 */
export class BelongsTo<Parent extends Row, Child extends Row, N extends string> extends Relation<
  Parent,
  Child,
  N,
  true
> {
  protected override isToOne: true = true;

  queryFor(parentForeignIds: ID[]) {
    return this.childTable.query().whereIn(this.childTable.primaryKey as string, parentForeignIds);
  }

  protected override getColumnForDictionaryKey(): string {
    return this.childTable.primaryKey as string;
  }

  /**
   * In many-to-many the parent's primary key is used as the foreign key in the pivot table.
   */
  protected override getParentRelationColumn() {
    return `${this.childTable.singular}_id` as keyof Parent;
  }
}
