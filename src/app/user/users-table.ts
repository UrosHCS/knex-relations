import { createTable, Table } from "../../lib/table";
import { belongsToMany, BelongsToMany, hasMany, HasMany } from "../../lib/relations";
import { Post, postsTable } from "../post/posts-table";

export interface User {
  id: number;
  email: string;
  name: string;
}

export type UserRelations = {
  posts: HasMany<User, Post, 'posts'>;
  friends: BelongsToMany<User, User, 'friends'>;
};

export const usersTable: Table<User, UserRelations> = createTable('users', 'user', () => ({
  posts: hasMany(usersTable, postsTable, 'posts'),
  friends: belongsToMany(usersTable, usersTable, 'friends'),
}));
