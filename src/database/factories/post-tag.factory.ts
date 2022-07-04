import { PostTag, postTagTable } from '../../app/post/post-tag-table';
import { Post } from '../../app/post/posts-table';
import { Tag } from '../../app/tag/tags-table';

import { Factory } from './factory';

export class PostTagFactory extends Factory<PostTag> {
  table = postTagTable;

  connectToPost(post: Post, tags: Tag[]): Promise<PostTag[]> {
    return Promise.all(tags.map(tag => this.connect(post, tag)));
  }

  connect(post: Post, tag: Tag): Promise<PostTag> {
    return this.create({
      post_id: post.id,
      tag_id: tag.id,
    });
  }

  override definition(): Partial<PostTag> {
    return {};
  }
}
