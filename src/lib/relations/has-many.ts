import { Row } from '../types';
import { HasOneOrMany } from './has-one-or-many';
import { ID } from '.';

export class HasMany<Parent extends Row, Child extends Row, N extends string> extends HasOneOrMany<
  Parent,
  Child,
  N,
  false
> {
  mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parentTable.primaryKey] as ID;
      const childrenOfParent = childDictionary[parentPK];
      this.setRelation(parent, childrenOfParent || []);
    }
  }

  isToOne(): false {
    return false;
  }

  // private buildDictionary(children: Child[]): Record<ID, Child[]> {
  //   const foreignKey = this.getForeignKeyName();

  //   return children.reduce<Record<string, Child[]>>((dictionary, child) => {
  //     const foreignValue = child[foreignKey] as ID;
  //     if (!dictionary[foreignValue]) {
  //       dictionary[foreignValue] = [];
  //     }
  //     dictionary[foreignValue].push(child);
  //     return dictionary;
  //   }, {});
  // }
}
