import { DB, getDatabase } from ".";
import { Relation } from "../relations/relation";
import { Row } from "../types";

export type TableConfig<Model> = {
  // Table's primary key. Default is "id".
  primaryKey?: keyof Model;
  // Database connection or a function that returns it.
  db?: DB | (() => DB);
};

/**
 * Generic relations map.
 */
export type RelationsMap<Parent> = Record<string, Relation<Parent, any, string, any>>;

export type RelationBuilder<Model extends Row, R extends RelationsMap<Model>> = (table: Table<Model, R>) => R;

const DEFAULT_PRIMARY_KEY = 'id';

export class Table<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>> {
  readonly relations: R;
  readonly primaryKey: keyof Model;
  readonly db: DB;

  constructor(
    readonly name: string,
    readonly singular: string,
    relationBuilder?: RelationBuilder<Model, R>,
    config?: TableConfig<Model>,
  ) {
    this.relations = relationBuilder ? relationBuilder(this) : {} as R;
    this.primaryKey = config?.primaryKey ?? DEFAULT_PRIMARY_KEY;
    this.db = this.resolveDb(config?.db);
  }

  private resolveDb<Model>(db: TableConfig<Model>['db']): DB {
    if (!db) {
      return getDatabase();
    }

    return this.dbIsFunction(db) ? db() : db;
  }


  private dbIsFunction<Model>(db: TableConfig<Model>['db']): db is (() => DB) {
    return typeof db === 'function';
  }

  query() {
    return this.db<Model>(this.name);
  }

  async populateMany(results: Model[], relationNames: string[]): Promise<void> {
    await Promise.all(relationNames.map(relationName => {
      this.populate(results, relationName);
    }));
  }

  getRelation<N extends keyof R>(relationName: N): R[N] {
    const relation = this.relations[relationName];

    if (!relation) {
      throw new Error(`Relation "${relationName}" does not exist.`);
    }

    return relation;
  }

  populate<N extends keyof R>(results: Model[], relationName: N): ReturnType<R[N]['populate']> {
    const relation = this.getRelation(relationName);
    // @ts-expect-error
    return relation.populate(results);
  }

  async populateNested<T extends Model[]>(results: Model[], nestedRelationNames: string): Promise<T> {
    const relationNames = nestedRelationNames.split('.');

    // relationNames.length should never be zero because .split()
    // always returns an array with at least one element

    return this.doLoadNested(results, relationNames);
  }

  private async doLoadNested<T extends Model[]>(results: Model[], nestedRelationNames: string[]): Promise<T> {
    if (nestedRelationNames.length === 0) {
      return results as T;
    }

    const relationName = nestedRelationNames[0];

    if (relationName === '') {
      return results as T;
    }

    if (nestedRelationNames.length === 1) {
      return this.populate(results, relationName) as Promise<T>;
    }

    const relation = this.getRelation(relationName);

    const children = await relation.loadChildren(results);

    relation.childTable.doLoadNested(children, nestedRelationNames.slice(1));

    relation.mapChildrenToParents(results, children);

    return results as T;
  }
}
