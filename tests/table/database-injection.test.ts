import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';

test.group('Table database injection', () => {
  test('not setting the database with setDatabase or in the constructor throws an error', ({ expect }) => {
    expect(() => usersTable.query()).toThrow(
      'Database not set. Use setDatabase function to set it (setDatabase(knex(config)).',
    );
  });
});
