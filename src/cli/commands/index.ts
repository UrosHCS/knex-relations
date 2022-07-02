import { freshCommand } from './fresh';
import { replCommand } from './repl';
import { testCommand } from './test';

export const commands = {
  repl: replCommand,
  test: testCommand,
  fresh: freshCommand,
};
