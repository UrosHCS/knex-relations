import { Table } from ".";
import { QueryBuilder } from "./query-builder";

export abstract class Repository<TRecord> {
  abstract table: Table<TRecord, any>;

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
