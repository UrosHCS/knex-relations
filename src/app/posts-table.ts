import { belongsTo } from "../lib/relations";
import { Table } from "../lib/table/table";
import { usersTable } from "./users-table";

export interface Post {
  id: number;
  title: string;
  text: string;
  user_id: number;
}

export const postsTable = new Table<Post>('posts', 'post', 'id');

const relations = {
  user: belongsTo(postsTable, usersTable, 'user'),
};

const schema = { table: postsTable, relations };

const posts: Post[] = [];

const populatedPosts = schema.relations.user.populate(posts);
