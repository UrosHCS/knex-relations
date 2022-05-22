import { test } from '@japa/runner';

test.group('Maths.add', () => {
  test('add two numbers', ({ expect }) => {
    expect(2 + 2).toBe(4);
  });
});
