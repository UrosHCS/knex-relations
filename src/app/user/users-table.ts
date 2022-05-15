import { Table } from '../../lib/table';
import { BelongsToMany, HasMany } from '../../lib/relations';
import { Post, postsTable } from '../post/posts-table';

export type User = {
  id: number;
  email: string;
  name: string;
};

export type UserRelations = {
  posts: HasMany<User, Post, 'posts', false>;
  friends: BelongsToMany<User, User, 'friends', false>;
};

export const usersTable: Table<User, UserRelations> = new Table('users', 'user', () => ({
  posts: new HasMany(usersTable, postsTable, 'posts'),
  friends: new BelongsToMany(usersTable, usersTable, 'friends'),
}));
