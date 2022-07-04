import { Profile, profilesTable } from '../../app/user/profiles-table';
import { User } from '../../app/user/users-table';
import { chance } from '../chance';

import { Factory } from './factory';

export class ProfileFactory extends Factory<Profile> {
  table = profilesTable;

  forUser(user: User): this {
    return this.state({
      user_id: user.id,
    });
  }

  override definition(attributes: Partial<Profile>): Partial<Profile> {
    return {
      gender: chance.pickone(['male', 'female', 'other']),
      dob: new Date().toDateString(),
      ...attributes,
    };
  }
}
