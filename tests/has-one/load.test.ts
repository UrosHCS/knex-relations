import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';
import { factories } from '../factories';
import { dbSetupAndCleanup } from '../setup';

test.group('HasMany.load method', group => {
  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on parents', async ({ expect }) => {
    // given
    const { users, profile1, profile2, profile3 } = await seed();

    // when
    const usersWithPosts = await usersTable.relations.profile.load(users);

    // then
    expect(usersWithPosts).toEqual([
      { ...users[0], profile: profile1 },
      { ...users[1], profile: profile2 },
      { ...users[2], profile: profile3 },
      { ...users[3], profile: null },
    ]);
  });

  test('it loads only the filtered children', async ({ expect }) => {
    // given
    const { users, profile1, profile2, profile3 } = await seed();

    // when
    const usersWithPosts = await usersTable.relations.profile.load(users, qb => {
      return qb.whereIn('id', [profile1.id, profile2.id, profile3.id]);
    });

    // then
    expect(usersWithPosts).toEqual([
      { ...users[0], profile: profile1 },
      { ...users[1], profile: profile2 },
      { ...users[2], profile: profile3 },
      { ...users[3], profile: null },
    ]);
  });
});

async function seed() {
  const users = await factories.user().createMany(4);
  const profile1 = await factories.profile().forUser(users[0]).create();
  const profile2 = await factories.profile().forUser(users[1]).create();
  const profile3 = await factories.profile().forUser(users[2]).create();
  // Other profile that are filtered out
  await factories.profile().createMany(2);

  return { users, profile1, profile2, profile3 };
}
