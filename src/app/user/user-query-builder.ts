import { QueryBuilder } from "../../lib/table/query-builder";
import { User, UserRelations, usersTable } from "./users-table";

export class UserQueryBuilder extends QueryBuilder<User, UserRelations> {
  constructor() {
    super(usersTable);
    this.notSoftlyDeleted();
  }
}