import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';

import { DB, Table } from '../../src/lib/knex-relations';
import { UserFactory } from '../factories/user.factory';
import { dbSetupMigrate, dbTeardown } from '../setup';

test.group('Table.query method', group => {
  let db: DB;

  group.setup(async () => {
    db = await dbSetupMigrate();
  });

  group.teardown(() => {
    dbTeardown(db);
  });

  test('it returns the knex query builder instance', ({ expect }) => {
    const table = new Table('users', 'user');
    expect(table.query()).toHaveProperty('where');
  });

  test('it returns results of the query when awaited', async ({ expect }) => {
    expect(await usersTable.count()).toBe(0);
    const users = await new UserFactory().createMany(3);
    expect(await usersTable.count()).toBe(3);
    const result = await usersTable.query();
    expect(result).toEqual(users);
  });
});
