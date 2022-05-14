import { Row } from '../types';
import { HasOneOrMany } from './has-one-or-many';
import { ID } from '.';

export class HasOne<
  Parent extends Row,
  Child extends Row,
  N extends string,
  IsOne extends boolean = true,
> extends HasOneOrMany<Parent, Child, N, IsOne> {
  mapChildrenToParents(parents: Parent[], children: Child[]): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parentTable.primaryKey] as ID;
      const child = childDictionary[parentPK];
      this.setRelation(parent, child || null);
    }
  }

  private buildDictionary(children: Child[]): Record<ID, Child> {
    const foreignKey = this.getForeignKeyName();

    return children.reduce<Record<ID, Child>>((dictionary, child) => {
      const childFK = child[foreignKey] as ID;
      dictionary[childFK] = child;
      return dictionary;
    }, {});
  }
}
