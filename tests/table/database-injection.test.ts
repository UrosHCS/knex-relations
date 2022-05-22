import { test } from '@japa/runner';

import { Table } from '../../src/lib/knex-relations';

test.group('Table database injection', () => {
  test('not setting the database with setDatabase or in the constructor throws an error', ({ expect }) => {
    expect(() => new Table('users', 'user')).toThrow(
      'Database not set. Use setDatabase function to set it (setDatabase(knex(config)).',
    );
  });
});
