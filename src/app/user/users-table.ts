import { createTable, Table } from "../../lib/table";
import { belongsToMany, BelongsToMany, hasMany, HasMany } from "../../lib/relations";
import { Post, postsTable } from "../post/posts-table";
import { connect } from "../../core/db";
import { UsersQueryBuilder } from "./users-query-builder";

export interface User {
  id: number;
  email: string;
  name: string;
}

const user: User = {
  id: 5, 
  email: 'bebolino@gmail.com',
  name: 'Beba',
};

type Relations = {
  posts: HasMany<User, Post, 'posts'>;
  friends: BelongsToMany<User, User, 'friends'>;
};

export const usersTable: Table<User, Relations> = createTable('users', 'user', () => ({
  posts: hasMany(usersTable, postsTable, 'posts'),
  friends: belongsToMany(usersTable, usersTable, 'friends'),
}));

const users: User[] = [];

const qb = usersTable.query();

(async () => {
  const populatedUsers = await usersTable.relations.friends.populate(users);

  const populatedUsers2 = usersTable.populate(users, 'friends');
  const psps = usersTable.populate(users, 'posts');
  const nestedUsers = usersTable.populateNested(users, 'friends.friends.posts');
})();