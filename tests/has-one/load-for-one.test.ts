import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';
import { factories } from '../factories';
import { UserFactory } from '../factories/user.factory';
import { dbSetupAndCleanup } from '../setup';

test.group('HasMany.loadForOne method', group => {
  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on the parent', async ({ expect }) => {
    // given
    const { user, profile } = await seed();

    // when
    const userWithPosts = await usersTable.relations.profile.loadForOne(user);

    // then
    expect(userWithPosts).toEqual({ ...user, profile });
  });

  test('it sets null if there is no child', async ({ expect }) => {
    // given
    const user = await new UserFactory().create();

    // when
    const userWithPosts = await usersTable.relations.profile.loadForOne(user);

    // then
    expect(userWithPosts).toEqual({ ...user, profile: null });
  });
});

async function seed() {
  const user = await factories.user().create();
  const profile = await factories.profile().forUser(user).create();
  // Other profiles that are filtered out
  await factories.profile().createMany(2);

  return { user, profile };
}
