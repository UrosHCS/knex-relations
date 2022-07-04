import { test } from '@japa/runner';

import { usersTable } from '../../src/app/user/users-table';
import { factories } from '../../src/database/factories';
import { dbSetupAndCleanup } from '../setup';

test.group('HasMany.loadForOne method', group => {
  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on the parent', async ({ expect }) => {
    // given
    const { user, posts } = await seed();

    // when
    const userWithPosts = await usersTable.relations.posts.loadForOne(user);

    // then
    expect(userWithPosts).toEqual({ ...user, posts });
  });

  test('it loads only the filtered children', async ({ expect }) => {
    // given
    const { user, posts } = await seed();

    // when
    const userWithPosts = await usersTable.relations.posts.loadForOne(user, qb => {
      return qb.whereIn('id', [posts[1].id]);
    });

    // then
    expect(userWithPosts).toEqual({ ...user, posts: [posts[1]] });
  });

  test('it loads limited number of children', async ({ expect }) => {
    // given
    const { user, posts } = await seed();

    // when
    const userWithPosts = await usersTable.relations.posts.loadForOne(user, qb => {
      return qb.limit(2);
    });

    // then
    expect(userWithPosts).toEqual({ ...user, posts: posts.slice(0, 2) });
  });

  test('it sets an empty array if there are no children', async ({ expect }) => {
    // given
    const user = await factories.user().create();

    // when
    const userWithPosts = await usersTable.relations.posts.loadForOne(user);

    // then
    expect(userWithPosts).toEqual({ ...user, posts: [] });
  });
});

async function seed() {
  const user = await factories.user().create();
  const posts = await factories.post().forUser(user).createMany(3);
  // Other posts that are filtered out
  await factories.post().createMany(2);

  return { user, posts };
}
