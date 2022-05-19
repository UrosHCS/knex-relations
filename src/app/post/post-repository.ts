import { Repository } from '../../lib/table';
import { Post, postsTable } from './posts-table';

class PostRepository extends Repository<Post> {
  table = postsTable;

  async bunch() {
    return this.select().limit(10);
  }

  async withUser() {
    return this.table.load(await this.bunch(), 'user');
  }

  async withUserUsingRelationsDirectly() {
    return this.table.relations.user.load(await this.select().limit(10));
  }

  async withReducedUser() {
    return this.table.load(await this.bunch(), 'user', qb => {
      return qb.select('id', 'email').then(rows => rows);
    });
  }

  async withReducedUserUsingRelationsDirectly() {
    return this.table.relations.user.load(await this.bunch(), qb => {
      return qb.select('id', 'email').then(rows => rows);
    });
  }
}

export const postRepository = new PostRepository();
