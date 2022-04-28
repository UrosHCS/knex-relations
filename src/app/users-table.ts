import { belongsToMany, hasMany } from "../lib/relations";
import { Table } from "../lib/table/table";
import { Post, postsTable } from "./posts-table";
import { HasMany } from "../lib/relations/has-many";
import { BelongsToMany } from "../lib/relations/belongs-to-many";

export interface User {
  id: number;
  email: string;
  name: string;
}

type Relations = {
  posts: HasMany<User, Post, 'posts'>;
  friends: BelongsToMany<User, User, 'friends'>;
};

export const usersTable: Table<User, Relations> = new Table('users', 'user', 'id', () => ({
  posts: hasMany(usersTable, postsTable, 'posts'),
  friends: belongsToMany(usersTable, usersTable, 'friends'),
}));

const users: User[] = [];

(async () => {
  const populatedUsers = await usersTable.relations.friends.populate(users);

  const populatedUsers2 = usersTable.populate(users, 'friends');
  const nestedUsers = usersTable.populateNested(users, 'friends.friends.posts');
})();