import { UserQueryBuilder } from "./user-query-builder";
import { userRepository } from "./user-repository";
import { usersTable } from "./users-table";

export const userModule = {
  repo: userRepository,
  qb: () => new UserQueryBuilder(),
  table: usersTable.init(),
};
