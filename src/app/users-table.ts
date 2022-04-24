import { Table } from "../lib/table/table";
import { postsTable } from "./posts-table";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const usersTable = new Table<User>('users', 'user', 'id');

usersTable.setRelations({
  posts: usersTable.hasMany(postsTable),
});
