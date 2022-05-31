import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';

import { DB, Table } from '../../src/lib/knex-relations';
import { UserFactory } from '../factories/user.factory';
import { dbSetupMigrate, dbTeardown } from '../setup';

test.group('Table constructor logic', group => {
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
    expect(await db('users').select()).toHaveLength(0);
    // const factory = new UserFactory();
    const users = await db('users')
      .returning('*')
      .insert([
        {
          name: 'john',
          email: 'email',
        },
        {
          name: 'john',
          email: 'email',
        },
      ]);
    expect(await db('users').select()).toHaveLength(2);
    const result = await usersTable.query();
    console.log(result);
    expect(result).toEqual(users);
  });
});
