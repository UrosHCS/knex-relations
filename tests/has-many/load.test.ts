import { test } from '@japa/runner';

import { postsTable } from '../../src/app/post/posts-table';

import { usersTable } from '../../src/app/user/users-table';
import { HasMany } from '../../src/lib/knex-relations';
import { PostFactory } from '../factories/post.factory';

import { UserFactory } from '../factories/user.factory';
import { dbSetupAndCleanup } from '../setup';

test.group('HasMany.load method', group => {
  group.each.setup(dbSetupAndCleanup);

  test('it loads all children on parents', async ({ expect }) => {
    // given
    const users = await new UserFactory().createMany(4);
    const posts1 = await new PostFactory().forUser(users[0]).createMany(3);
    const posts2 = await new PostFactory().forUser(users[1]).createMany(2);
    const posts3 = await new PostFactory().forUser(users[2]).createMany(1);

    // when
    const usersWithPosts = await new HasMany(usersTable, postsTable, 'posts').load(users);

    // then
    expect(usersWithPosts).toEqual([
      { ...users[0], posts: posts1 },
      { ...users[1], posts: posts2 },
      { ...users[2], posts: posts3 },
      { ...users[3], posts: [] },
    ]);
  });
});
