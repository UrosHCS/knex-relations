import { Table, BelongsTo, BelongsToMany } from '../../lib/knex-relations';
import { Tag, tagsTable } from '../tag/tags-table';
import { User, usersTable } from '../user/users-table';

export interface Post {
  id: number;
  body: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export type PostRelations = {
  user: BelongsTo<Post, User, 'user'>;
  tags: BelongsToMany<Post, Tag, 'tags'>;
};

export const postsTable: Table<Post, PostRelations> = new Table('posts', 'post', postsTable => ({
  user: new BelongsTo(postsTable, usersTable, 'user'),
  tags: new BelongsToMany(postsTable, tagsTable, 'tags'),
}));
