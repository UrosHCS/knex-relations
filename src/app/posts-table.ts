import { belongsTo } from "../lib/relations";
import { Schema } from "../lib/table/schema";
import { Table } from "../lib/table/table";
import { usersTable } from "./users-table";

export interface Post {
  id: number;
  title: string;
  text: string;
  user_id: number;
}

export const postsTable = new Table<Post>('posts', 'post', 'id');

const postsSchema = new Schema(postsTable, {
  user: belongsTo(postsTable, usersTable, 'user'),
});

const posts: Post[] = [];

(async () => {
  const populatedPosts = postsSchema.relations.user.populate(posts);
  const populatedPosts2 = postsSchema.loadRelation(posts, 'user');
})
