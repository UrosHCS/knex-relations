import { test } from '@japa/runner';

import { DB, HasMany, setDatabase, Table, unsetDatabase } from '../../src/lib/knex-relations';

test.group('Table constructor logic', group => {
  let mockDb: DB;

  group.setup(() => {
    mockDb = (() => {
      // empty function
    }) as DB;
    setDatabase(mockDb);
  });

  group.teardown(() => {
    unsetDatabase();
  });

  test('table name and singular are required constructor args', ({ expect }) => {
    const table = new Table('users', 'user');
    expect(table).toBeInstanceOf(Table);
    expect(table.name).toBe('users');
    expect(table.singular).toBe('user');
    expect(table.relations).toEqual({});
    expect(table.primaryKey).toBe('id');
    expect(table.db).toBe(null);
  });

  test('relations property is an empty object before init', ({ expect }) => {
    const table: Table<any, any> = new Table('users', 'user', () => ({
      posts: new HasMany(table, new Table('posts', 'post'), 'posts'),
    }));

    expect(table.relations).toEqual({});
  });

  test('relations returned from the relation builder are set as the relations property after init', ({ expect }) => {
    const table: Table<any, any> = new Table('users', 'user', () => ({
      posts: new HasMany(table, new Table('posts', 'post'), 'posts'),
    }));

    table.init();

    expect(table.relations).toEqual({
      posts: new HasMany(table, new Table('posts', 'post'), 'posts'),
    });
  });

  test('primary key can be set', ({ expect }) => {
    const table = new Table('users', 'user', () => ({}), { primaryKey: 'email' });
    expect(table.primaryKey).toBe('email');
  });

  test('db can be set', ({ expect }) => {
    const db = (() => {
      // different empty function
    }) as DB;

    const table = new Table('users', 'user', () => ({}), { db });
    table.query();
    expect(table.db).not.toBe(mockDb);
    expect(table.db).toBe(db);
  });
});
