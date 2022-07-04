import { test } from '@japa/runner';

import { postsTable } from '../../src/app/post/posts-table';
import { factories } from '../../src/database/factories';
import { dbSetupAndCleanup } from '../setup';

test.group('BelongsTo.loadForOne post', group => {
  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on the parent', async ({ expect }) => {
    // given
    const { user, post } = await seed();

    // when
    const postWithUser = await postsTable.relations.user.loadForOne(post);

    // then
    expect(postWithUser).toEqual({ ...post, user });
  });

  test('it sets an empty array if there is no child', async ({ expect }) => {
    // given
    const post = await factories.post().create();

    // when
    const postWithUser = await postsTable.relations.user.loadForOne(post);

    // then
    expect(postWithUser).toEqual({ ...post, user: null });
  });
});

async function seed() {
  const user = await factories.user().create();
  const post = await factories.post().forUser(user).create();
  // Other users that will be filtered out
  await factories.user().createMany(2);

  return { user, post };
}
