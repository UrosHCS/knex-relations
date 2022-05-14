/* eslint-disable prettier/prettier */
import { db } from '../../core/db';
import { KnexQB } from '../../lib/table';

interface User {
  id: number;
  email: string;
}

interface Post {
  id: number;
  body: string;
  user_id: number;
}

async function test<T>(callback: (qb: KnexQB<Post>) => Promise<T[]>): Promise<T> {
  const r = await callback(db<Post>('posts'));
  return r[0];
}

async function run() {
  const result = test(qb => qb.select('body').then(row => row));

  return result;
}

run();
