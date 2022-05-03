import { Repository } from "../../lib/table";
import { User, usersTable } from "./users-table";

class UserRepository extends Repository<User> {
  table = usersTable;

  async test() {
    const users = await this.select().limit(10);
    const populatedUsers = this.table.relations.posts.populate(users);
    const populatedUsers2 = this.table.populate(users, 'posts');
  }

  latest(limit: number) {
    return this.query().orderBy('id').limit(limit);
  }

  async miniUsers() {
    const miniUsers = await this.query().select('id', 'email').where((qb) => {
      qb.where('name', '=', 3);
    });

    return miniUsers;
  }
}

export const userRepository = new UserRepository();
