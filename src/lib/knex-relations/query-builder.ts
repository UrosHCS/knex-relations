import { KnexQB, RelationsMap, Table, ID, Row } from '.';

export class QueryBuilder<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>> {
  query: KnexQB<Model>;

  constructor(readonly table: Table<Model, R>) {
    this.query = this.table.query();
  }

  latest(column = 'id'): this {
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
    this.query.where('id', id as unknown as ID);
    return this;
  }

  async get(): Promise<Model[]> {
    const result = await this.query;
    return result as Model[];
  }

  async first(): Promise<Model | undefined> {
    const result = await this.query.first();
    return result as Model | undefined;
  }

  async firstOrFail(): Promise<Model> {
    const result = await this.first();
    if (!result) {
      throw new Error(`${this.table.capitalizeSingular()} not found`);
    }

    return result;
  }
}
