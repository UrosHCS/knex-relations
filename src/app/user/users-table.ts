import { Table, HasMany, HasOne } from '../../lib/knex-relations';
import { Post, postsTable } from '../post/posts-table';

import { Profile, profilesTable } from './profiles-table';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export type UserRelations = {
  posts: HasMany<User, Post, 'posts'>;
  profile: HasOne<User, Profile, 'profile'>;
};

export const usersTable: Table<User, UserRelations> = new Table('users', 'user', () => ({
  posts: new HasMany(usersTable, postsTable, 'posts'),
  profile: new HasOne(usersTable, profilesTable, 'profile'),
}));
