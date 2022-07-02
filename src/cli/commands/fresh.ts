import { Command } from '..';
import { boot } from '../../core';
import { getDatabase } from '../../lib/knex-relations';

export const freshCommand: Command = {
  name: 'fresh',
  handler: async () => {
    await boot();
    const db = getDatabase();
    await db.migrate.rollback(undefined, true);
    await db.migrate.latest();
  },
};
