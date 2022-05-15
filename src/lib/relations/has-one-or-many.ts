import { Row } from '../types';
import { Relation } from './relation';
import { ID } from '.';

export abstract class HasOneOrMany<
  Parent extends Row,
  Child extends Row,
  N extends string,
  IsOne extends boolean,
> extends Relation<Parent, Child, N, IsOne> {
  queryFor(parentIds: ID[]) {
    // TODO: remove " as string"
    return this.childTable.query().whereIn(this.getForeignKeyName() as string, parentIds);
  }

  protected getColumnForDictionaryKey(): string {
    return this.getForeignKeyName() as string;
  }

  /**
   * Get column name in the child table that points to the parent table.
   */
  protected getForeignKeyName() {
    return `${this.parentTable.singular}_id` as keyof Child;
  }

  protected getParentRelationKey() {
    return this.parentTable.primaryKey;
  }
}
