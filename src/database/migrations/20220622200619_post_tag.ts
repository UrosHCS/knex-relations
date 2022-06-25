import { Knex } from 'knex';

export function up(knex: Knex) {
  return knex.schema.createTable('post_tag', table => {
    table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table.integer('tag_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('post_tag');
}
