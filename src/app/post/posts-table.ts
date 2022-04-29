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

type Relations = {
  user: BelongsTo<Post, User, 'user'>;
};

export const postsTable: Table<Post, Relations> = createTable('posts', 'post', () => ({
  user: belongsTo(postsTable, usersTable, 'user'),
}));

const posts: Post[] = [];

(async () => {
  const populatedPosts = postsTable.relations.user.populate(posts);
  const populatedPosts2 = postsTable.populate(posts, 'user');
})();
