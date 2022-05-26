import { test } from '@japa/runner';

import { DB, Table } from '../../src/lib/knex-relations';
import { UserFactory } from '../factories/user.factory';
import { dbSetupMigrate, dbTeardown } from '../setup';

test.group('Table constructor logic', group => {
  let db: DB;
  let app: any;

  group.setup(async () => {
    const setup = await dbSetupMigrate();
    db = setup.db;
    app = setup.app;
  });

  group.teardown(() => {
    dbTeardown(db);
  });

  test('it returns the knex query builder instance', ({ expect }) => {
    const table = new Table('users', 'user');
    expect(table.query()).toHaveProperty('where');
  });

  test('it returns results of the query when awaited', async ({ expect }) => {
    const users = new UserFactory().createMany(3);
    expect(await app.userModule.table.query()).toEqual(users);
  });
});
