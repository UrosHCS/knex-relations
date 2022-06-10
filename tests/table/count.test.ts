import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';

import { dbSetupAndCleanup } from '../setup';

test.group('Table.count method', group => {
  group.setup(dbSetupAndCleanup);

  test('it returns zero if no rows', async ({ expect }) => {
    expect(await usersTable.count()).toBe(0);
  });

  test('it returns the rows count', async ({ expect }) => {
    await usersTable.create({
      name: 'John',
      email: 'john@example.com',
    });

    expect(await usersTable.count()).toBe(1);
  });

  test('it fails when invalid column is passed', async ({ expect }) => {
    const errorMessage = 'select count(`invalidColumn`) as `count` from `users` - no such column: invalidColumn';

    expect(usersTable.count('invalidColumn')).rejects.toThrow(errorMessage);
  });
});
