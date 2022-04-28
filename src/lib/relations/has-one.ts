import { ID, Row } from "../types";
import { HasOneOrMany } from "./has-one-or-many";

export class HasOne<Parent extends Row, Child extends Row, R extends string> extends HasOneOrMany<Parent, Child, R, Child> {
  public mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parentTable.primaryKey];
      const child = childDictionary[parentPK];
      this.setRelation(parent, child || null);
    }
  }

  private buildDictionary(children: Child[]): Record<ID, Child> {
    const foreignKey = this.getForeignKeyName();

    return children.reduce<Record<ID, Child>>((dictionary, child) => {
      const foreignValue = child[foreignKey];
      dictionary[foreignValue] = child;
      return dictionary;
    }, {});
  }
}