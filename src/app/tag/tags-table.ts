import { Table, BelongsToMany } from '../../lib/knex-relations';
import { Post, postsTable } from '../post/posts-table';

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export type TagRelations = {
  posts: BelongsToMany<Tag, Post, 'posts'>;
};

export const tagsTable: Table<Tag, TagRelations> = new Table('tags', 'tag', tagsTable => ({
  posts: new BelongsToMany(tagsTable, postsTable, 'posts'),
}));
