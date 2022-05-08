import { Knex } from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  await knex('posts').del();
  await knex('posts').insert([
    { id: 1, body: 'Hi', user_id: 1 },
    { id: 2, body: 'It is I', user_id: 1 },
    { id: 3, body: 'Hello', user_id: 2 },
    { id: 4, body: "What's up?", user_id: 3 },
  ]);
}
