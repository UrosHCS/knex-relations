import { Knex } from "knex";
import { Table } from "../table/table";
import { ID, Row } from "../types";

export abstract class Relation<ParentModel extends Row, ChildModel extends Row> {
  protected abstract parent: Table<ParentModel>;
  protected abstract relationName: string;

  public abstract load(parentIds: ID[]): Promise<ChildModel[]>;
  public abstract queryFor(ids: ID[]): Knex.QueryBuilder;
  public abstract mapChildrenToParents(parents: ParentModel[], children: ChildModel[]): void;
  public abstract populate(parents: ParentModel[]): Promise<void>;
}