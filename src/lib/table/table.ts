import { DB, getDatabase, KnexQB } from '.';
import { Relation } from '../relations/relation';
import { QBCallback, Row } from '../types';

export type TableConfig<Model> = {
  // Table's primary key. Default is "id".
  primaryKey?: keyof Model;
  // Database connection or a function that returns it.
  db?: DB | (() => DB);
};

/**
 * Generic relations map.
 */
export type RelationsMap<Parent extends Row> = Record<string, Relation<Parent, any, string, any>>;

export type RelationBuilder<Model extends Row, R extends RelationsMap<Model>> = (table: Table<Model, R>) => R;

export type ResolveChild<T> = T extends Relation<infer P, infer Child, infer N, infer A> ? Child : never;
export type ResolvePopulation<T> = T extends Relation<infer P, infer C, infer N, infer Population> ? Population : never;

const DEFAULT_PRIMARY_KEY = 'id';

export class Table<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>> {
  relations: R = {} as R;
  readonly primaryKey: keyof Model;
  readonly db: DB;

  constructor(
    readonly name: string,
    readonly singular: string,
    private relationBuilder?: RelationBuilder<Model, R>,
    config?: TableConfig<Model>,
  ) {
    this.primaryKey = config?.primaryKey ?? DEFAULT_PRIMARY_KEY;
    this.db = this.resolveDb(config?.db);
  }

  init(): this {
    if (this.relationBuilder) {
      this.relations = this.relationBuilder(this);
      // Remove relation builder from memory and prevent running it more than once.
      this.relationBuilder = undefined;
    }

    return this;
  }

  private resolveDb<Model>(db: TableConfig<Model>['db']): DB {
    if (!db) {
      return getDatabase();
    }

    return this.dbIsFunction(db) ? db() : db;
  }

  private dbIsFunction<Model>(db: TableConfig<Model>['db']): db is () => DB {
    return typeof db === 'function';
  }

  query() {
    return this.db<Model>(this.name);
  }

  async loadMany(results: Model[], relationNames: string[]): Promise<void> {
    await Promise.all(
      relationNames.map(relationName => {
        this.load(results, relationName);
      }),
    );
  }

  getRelation<N extends keyof R>(relationName: N): R[N] {
    const relation = this.relations[relationName];

    if (!relation) {
      throw new Error(`Relation "${relationName}" does not exist.`);
    }

    return relation;
  }

  load<N extends keyof R>(
    results: Model[],
    relationName: N,
  ): Promise<
    Array<
      Model & {
        [key in N]: ResolvePopulation<R[N]>;
      }
    >
  >;
  load<N extends keyof R, T>(
    results: Model[],
    relationName: N,
    callback: QBCallback<ResolveChild<R[N]>, T>,
  ): Promise<Array<Model & { [key in N]: ResolvePopulation<R[N]> extends any[] ? T[] : T }>>;
  load<N extends keyof R, T>(results: Model[], relationName: N, callback?: QBCallback<ResolveChild<R[N]>, T>) {
    const relation = this.getRelation(relationName);

    if (callback) {
      return relation.load(results, callback);
    }

    return relation.load(results);
  }

  async loadNested<T extends Model[]>(results: Model[], nestedRelationNames: string): Promise<T> {
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
      return this.load(results, relationName) as unknown as Promise<T>;
    }

    const relation = this.getRelation(relationName);

    const children = await relation.loadChildren(results);

    relation.childTable.doLoadNested(children, nestedRelationNames.slice(1));

    relation.mapChildrenToParents(results, children);

    return results as T;
  }
}
