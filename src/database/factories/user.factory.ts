import { User, usersTable } from '../../app/user/users-table';
import { chance } from '../chance';

import { Factory } from './factory';

export class UserFactory extends Factory<User> {
  table = usersTable;

  override definition(): Partial<User> {
    return {
      name: chance.name(),
      email: chance.email(),
    };
  }
}
