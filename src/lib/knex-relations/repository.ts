import { Table, Row } from '.';

export abstract class Repository<TRecord extends Row> {
  abstract table: Table<TRecord>;

  query() {
    return this.table.query();
  }

  select(columns: string | string[] = '*') {
    return this.query().select(columns);
  }

  first() {
    return this.query().first();
  }
}
