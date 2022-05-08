import { KnexQB, RelationsMap, Table } from '.';
import { ID } from '../relations';
import { Row } from '../types';

export class QueryBuilder<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>> {
  query: KnexQB<Model>;

  constructor(readonly table: Table<Model, R>) {
    this.query = this.table.query();
  }

  latest(column: keyof Model = 'id'): this {
    this.query.orderBy(column, 'desc');
    return this;
  }

  notSoftlyDeleted(column = 'deleted_at'): this {
    this.query.whereNull(column);
    return this;
  }

  softlyDeleted(column = 'deleted_at'): this {
    this.query.whereNotNull(column);
    return this;
  }

  wherePK(id: Model[typeof this.table.primaryKey]): this {
    this.query.where('id', id as ID);
    return this;
  }
}
