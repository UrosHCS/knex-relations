import { postsTable } from './app/posts-table';
import { usersTable } from './app/users-table';
import { runRepl } from './lib/repl/repl';

runRepl({
  context: (register) => {
    register('usersTable', usersTable, 'users table');
    register('postsTable', postsTable, 'posts table');
  }
})