import { Table } from "../lib/table/table";
import { Post, postsTable } from "./posts-table";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const table = new Table<User>('users', 'user', 'id');

const relations = {
  posts: table.hasMany(postsTable),
  friends: table.belongsToMany(table),
};

table.setRelations(relations)

export { table as usersTable };
