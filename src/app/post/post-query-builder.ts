import { QueryBuilder } from "../../lib/table/query-builder";
import { Post, PostRelations, postsTable } from "./posts-table";

export class PostQueryBuilder extends QueryBuilder<Post, PostRelations> {
  constructor() {
    super(postsTable);
  }

  latest(column: string): this {
    this.base.orderBy(column, 'desc');
    return this;
  }
}
