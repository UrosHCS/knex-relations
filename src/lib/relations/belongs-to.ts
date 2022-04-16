import { Table } from "../table/table";
import { ID, Row } from "../types";
import { Relation } from "./relation";

export class BelongsTo<ParentModel extends Row, ChildModel extends Row> extends Relation<ParentModel, ChildModel> {
  constructor(
    protected parent: Table<ParentModel>,
    private child: Table<ChildModel>,
    protected relationName: string,
  ) {
    super();
  }

  public load(parentForeignIds: ID[]): Promise<ChildModel[]> {
    return this.queryFor(parentForeignIds);
  }

  public queryFor(parentForeignIds: ID[]) {
    return this.child.query().whereIn(this.child.primaryKey, parentForeignIds);
  }

  public async populate(parents: ParentModel[]): Promise<void> {
    const foreignKey = this.getForeignKeyName();

    const foreignIds = parents.map(parent => parent[foreignKey]);

    const children = await this.load(foreignIds as ID[]);

    this.mapChildrenToParents(parents, children);
  }

  public mapChildrenToParents(parents: ParentModel[], children: ChildModel[]): void {
    const childDictionary = this.buildDictionary(children);

    for (const parent of parents) {
      const parentPK = parent[this.parent.primaryKey] as ID;
      const child = childDictionary[parentPK];
      this.setRelation(parent, child || null);
    }
  }

  private setRelation(parent: ParentModel, child: ChildModel | null): void {
    // @ts-ignore
    parent[this.relationName] = child;
  }

  private buildDictionary(children: ChildModel[]): Record<ID, ChildModel> {
    const childPK = this.child.primaryKey;

    return children.reduce<Record<ID, ChildModel>>((dictionary, child) => {
      const childId = child[childPK] as string;
      dictionary[childId] = child;
      return dictionary;
    }, {});
  }

  /**
   * Get column name in the parent table that points to the child table.
   */
  private getForeignKeyName() {
    return `${this.child.singular}_id`;
  }
}