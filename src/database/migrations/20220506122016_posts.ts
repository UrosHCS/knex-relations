import { Knex } from 'knex';

export function up(knex: Knex) {
  console.log('creating posts table');
  return knex.schema.createTable('posts', table => {
    table.increments('id');
    table.string('body');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('posts');
}
