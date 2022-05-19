import { Table, BelongsToMany, HasMany } from '../../lib/knex-relations';
import { Post, postsTable } from '../post/posts-table';

export interface User {
  id: number;
  email: string;
  name: string;
}

export type UserRelations = {
  posts: HasMany<User, Post, 'posts'>;
  friends: BelongsToMany<User, User, 'friends'>;
};

export const usersTable: Table<User, UserRelations> = new Table('users', 'user', () => ({
  posts: new HasMany(usersTable, postsTable, 'posts'),
  friends: new BelongsToMany(usersTable, usersTable, 'friends'),
}));
