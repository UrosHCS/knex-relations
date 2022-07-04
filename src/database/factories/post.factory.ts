import { Post, postsTable } from '../../app/post/posts-table';
import { User } from '../../app/user/users-table';
import { chance } from '../chance';

import { Factory } from './factory';

export class PostFactory extends Factory<Post> {
  table = postsTable;

  forUser(user: User): this {
    return this.state({
      user_id: user.id,
    });
  }

  override definition(attributes: Partial<Post>): Partial<Post> {
    return {
      body: chance.sentence(),
      ...attributes,
    };
  }
}
