import { ID, Row } from "../types";
import { HasOneOrMany } from "./has-one-or-many";

export class HasMany<Parent extends Row, Child extends Row> extends HasOneOrMany<Parent, Child> {
  public mapChildrenToParents(parents: Parent[], children: Child[], relationName: keyof Parent): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parentTable.primaryKey] as ID;
      const childrenOfParent = childDictionary[parentPK];
      this.setRelation(relationName, parent, childrenOfParent || []);
    }
  }

  private buildDictionary(children: Child[]): Record<ID, Child[]> {
    const foreignKey = this.getForeignKeyName();

    return children.reduce<Record<string, Child[]>>((dictionary, child) => {
      const foreignValue = child[foreignKey] as string;
      if(!dictionary[foreignValue]) {
        dictionary[foreignValue] = [];
      }
      dictionary[foreignValue].push(child);
      return dictionary;
    }, {});
  }
}
