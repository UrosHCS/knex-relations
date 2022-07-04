import { test } from '@japa/runner';

import { postsTable } from '../../src/app/post/posts-table';
import { factories } from '../../src/database/factories';
import { dbSetupAndCleanup } from '../setup';

test.group('BelongsToMany.loadForOne post', group => {
  // group.tap(test => test.skip(true, 'belongs-to-many not fully implemented yet'));

  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on the parent', async ({ expect }) => {
    // given
    const { post, tags } = await seed();

    // when
    const postWithTags = await postsTable.relations.tags.loadForOne(post);

    // then
    expect(postWithTags).toEqual({ ...post, tags });
  });

  test('it sets an empty array if there is no child', async ({ expect }) => {
    // given
    const post = await factories.post().create();

    // when
    const postWithTags = await postsTable.relations.tags.loadForOne(post);

    // then
    expect(postWithTags).toEqual({ ...post, tags: [] });
  });
});

async function seed() {
  const post = await factories.post().create();
  const tags = await factories.tag().createMany(3);
  await factories.postTag().connectToPost(post, tags);

  // Other posts and tags that will be filtered out
  await factories.tag().createMany(2);

  return { post, tags };
}
