import { Table } from "../lib/table/table";
import { usersTable } from "./users-table";

export interface Post {
  id: number;
  title: string;
  text: string;
  user_id: number;
}

export const table = new Table<Post>('posts', 'post', 'id');

const relations = {
  user: table.belongsTo(usersTable),
};

table.setRelations(relations);

export { table as postsTable };
