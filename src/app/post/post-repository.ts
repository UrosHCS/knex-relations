import { Repository } from '../../lib/knex-relations';
import { User } from '../user/users-table';

import { Post, postsTable } from './posts-table';

interface PostWithUser extends Post {
  user: User;
}

interface PostWithPartialUser extends Post {
  user: Pick<User, 'id' | 'email'>;
}

class PostRepository extends Repository<Post> {
  table = postsTable;

  async bunch() {
    return this.select().limit(10);
  }

  async withUser(): Promise<PostWithUser[]> {
    return this.table.load(await this.bunch(), 'user');
  }

  async withUserUsingRelationsDirectly(): Promise<PostWithUser[]> {
    return this.table.relations.user.load(await this.select().limit(10));
  }

  async withReducedUser(): Promise<PostWithPartialUser[]> {
    return this.table.load(await this.bunch(), 'user', async qb => {
      // If we don't make a variable and then return it, the types get messed up
      const query = qb.select('id', 'email');
      return query;
    });
  }

  async withReducedUserUsingRelationsDirectly(): Promise<PostWithPartialUser[]> {
    return this.table.relations.user.load(await this.bunch(), qb => {
      // Here, calling then is enough to fix the types problem
      return qb.select('id', 'email').then(res => res);
    });
  }
}

export const postRepository = new PostRepository();
