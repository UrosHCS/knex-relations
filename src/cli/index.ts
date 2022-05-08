import { argv } from 'process';
import { commands } from './commands';

const [, , commandName, ...args] = argv;

export interface Command {
  name: string;
  handler: (args: string[]) => Promise<void> | void;
}

export function getCommand(name: string) {
  if (!(name in commands)) {
    throw new Error(`Command "${name}" does not exist.`);
  }

  return commands[name as keyof typeof commands];
}

async function run(commandName: string, args: string[]) {
  const command = getCommand(commandName);
  await command.handler(args);
}

run(commandName, args);
