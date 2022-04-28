import { ID, Row } from "../types";
import { Relation } from "./relation";

export abstract class HasOneOrMany<Parent extends Row, Child extends Row, N extends string, Population extends Child | Child[]> extends Relation<Parent, Child, N, Population> {
  queryFor(parentIds: ID[]) {
    // TODO: remove " as string"
    return this.childTable.query().whereIn(this.getForeignKeyName() as string, parentIds);
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
