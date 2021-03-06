import { BaseTable } from './base-table';
import { Relation } from './relations/relation';

import { RelationsMap } from './types';

import { DB, ChildShape, QBCallback, Row } from '.';

export type TableConfig<Model extends Row> = {
  // Table's primary key. Default is "id".
  primaryKey?: keyof Model;
  // Database connection or a function that returns it.
  db?: DB;
};

type RelationBuilder<Model extends Row, R extends RelationsMap<Model>> = (table: Table<Model, R>) => R;

type ResolveChild<T> = T extends Relation<any, infer Child, any, any> ? Child : never;
type ResolveIsOne<T> = T extends Relation<any, any, any, infer IsOne> ? IsOne : never;

const DEFAULT_PRIMARY_KEY = 'id';

export class Table<Model extends Row, R extends RelationsMap<Model> = RelationsMap<Model>> extends BaseTable<Model> {
  relations: R = {} as R;
  primaryKey: keyof Model;
  db: DB | null;

  constructor(
    public name: string,
    public singular: string,
    private relationBuilder?: RelationBuilder<Model, R> | null,
    config?: TableConfig<Model>,
  ) {
    super();
    this.primaryKey = (config?.primaryKey ?? DEFAULT_PRIMARY_KEY) as keyof Model;
    this.db = config?.db ?? null;
  }

  /**
   * Relations (can) have circular dependencies, so we need this method to solve the
   * issues that come with circular dependencies.
   */
  init(): this {
    if (this.relationBuilder) {
      this.relations = this.relationBuilder(this);
      // Remove relation builder from memory and prevent running it more than once.
      this.relationBuilder = undefined;
    }

    return this;
  }

  capitalizeSingular() {
    return this.singular.charAt(0).toUpperCase() + this.singular.slice(1);
  }

  /**
   * Load multiple relations by their names.
   */
  async loadMany(results: Model[], relationNames: string[]): Promise<void> {
    await Promise.all(
      relationNames.map(relationName => {
        return this.load(results, relationName);
      }),
    );
  }

  /**
   * Check if the relation exists on this table and return it.
   */
  getRelation<N extends keyof R>(relationName: N): R[N] {
    const relation = this.relations[relationName];

    if (!relation) {
      throw new Error(`Relation "${relationName as string}" does not exist.`);
    }

    return relation;
  }

  /**
   * Load a relation by its name. Optionally pass a callback
   * that can manipulate the children query before it is executed.
   */
  load<N extends keyof R>(
    results: Model[],
    relationName: N,
  ): Promise<Array<Model & { [key in N]: ChildShape<ResolveIsOne<R[N]>, ResolveChild<R[N]>> }>>;
  load<N extends keyof R, T>(
    results: Model[],
    relationName: N,
    callback: QBCallback<ResolveChild<R[N]>, T>,
  ): Promise<Array<Model & { [key in N]: ChildShape<ResolveIsOne<R[N]>, T> }>>;
  load<N extends keyof R, T>(results: Model[], relationName: N, callback?: QBCallback<ResolveChild<R[N]>, T>) {
    const relation = this.getRelation(relationName);

    if (callback) {
      return relation.load(results, callback);
    }

    return relation.load(results);
  }

  /**
   * Load a nested relation, separated by the dot notation.
   */
  async loadNested<T extends Model[]>(results: Model[], nestedRelationNames: string): Promise<T> {
    const relationNames = nestedRelationNames.split('.');

    // relationNames.length should never be zero because .split()
    // always returns an array with at least one element

    return this.doLoadNested(results, relationNames);
  }

  /**
   * Recursive function that performs the actual loading of nested relations.
   */
  private async doLoadNested<T extends Model[]>(results: Model[], nestedRelationNames: string[]): Promise<T> {
    if (nestedRelationNames.length === 0) {
      return results as T;
    }

    const relationName = nestedRelationNames[0];

    if (relationName === '') {
      return results as T;
    }

    if (nestedRelationNames.length === 1) {
      return this.load(results, relationName) as Promise<T>;
    }

    const relation = this.getRelation(relationName);

    const children = await relation.loadChildren(results);

    relation.childTable.doLoadNested(children, nestedRelationNames.slice(1));

    relation.mapChildrenToParents(results, children);

    return results as T;
  }
}
