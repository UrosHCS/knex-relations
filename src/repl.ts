import { boot } from './core';
import { runRepl } from './lib/repl/repl';

runRepl({
  context: async (register) => {
    const app = await boot();

    register('app', app, 'app');
    register('user', app.userModule, 'user module');
    register('post', app.postModule, 'post module');
  },
  welcomeMessage: 'Welcome to the repl!',
});
