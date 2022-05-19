import { Repository } from '../../lib/knex-relations';

import { User, usersTable } from './users-table';

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

  async withReducedPosts() {
    return this.table.load(await this.bunch(), 'posts', qb => {
      return qb.select('id', 'body').then(rows => rows);
    });
  }

  async withReducedPostsUsingRelationsDirectly() {
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

  async withReducedFriends() {
    return this.table.load(await this.bunch(), 'friends', qb => {
      return qb.select('id', 'email').then(rows => rows);
    });
  }

  async withReducedFriendsUsingRelationsDirectly() {
    return this.table.relations.friends.load(await this.bunch(), qb => {
      return qb.select('id', 'email').then(rows => rows);
    });
  }
}

export const userRepository = new UserRepository();
