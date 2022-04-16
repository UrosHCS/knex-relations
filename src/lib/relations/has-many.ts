import { Table } from "../table/table";
import { ID, Row } from "../types";
import { Relation } from "./relation";

export class HasMany<ParentModel extends Row, ChildModel extends Row> extends Relation<ParentModel, ChildModel> {
  constructor(
    protected parent: Table<ParentModel>,
    private child: Table<ChildModel>,
    protected relationName: string,
  ) {
    super();
  }

  public load(parentIds: ID[]): Promise<ChildModel[]> {
    return this.queryFor(parentIds);
  }

  public queryFor(parentIds: ID[]) {
    return this.child.query().whereIn(this.getForeignKeyName(), parentIds);
  }

  public async populate(parents: ParentModel[]): Promise<void> {
    const parentIds = parents.map(parent => parent[this.parent.primaryKey]);

    const children = await this.load(parentIds as ID[]);

    this.mapChildrenToParents(parents, children);
  }

  public mapChildrenToParents(parents: ParentModel[], children: ChildModel[]): void {
    this.initRelation(parents);

    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parent.primaryKey] as ID;
      const childrenOfParent = childDictionary[parentPK];

      if (childrenOfParent && childrenOfParent.length) {
        this.setRelation(parent, childrenOfParent);
      }
    }
  }

  private setRelation(parent: ParentModel, children: ChildModel[]): void {
    // @ts-ignore
    parent[this.relationName] = children;
  }

  private initRelation(parents: ParentModel[]): void {
    parents.forEach(parent => {
      this.setRelation(parent, []);
    });
  }

  private buildDictionary(children: ChildModel[]): Record<ID, ChildModel[]> {
    const foreignKey = this.getForeignKeyName();

    return children.reduce<Record<string, ChildModel[]>>((dictionary, child) => {
      const foreignValue = child[foreignKey] as string;
      if(!dictionary[foreignValue]) {
        dictionary[foreignValue] = [];
      }
      dictionary[foreignValue].push(child);
      return dictionary;
    }, {});
  }

  /**
   * Get column name in the child table that points to the parent table.
   */
  private getForeignKeyName() {
    return `${this.parent.singular}_id`;
  }
}