import { Table, BelongsTo } from '../../lib/knex-relations';

import { User, usersTable } from './users-table';

export interface Profile {
  id: number;
  gender: string;
  dob: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export type ProfileRelations = {
  user: BelongsTo<Profile, User, 'user'>;
};

export const profilesTable: Table<Profile, ProfileRelations> = new Table('profiles', 'profile', () => ({
  user: new BelongsTo(profilesTable, usersTable, 'user'),
}));
