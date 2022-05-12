import { Repository } from '../../lib/table';
import { Post, postsTable } from './posts-table';

class PostRepository extends Repository<Post> {
  table = postsTable;

  async test() {
    const posts = await this.select().limit(10);
    const populatedPosts = this.table.relations.user.load(posts);
    const populatedPosts2 = this.table.load(posts, 'user');
  }

  latest(limit: number) {
    return this.query().orderBy('id').limit(limit);
  }
}

export const postRepository = new PostRepository();
