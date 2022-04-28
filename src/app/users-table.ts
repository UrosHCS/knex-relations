import { belongsToMany, hasMany } from "../lib/relations";
import { TableRelations } from "../lib/table/table-relations";
import { Table } from "../lib/table/table";
import { Post, postsTable } from "./posts-table";
import { HasMany } from "../lib/relations/has-many";
import { BelongsToMany } from "../lib/relations/belongs-to-many";

export interface User {
  id: number;
  email: string;
  name: string;
}

type UserRelations = {
  posts: HasMany<User, Post, 'posts'>;
  friends: BelongsToMany<User, User, 'friends'>;
};

export const usersTable = new Table<User, UserRelations>('users', 'user', 'id');

const relations = new TableRelations(usersTable, {
  posts: hasMany(usersTable, postsTable, 'posts'),
  friends: belongsToMany(usersTable, usersTable, 'friends'),
});

usersTable.setRelations(relations);

const users: User[] = [];

(async () => {
  const populatedUsers = await relations.map.friends.populate(users);

  const populatedUsers2 = relations.populate(users, 'friends');
  const nestedUsers = relations.populateNested(users, 'friends.friends.posts');
})();