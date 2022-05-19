import { Row } from '../types';
import { Relation } from './relation';
import { ID } from '.';

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

  protected override getParentRelationKey() {
    return `${this.childTable.singular}_id` as keyof Parent;
  }
}
