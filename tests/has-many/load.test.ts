import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';
import { factories } from '../factories';
import { dbSetupAndCleanup } from '../setup';

test.group('HasMany.load method', group => {
  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on parents', async ({ expect }) => {
    // given
    const { users, posts1, posts2, posts3 } = await seed();

    // when
    const usersWithPosts = await usersTable.relations.posts.load(users);

    // then
    expect(usersWithPosts).toEqual([
      { ...users[0], posts: posts1 },
      { ...users[1], posts: posts2 },
      { ...users[2], posts: posts3 },
      { ...users[3], posts: [] },
    ]);
  });

  test('it loads only the filtered children', async ({ expect }) => {
    // given
    const { users, posts1, posts2, posts3 } = await seed();

    // when
    const usersWithPosts = await usersTable.relations.posts.load(users, qb => {
      return qb.whereIn('id', [posts1[1].id, posts2[1].id, posts3[0].id]);
    });

    // then
    expect(usersWithPosts).toEqual([
      { ...users[0], posts: [posts1[1]] },
      { ...users[1], posts: [posts2[1]] },
      { ...users[2], posts: [posts3[0]] },
      { ...users[3], posts: [] },
    ]);
  });

  test('it, as expected, limits all children, not per parent', async ({ expect }) => {
    // given
    const { users, posts1, posts2 } = await seed();

    // when
    const usersWithPosts = await usersTable.relations.posts.load(users, qb => {
      return qb.limit(4);
    });

    // then
    expect(usersWithPosts).toEqual([
      { ...users[0], posts: posts1 },
      { ...users[1], posts: [posts2[0]] },
      { ...users[2], posts: [] },
      { ...users[3], posts: [] },
    ]);
  });
});

async function seed() {
  const users = await factories.user().createMany(4);
  const posts1 = await factories.post().forUser(users[0]).createMany(3);
  const posts2 = await factories.post().forUser(users[1]).createMany(2);
  const posts3 = await factories.post().forUser(users[2]).createMany(1);
  // Other posts that are filtered out
  await factories.post().createMany(2);

  return { users, posts1, posts2, posts3 };
}
