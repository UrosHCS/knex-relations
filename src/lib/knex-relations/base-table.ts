import { DB, getDatabase } from '.';

export abstract class BaseTable<Model> {
  public abstract name: string;
  public abstract db?: DB | null;

  /**
   * Initialization logic.
   */
  abstract init(): this;

  /**
   * Make a query FROM the current table.
   */
  query() {
    // Don't cache (set the db on this) when getting it from getDatabase() so that
    // we always get the object from the same module as the getDatabase function
    const db = this.db ?? getDatabase();

    return db<Model>(this.name);
  }

  async create(attributes: Partial<Model>): Promise<Model> {
    const rows = await this.query()
      .returning('*')
      .insert(attributes as any);

    // The type of rows will be number[], since a simple insert statement will return
    // a single row with the inserted id, which is translated to a number[] type.
    // Chaining the .returning('*') changes the type to Model[], but knex doesn't
    // type it correctly, so we need to cast it to Model[] manually.
    // We actually just cast the first element from the number type to the Model type.
    return rows[0] as unknown as Model;
  }

  async count(column = '*'): Promise<string | number> {
    const rows = await this.query().count(column as string, { as: 'count' });

    return rows[0].count;
  }
}
