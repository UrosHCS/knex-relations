import { Table } from "../lib/table/table.js";
import { postsTable } from "./posts-table.js";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const usersTable = new Table<User>('users', 'user', 'id', table => {
  table.hasMany('posts', postsTable);
});
