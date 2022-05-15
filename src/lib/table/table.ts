import { DB, getDatabase } from '.';
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
export type RelationsMap<Parent extends Row> = Record<string, Relation<Parent, any, string, boolean>>;

export type RelationBuilder<Model extends Row, R extends RelationsMap<Model>> = (table: Table<Model, R>) => R;

export type ResolveChild<T> = T extends Relation<any, infer Child, any, any> ? Child : never;
export type ResolveIsOne<T> = T extends Relation<any, any, any, infer IsOne> ? IsOne : never;

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
  ): Promise<Model & { [key in N]: ResolveIsOne<R[N]> extends true ? ResolveChild<R[N]> : ResolveChild<R[N]>[] }>;
  load<N extends keyof R, T>(
    results: Model[],
    relationName: N,
    callback: QBCallback<ResolveChild<R[N]>, T>,
  ): Promise<Model & { [key in N]: ResolveIsOne<R[N]> extends true ? T : T[] }>;
  load<N extends keyof R, T>(results: Model[], relationName: N, callback?: QBCallback<ResolveChild<R[N]>, T>) {
    const relation = this.getRelation(relationName);

    if (callback) {
      return relation.load(results, callback);
    }

    // TODO: make relation.load and table.load compatible and remove "as any".
    return relation.load(results) as any;
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

    relation.childTable.doLoadNested(children as Row[], nestedRelationNames.slice(1));

    relation.mapChildrenToParents(results, children as Row[]);

    return results as T;
  }
}
