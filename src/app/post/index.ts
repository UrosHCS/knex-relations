import { PostQueryBuilder } from "./post-query-builder";
import { postRepository } from "./post-repository";
import { postsTable } from "./posts-table";

export const postModule = {
  repo: postRepository,
  qb: () => new PostQueryBuilder(),
  table: postsTable,
};