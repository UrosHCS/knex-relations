import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';

import { DB } from '../../src/lib/knex-relations';
import { dbSetupMigrate, dbTeardown } from '../setup';

test.group('Table.create method', group => {
  let db: DB;

  group.setup(async () => {
    db = await dbSetupMigrate();
  });

  group.teardown(() => {
    dbTeardown(db);
  });

  test('it returns the created instance', async ({ expect }) => {
    const user = await usersTable.create({
      name: 'John',
      email: 'john@example.com',
    });

    expect(Number.isInteger(user.id)).toBe(true);
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@example.com');
    expect(typeof user.created_at).toBe('string');
    expect(new Date(user.created_at).toString()).not.toBe('Invalid Date');
    expect(typeof user.updated_at).toBe('string');
    expect(new Date(user.updated_at).toString()).not.toBe('Invalid Date');
  });

  test('it fails when invalid columns are passed', async ({ expect }) => {
    const errorMessage =
      "insert into `users` (`email`, `invalid`, `name`) values ('john@example.com', 'invalid', 'John') returning * - table users has no column named invalid";

    expect(
      usersTable.create({
        name: 'John',
        email: 'john@example.com',
        // @ts-expect-error testing invalid column
        invalid: 'invalid',
      }),
    ).rejects.toThrow(errorMessage);
  });

  test('it fails when invalid columns are passed', async ({ expect }) => {
    const errorMessage =
      "insert into `users` (`name`) values ('John') returning * - NOT NULL constraint failed: users.email";

    expect(
      usersTable.create({
        name: 'John',
        // missing email column
      }),
    ).rejects.toThrow(errorMessage);
  });
});
