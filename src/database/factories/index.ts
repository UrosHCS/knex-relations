import { PostTagFactory } from './post-tag.factory';
import { PostFactory } from './post.factory';
import { ProfileFactory } from './profile.factory';
import { TagFactory } from './tag.factory';
import { UserFactory } from './user.factory';

export const factories = {
  post: () => new PostFactory(),
  postTag: () => new PostTagFactory(),
  profile: () => new ProfileFactory(),
  tag: () => new TagFactory(),
  user: () => new UserFactory(),
};
