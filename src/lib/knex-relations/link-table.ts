import { BaseTable } from './base-table';

import { DB } from '.';

export class LinkTable<Model> extends BaseTable<Model> {
  constructor(public name: string, public db?: DB) {
    super();
  }

  /**
   * Nothing to init in a link table.
   */
  init(): this {
    return this;
  }
}
