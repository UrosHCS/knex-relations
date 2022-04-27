import { ID, Row } from "../types";
import { Relation } from "./relation";

export abstract class HasOneOrMany<Parent extends Row<keyof Parent>, Child extends Row<keyof Child>, R extends string, Population extends Child | Child[]> extends Relation<Parent, Child, R, Population> {
  public queryFor(parentIds: ID[]) {
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