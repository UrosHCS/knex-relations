import { test } from '@japa/runner';

import { DB, Table } from '../../src/lib/knex-relations';
import { dbSetup, dbTeardown } from '../setup';

test.group('Table constructor logic', group => {
  let db: DB;

  group.setup(async () => {
    db = dbSetup();
  });

  group.teardown(() => {
    dbTeardown(db);
  });

  test('table name and singular are required constructor args', ({ expect }) => {
    const table = new Table('users', 'user');
    expect(table).toBeInstanceOf(Table);
    expect(table.name).toBe('users');
    expect(table.singular).toBe('user');
    expect(table.relations).toEqual({});
    expect(table.primaryKey).toEqual('id');
    expect(table.db).toBe(db);
  });

  test('primary key can be set', ({ expect }) => {
    const table = new Table('users', 'user', () => ({}), { primaryKey: 'email' });
    expect(table.primaryKey).toBe('email');
  });
});
