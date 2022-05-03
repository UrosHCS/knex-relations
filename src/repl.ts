import { postRepository } from './app/post/post-repository';
import { postsTable } from './app/post/posts-table';
import { userRepository } from './app/user/user-repository';
import { usersTable } from './app/user/users-table';
import { boot } from './core';
import { runRepl } from './lib/repl/repl';

runRepl({
  boot: () => {
    boot();
  },
  context: (register) => {
    register('usersTable', usersTable, 'users table');
    register('userRepository', userRepository, 'user repo');
    register('postsTable', postsTable, 'posts table');
    register('postRepository', postRepository, 'post repo');
  }
})