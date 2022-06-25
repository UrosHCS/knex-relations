import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('posts', table => {
    table.increments('id');
    table.string('body').notNullable();
    // For testing purposes, we will not add a foreign key:
    // .references('id').inTable('users').onDelete('CASCADE')
    table.integer('user_id');
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('posts');
}
