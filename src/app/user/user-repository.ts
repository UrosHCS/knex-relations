import { Repository } from '../../lib/table';
import { User, usersTable } from './users-table';

class UserRepository extends Repository<User> {
  table = usersTable;

  async test() {
    const users = await this.query().limit(10);
    const specialUsers = await this.table.load(users, 'posts', async qb => {
      return qb.select('body').then(rows => rows);
    });
    const withPosts = await this.table.load(users, 'posts');
    const withFriends = await this.table.load(users, 'friends');

    return withPosts;
  }

  latest(limit: number) {
    return this.query().orderBy('id').limit(limit);
  }

  async miniUsers() {
    const miniUsers = await this.query()
      .select('id', 'email')
      .where(qb => {
        qb.where({ name: 'John' });
      });

    return miniUsers;
  }
}

export const userRepository = new UserRepository();
