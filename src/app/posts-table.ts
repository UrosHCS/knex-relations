import { Table } from "../lib/table/table";
import { usersTable } from "./users-table";

export interface Post {
  id: number;
  title: string;
  text: string;
  user_id: number;
}

export const postsTable = new Table<Post>('posts', 'post', 'id', table => {
  table.belongsTo('user', usersTable);
});
