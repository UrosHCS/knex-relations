import os from 'os';
import path from 'path';
import repl from 'repl';

interface RegisterFunction {
  (key: string, value: unknown, description: string): void;
}

export interface Config {
  /**
   * Function that can be used to initialize the app context and register local variables. Default: () => {}
   */
  context?: (register: RegisterFunction) => Promise<void> | void;
  /**
   * Message to be printed when the repl starts. Default: ""
   */
  welcomeMessage?: string;
  /**
   * Path to the node repl history file. Default: ~/.node_repl_history
   */
  nodeReplHistoryPath?: string;
  /**
   * Function to be called when the repl exits. Default: process.exit
   */
  onExit?: (code?: number) => never;
  /**
   * Whether to print registered variables in the repl. Default: true
   */
  printRegisteredVariables?: boolean;
};

/**
 * @param config Repl configuration.
 */
export const runRepl = async (config: Config): Promise<void> => {
  const defaultConfig: Required<Config> = {
    context: () => {},
    welcomeMessage: '',
    nodeReplHistoryPath: path.join(os.homedir(), '.node_repl_history'),
    onExit: process.exit,
    printRegisteredVariables: true,
  }

  const options: Required<Config> = Object.assign(defaultConfig, config);

  process.env.NODE_REPL_HISTORY = options.nodeReplHistoryPath;

  const vars: Record<string, string> = {};

  const replServer = repl.start();

  replServer.on('exit', options.onExit);

  const register: RegisterFunction = (key, value, description) => {
    replServer.context[key] = value;
    vars[key] = description;
  };

  await options.context(register);

  register('vars', vars, 'all the local vars');

  replServer.setupHistory(options.nodeReplHistoryPath, (err) => {
    if (err) console.log(err);
  });

  if (options.printRegisteredVariables) {
    console.log('Registered variables:');
    console.log(vars);
  }

  if (options.welcomeMessage) {
    console.log(options.welcomeMessage);
  }

  replServer.displayPrompt();
};
