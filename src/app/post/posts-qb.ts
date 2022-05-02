import { QueryBuilder } from "../../lib/table/query-builder";
import { Post } from "./posts-table";

export class PostsQueryBuilder extends QueryBuilder<Post> {
  latest(column: string) {
    return this.qb.orderBy(column, 'desc');
  }
}