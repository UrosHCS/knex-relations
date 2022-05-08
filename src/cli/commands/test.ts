import { Command } from '..';
import { boot } from '../../core';

export const testCommand: Command = {
  name: 'test',
  handler: async args => {
    const app = await boot();
    console.log(Object.assign({}, app));
    console.log(args);
  },
};
