import { User, usersTable } from '../user/users-table';
import { BelongsTo } from '../../lib/relations';
import { Table } from '../../lib/table';

export interface Post {
  id: number;
  body: string;
  user_id: number;
}

export type PostRelations = {
  user: BelongsTo<Post, User, 'user'>;
};

export const postsTable: Table<Post, PostRelations> = new Table('posts', 'post', postsTable => ({
  user: new BelongsTo(postsTable, usersTable, 'user'),
}));
