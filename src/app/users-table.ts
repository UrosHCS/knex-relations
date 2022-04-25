import { belongsToMany, hasMany } from "../lib/relations";
import { Schema } from "../lib/table/schema";
import { Table } from "../lib/table/table";
import { postsTable } from "./posts-table";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const usersTable = new Table<User>('users', 'user', 'id');

const usersSchema = new Schema(usersTable, {
  posts: hasMany(usersTable, postsTable, 'posts'),
  friends: belongsToMany(usersTable, usersTable, 'friends'),
});

const users: User[] = [];

(async () => {
  const populatedUsers = await usersSchema.relations.friends.populate(users);

  const populatedUsers2 = usersSchema.loadRelation(users, 'friends');
})();