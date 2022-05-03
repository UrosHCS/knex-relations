import { belongsTo } from "../../lib/relations";
import { User, usersTable } from "../user/users-table";
import { BelongsTo } from "../../lib/relations/belongs-to";
import { createTable, Table } from "../../lib/table";

export interface Post {
  id: number;
  title: string;
  text: string;
  user_id: number;
}

export type PostRelations = {
  user: BelongsTo<Post, User, 'user'>;
};

export const postsTable: Table<Post, PostRelations> = createTable('posts', 'post', () => ({
  user: belongsTo(postsTable, usersTable, 'user'),
}));
