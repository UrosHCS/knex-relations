import { test } from '@japa/runner';

import { DB, Table } from '../../src/lib/knex-relations';

test.group('Table.capitalizeSingular method', () => {
  test('it makes the first letter in singular property uppercase', ({ expect }) => {
    const db = {} as DB;
    const table = new Table('users', 'user', null, { db });
    expect(table.capitalizeSingular()).toEqual('User');
  });
});
