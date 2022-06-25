import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('profiles', table => {
    table.increments('id');
    table.string('gender').nullable();
    table.string('dob').nullable();
    // For testing purposes, we will not add a foreign key:
    // .references('id').inTable('users').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('profiles');
}
