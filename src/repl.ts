import { postsTable } from './app/post/posts-table';
import { usersTable } from './app/user/users-table';
import { runRepl } from './lib/repl/repl';

runRepl({
  context: (register) => {
    register('usersTable', usersTable, 'users table');
    register('postsTable', postsTable, 'posts table');
  }
})