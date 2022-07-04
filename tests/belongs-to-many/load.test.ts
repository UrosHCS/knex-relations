import { test } from '@japa/runner';

import { postsTable } from '../../src/app/post/posts-table';

import { factories } from '../../src/database/factories';
import { dbSetupAndCleanup } from '../setup';

test.group('BelongsToMany.load method', group => {
  group.tap(test => test.skip(true, 'belongs-to-many not fully implemented yet'));

  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on parents', async ({ expect }) => {
    // given
    const { post1, post2, post3, tags1, tags2 } = await seed();

    // when
    const postsWithTags = await postsTable.relations.tags.load([post1, post2, post3]);

    // then
    expect(postsWithTags).toEqual([
      { ...post1, tags: tags1 },
      { ...post2, tags: tags2 },
      { ...post3, tags: [] },
    ]);
  });

  test('it loads only the filtered children', async ({ expect }) => {
    // given
    const { post1, post2, post3, tags1, tags2 } = await seed();

    // when
    const postsWithTags = await postsTable.relations.tags.load([post1, post2, post3], qb => {
      return qb.whereIn('id', [tags1[2].id, tags1[1].id, tags2[0].id]);
    });

    // then
    expect(postsWithTags).toEqual([
      { ...post1, tags: [tags1[2].id, tags1[1].id] },
      { ...post2, tags: [tags2[0]] },
      { ...post3, tags: [] },
    ]);
  });

  test('it, as expected, limits all children, not per parent', async ({ expect }) => {
    // given
    const { post1, post2, post3, tags1, tags2 } = await seed();

    // when
    const postsWithTags = await postsTable.relations.tags.load([post1, post2, post3], qb => {
      return qb.limit(4);
    });

    // then
    expect(postsWithTags).toEqual([
      { ...post1, tags: tags1 },
      { ...post2, tags: [tags2[0]] },
      { ...post3, tags: [] },
    ]);
  });
});

async function seed() {
  const post1 = await factories.post().create();
  const tags1 = await factories.tag().createMany(3);
  await factories.postTag().connectToPost(post1, tags1);

  const post2 = await factories.post().create();
  const tags2 = await factories.tag().createMany(2);
  await factories.postTag().connectToPost(post1, tags2);

  const post3 = await factories.post().create();
  // Other posts and tags that will be filtered out
  await factories.tag().createMany(2);

  return { post1, post2, post3, tags1, tags2 };
}
