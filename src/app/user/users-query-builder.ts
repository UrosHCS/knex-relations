import { QueryBuilder } from "../../lib/table/query-builder";
import { User } from "./users-table";

export class UsersQueryBuilder extends QueryBuilder<User> {
  latest(column: keyof User = 'id') {
    return this.qb.orderBy(column, 'desc');
  }
}
