import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('tags', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('tags');
}
