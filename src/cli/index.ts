import { argv } from 'process';
import { commands } from './commands';

const [nodePath, filePath, commandName, ...args] = argv;

type CommandName = keyof typeof commands;

export interface Command {
  name: string;
  handler: (args: string[]) => Promise<void> | void;
}

export function getCommand(name: CommandName) {
  const command = commands[name];

  if (!command) {
    throw new Error(`Command "${name}" does not exist.`);
  }

  return command;
}

async function run(commandName: CommandName, args: string[]) {
  const command = getCommand(commandName);
  await command.handler(args);
}

run(commandName as CommandName, args);
