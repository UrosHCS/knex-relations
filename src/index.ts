import { Knex } from 'knex';
import knex from 'knex';
import { postsTable } from './app/posts-table';
import { usersTable } from './app/users-table';

const config: Knex.Config = {
  client: 'better-sqlite3',
  // connection: 'file:memDb?mode=memory&cache=shared', 
  connection: {
    filename: 'file:memDb?mode=memory&cache=shared',
  }, 
  pool: {
    min: 1,
    max: 1,
    destroyTimeoutMillis: 360000*1000, 
    idleTimeoutMillis: 360000*1000 
  }
};

async function run() {
  knex(config);

  console.log(usersTable.name);
  console.log(postsTable.name);

  try {
    const users = await usersTable.query().select('id', 'email').where((qb) => {
      qb.where('name', '=', 3);
    });
    console.log(users);
  } catch (err) {
    console.log(err);
  }
}

run();
