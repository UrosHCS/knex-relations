import { Repository } from '../../lib/knex-relations';
import { Post } from '../post/posts-table';

import { User, usersTable } from './users-table';

interface UserWithPartialPosts extends User {
  posts: Pick<Post, 'id' | 'body'>[];
}

interface UserWithPartialFriends extends User {
  friends: Pick<User, 'id' | 'email'>[];
}

class UserRepository extends Repository<User> {
  table = usersTable;

  bunch() {
    return this.select().limit(10);
  }

  async withPosts() {
    return this.table.load(await this.bunch(), 'posts');
  }

  async withPostsUsingRelationsDirectly() {
    return this.table.relations.posts.load(await this.bunch());
  }

  async withReducedPosts(): Promise<UserWithPartialPosts[]> {
    return this.table.load(await this.bunch(), 'posts', qb => {
      return qb.select('id', 'body').then(rows => rows);
    });
  }

  async withReducedPostsUsingRelationsDirectly(): Promise<UserWithPartialPosts[]> {
    return this.table.relations.posts.load(await this.bunch(), qb => {
      return qb.select('id', 'body').then(rows => rows);
    });
  }

  async withFriends() {
    return this.table.load(await this.bunch(), 'friends');
  }

  async withFriendsUsingRelationsDirectly() {
    return this.table.relations.friends.load(await this.bunch());
  }

  async withReducedFriends(): Promise<UserWithPartialFriends[]> {
    return this.table.load(await this.bunch(), 'friends', qb => {
      return qb.select('id', 'email').then(rows => rows);
    });
  }

  async withReducedFriendsUsingRelationsDirectly(): Promise<UserWithPartialFriends[]> {
    return this.table.relations.friends.load(await this.bunch(), qb => {
      return qb.select('id', 'email').then(rows => rows);
    });
  }
}

export const userRepository = new UserRepository();
