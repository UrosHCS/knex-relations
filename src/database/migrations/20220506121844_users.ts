import { Knex } from 'knex';

export function up(knex: Knex) {
  console.log('creating users table');
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('name');
    table.string('email');
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('users');
}
