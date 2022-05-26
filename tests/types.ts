import '@japa/runner';
import { default as jestExpect } from 'expect';

declare module '@japa/runner' {
  interface TestContext {
    // This is already defined in @japa/expect but vs code
    // doesn't realize that always.
    expect: typeof jestExpect;
  }
  // interface Test<TestData> {
  // notify TypeScript about custom test properties
  // }
}
