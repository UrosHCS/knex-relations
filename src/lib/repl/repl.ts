/* eslint-disable max-statements */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import os from 'os';
import path from 'path';
import repl from 'repl';

interface RegisterFunction {
  (key: string, value: unknown, description: string): void;
}

process.env.NODE_REPL_HISTORY = path.join(os.homedir(), '.node_repl_history');

export interface Config {
  context?: (register: RegisterFunction) => Promise<void> | void;
  boot?: () => Promise<void> | void;
  welcomeMessage?: string;
};

export const runRepl = async (config: Config) => {
  const vars: Record<string, string> = {};

  const replServer = repl.start();

  replServer.on('exit', process.exit);

  const register: RegisterFunction = (key, value, description) => {
    replServer.context[key] = value;
    vars[key] = description;
  };

  if (config.boot) {
    await config.boot();
  }

  if (config.context) {
    await config.context(register);
  }

  register('vars', vars, 'all the local vars');

  replServer.setupHistory(process.env.NODE_REPL_HISTORY!, (err) => {
    if (err) console.log(err);
  });

  console.log('Registered variables:');
  console.log(vars);

  if (config.welcomeMessage) {
    console.log(config.welcomeMessage);
  }

  replServer.displayPrompt();
};
