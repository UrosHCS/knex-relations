import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';

import { UserFactory } from '../factories/user.factory';
import { dbSetupAndCleanup } from '../setup';

test.group('Table.query method', group => {
  group.setup(dbSetupAndCleanup);

  test('it returns the knex query builder instance', ({ expect }) => {
    expect(usersTable.query()).toHaveProperty('where');
  });

  test('it returns results of the query when awaited', async ({ expect }) => {
    expect(await usersTable.count()).toBe(0);
    const users = await new UserFactory().createMany(3);
    expect(await usersTable.count()).toBe(3);
    const result = await usersTable.query();
    expect(result).toEqual(users);
  });
});
