import { ID, Row } from "../types";
import { HasOneOrMany } from "./has-one-or-many";

export class HasMany<Parent extends Row<keyof Parent>, Child extends Row<keyof Child>, R extends string> extends HasOneOrMany<Parent, Child, R, Child[]> {
  public mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parentTable.primaryKey];
      const childrenOfParent = childDictionary[parentPK];
      this.setRelation(parent, childrenOfParent || []);
    }
  }

  private buildDictionary(children: Child[]): Record<ID, Child[]> {
    const foreignKey = this.getForeignKeyName();

    return children.reduce<Record<string, Child[]>>((dictionary, child) => {
      const foreignValue = child[foreignKey];
      if(!dictionary[foreignValue]) {
        dictionary[foreignValue] = [];
      }
      dictionary[foreignValue].push(child);
      return dictionary;
    }, {});
  }
}
