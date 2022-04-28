import { belongsTo } from "../lib/relations";
import { Table } from "../lib/table/table";
import { User, usersTable } from "./users-table";
import { BelongsTo } from "../lib/relations/belongs-to";

export interface Post {
  id: number;
  title: string;
  text: string;
  user_id: number;
}

type Relations = {
  user: BelongsTo<Post, User, 'user'>;
};

export const postsTable: Table<Post, Relations> = new Table('posts', 'post', 'id', () => ({
  user: belongsTo(postsTable, usersTable, 'user'),
}));

const posts: Post[] = [];

(async () => {
  const populatedPosts = postsTable.relations.user.populate(posts);
  const populatedPosts2 = postsTable.populate(posts, 'user');
})();
