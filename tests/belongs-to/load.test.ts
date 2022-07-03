import { test } from '@japa/runner';

import { postsTable } from '../../src/app/post/posts-table';

import { factories } from '../factories';
import { dbSetupAndCleanup } from '../setup';

test.group('BelongsTo.load method', group => {
  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on parents', async ({ expect }) => {
    // given
    const { users, posts } = await seed();

    // when
    const postsWithUser = await postsTable.relations.user.load(posts);

    // then
    expect(postsWithUser).toEqual([
      { ...posts[0], user: users[0] },
      { ...posts[1], user: users[1] },
      { ...posts[2], user: users[2] },
      { ...posts[3], user: null },
    ]);
  });

  test('it loads only the filtered children', async ({ expect }) => {
    // given
    const { users, posts } = await seed();

    // when
    const postsWithUser = await postsTable.relations.user.load(posts, qb => {
      return qb.whereIn('id', [users[1].id, users[2].id]);
    });

    // then
    expect(postsWithUser).toEqual([
      { ...posts[0], user: null },
      { ...posts[1], user: users[1] },
      { ...posts[2], user: users[2] },
      { ...posts[3], user: null },
    ]);
  });

  test('it, as expected, limits all children, not per parent', async ({ expect }) => {
    // given
    const { users, posts } = await seed();

    // when
    const postsWithUser = await postsTable.relations.user.load(posts, qb => {
      return qb.limit(2);
    });

    // then
    expect(postsWithUser).toEqual([
      { ...posts[0], user: users[0] },
      { ...posts[1], user: users[1] },
      { ...posts[2], user: null },
      { ...posts[3], user: null },
    ]);
  });
});

async function seed() {
  const user1 = await factories.user().create();
  const user2 = await factories.user().create();
  const user3 = await factories.user().create();
  const post1 = await factories.post().forUser(user1).create();
  const post2 = await factories.post().forUser(user2).create();
  const post3 = await factories.post().forUser(user3).create();
  const post4 = await factories.post().create();
  // Other users that are filtered out
  await factories.user().createMany(2);

  return { users: [user1, user2, user3], posts: [post1, post2, post3, post4] };
}
