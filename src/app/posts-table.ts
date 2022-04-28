import { belongsTo } from "../lib/relations";
import { TableRelations } from "../lib/table/table-relations";
import { Table } from "../lib/table/table";
import { User, usersTable } from "./users-table";
import { BelongsTo } from "../lib/relations/belongs-to";

export interface Post {
  id: number;
  title: string;
  text: string;
  user_id: number;
}

type PostRelations = {
  user: BelongsTo<Post, User, 'user'>;
};

export const postsTable = new Table<Post, PostRelations>('posts', 'post', 'id');

const relations = new TableRelations(postsTable, {
  user: belongsTo(postsTable, usersTable, 'user'),
});

postsTable.setRelations(relations);

const posts: Post[] = [];

(async () => {
  const populatedPosts = relations.map.user.populate(posts);
  const populatedPosts2 = relations.populate(posts, 'user');
})
