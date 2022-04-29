import { Row } from "../types";
import { Relation } from "./relation";
import { ID } from ".";

export class BelongsTo<Parent extends Row, Child extends Row, N extends string> extends Relation<Parent, Child, N, Child> {
  queryFor(parentForeignIds: ID[]) {
    // TODO: remove " as string"
    return this.childTable.query().whereIn(this.childTable.primaryKey as string, parentForeignIds);
  }

  mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parentTable.primaryKey];
      const child = childDictionary[parentPK];
      this.setRelation(parent, child || null);
    }
  }

  private buildDictionary(children: Child[]): Record<ID, Child> {
    const childPK = this.childTable.primaryKey;

    return children.reduce<Record<ID, Child>>((dictionary, child) => {
      const childId = child[childPK];
      dictionary[childId] = child;

      return dictionary;
    }, {});
  }

  /**
   * Get column name in the parent table that points to the child table.
   */
  protected getParentRelationKey() {
    return `${this.childTable.singular}_id` as keyof Parent;
  }
}