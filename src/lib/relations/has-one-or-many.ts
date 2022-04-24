import { ID, Row } from "../types";
import { Relation } from "./relation";

export abstract class HasOneOrMany<Parent extends Row, Child extends Row> extends Relation<Parent, Child> {
  public load(parentIds: ID[]): Promise<Child[]> {
    return this.queryFor(parentIds);
  }

  public queryFor(parentIds: ID[]) {
    return this.childTable.query().whereIn(this.getForeignKeyName(), parentIds);
  }

  public async populate(parents: Parent[], relationName: keyof Parent): Promise<void> {
    const parentIds = parents.map(parent => parent[this.parentTable.primaryKey]);

    const children = await this.load(parentIds as ID[]);

    this.mapChildrenToParents(parents, children, relationName);
  }

  /**
   * Get column name in the child table that points to the parent table.
   */
  protected getForeignKeyName() {
    return `${this.parentTable.singular}_id`;
  }
}