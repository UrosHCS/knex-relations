import { Tag, tagsTable } from '../../app/tag/tags-table';
import { chance } from '../chance';

import { Factory } from './factory';

export class TagFactory extends Factory<Tag> {
  table = tagsTable;

  override definition(): Partial<Tag> {
    return {
      name: chance.name(),
    };
  }
}
