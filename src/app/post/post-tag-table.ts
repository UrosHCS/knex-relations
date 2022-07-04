import { LinkTable } from '../../lib/knex-relations/link-table';

export interface PostTag {
  post_id: number;
  tag_id: number;
}

export const postTagTable: LinkTable<PostTag> = new LinkTable('post_tag');
