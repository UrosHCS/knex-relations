import { ID, Row } from "../types";
import { Relation } from "./relation";

export class BelongsTo<Parent extends Row, Child extends Row, R extends string> extends Relation<Parent, Child, R, Child> {
  public load(parentForeignIds: ID[]): Promise<Child[]> {
    return this.queryFor(parentForeignIds);
  }

  public queryFor(parentForeignIds: ID[]) {
    return this.childTable.query().whereIn(this.childTable.primaryKey, parentForeignIds);
  }

  public mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parentTable.primaryKey] as ID;
      const child = childDictionary[parentPK];
      this.setRelation(parent, child || null);
    }
  }

  private buildDictionary(children: Child[]): Record<ID, Child> {
    const childPK = this.childTable.primaryKey;

    return children.reduce<Record<ID, Child>>((dictionary, child) => {
      const childId = child[childPK] as ID;
      dictionary[childId] = child;

      return dictionary;
    }, {});
  }

  /**
   * Get column name in the parent table that points to the child table.
   */
  protected getParentRelationKey() {
    return `${this.childTable.singular}_id`;
  }
}