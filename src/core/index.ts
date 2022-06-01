import { initApp } from '../app';
import { setDatabase } from '../lib/knex-relations';

import { connect } from './db';

export async function boot() {
  // Connect knex to the database
  const db = connect();
  // and set the database instance to the global variable
  setDatabase(db);

  // await db.migrate.up();
  // await db.seed.run();

  const app = initApp();

  return app;
}
