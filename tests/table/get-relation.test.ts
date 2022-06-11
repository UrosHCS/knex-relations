import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';
import { BelongsToMany } from '../../src/lib/knex-relations';

import { dbSetupAndCleanup } from '../setup';

test.group('Table.getRelation method', group => {
  group.setup(dbSetupAndCleanup);

  test('it returns the relation if it exists', ({ expect }) => {
    expect(usersTable.getRelation('friends')).toBeInstanceOf(BelongsToMany);
  });

  test('it throws an exception if the relation does not exist', ({ expect }) => {
    // @ts-expect-error testing invalid relation
    expect(() => usersTable.getRelation('nope')).toThrow('Relation "nope" does not exist.');
  });
});
