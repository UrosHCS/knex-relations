import { Repository } from "../../lib/table";
import { Post, postsTable } from "./posts-table";

class PostsRepository extends Repository<Post> {
  table = postsTable;

  latest(limit: number) {
    return this.query().orderBy('id').limit(limit);
  }

  async withUser() {
    const posts = await this.select().limit(10);

    return this.table.populate(posts, 'user');
  }
}