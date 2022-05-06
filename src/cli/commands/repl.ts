import { Command } from '..';
import { boot } from '../../core';
import { runRepl } from '../../lib/repl/repl';
import { getDatabase } from '../../lib/table';

export const replCommand: Command = {
  name: 'repl',
  handler: async () => {
    await runRepl({
      context: async (register) => {
        const app = await boot();
    
        register('db', getDatabase(), 'knex instance');
        register('app', app, 'app');
        register('userModule', app.userModule, 'user module');
        register('postModule', app.postModule, 'post module');
      },
      welcomeMessage: 'Welcome to the repl!',
    });
  },
}
