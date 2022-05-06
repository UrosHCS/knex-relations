import { Knex } from 'knex';

export async function seed(knex: Knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    { id: 1, email: 'john@example.com', name: 'John' },
    { id: 2, email: 'jack@example.com', name: 'Jack' },
    { id: 3, email: 'jane@example.com', name: 'Jane' },
  ]);
};
