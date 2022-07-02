import { expect } from '@japa/expect';
import { runFailedTests } from '@japa/run-failed-tests';
import { processCliArgs, configure, run } from '@japa/runner';
import { specReporter } from '@japa/spec-reporter';

process.env.NODE_ENV = 'test';

configure({
  ...processCliArgs(process.argv.slice(2)),
  files: ['tests/**/*.test.ts'],
  plugins: [expect(), runFailedTests()],
  reporters: [specReporter()],
  importer: filePath => import(filePath),
});

run();
