import { belongsToMany, hasMany } from "../lib/relations";
import { Table } from "../lib/table/table";
import { Post, postsTable } from "./posts-table";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const usersTable = new Table<User>('users', 'user', 'id');

const relations = {
  posts: hasMany(usersTable, postsTable, 'posts'),
  friends: belongsToMany(usersTable, usersTable, 'friends'),
};

const schema = { table: usersTable, relations };

const users: User[] = [];

const populatedUsers = schema.relations.friends.populate(users);
