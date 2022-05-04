import { postModule } from './app/post';
import { userModule } from './app/user';
import { boot } from './core';
import { runRepl } from './lib/repl/repl';

runRepl({
  boot: () => {
    boot();
  },
  context: (register) => {
    register('user', userModule, 'user module');
    register('post', postModule, 'post module');
  },
  welcomeMessage: 'Welcome to the repl!',
});
