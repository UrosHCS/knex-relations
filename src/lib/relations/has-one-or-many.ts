import { ID, Row } from "../types";
import { Relation } from "./relation";

export abstract class HasOneOrMany<Parent extends Row, Child extends Row> extends Relation<Parent, Child> {
  public load(parentIds: ID[]): Promise<Child[]> {
    return this.queryFor(parentIds);
  }

  public queryFor(parentIds: ID[]) {
    return this.childTable.query().whereIn(this.getForeignKeyName(), parentIds);
  }

  /**
   * Get column name in the child table that points to the parent table.
   */
  protected getForeignKeyName() {
    return `${this.parentTable.singular}_id`;
  }

  protected getParentRelationKey() {
    return this.parentTable.primaryKey;
  }
}