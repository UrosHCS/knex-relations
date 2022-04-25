import knex, { Knex } from "knex";
import { Relation } from "../relations/relation";
import { Row } from "../types";
import { Table } from "./table";

type Relations<Parent> = Record<string, Relation<Parent, any, string, any>>;

export class Schema<M extends Row, R extends Relations<M>> {
  constructor(
    public readonly table: Table<M>,
    public readonly relations: R,
  ) {}

  query() {
    return this.table.query();
  }

  async loadRelations<N extends keyof R>(results: M[], relationNames: N[]): Promise<void> {
    await Promise.all(relationNames.map(relationName => {
      this.loadRelation(results, relationName);
    }));
  }

  getRelation<N extends keyof R>(relationName: N): R[N] {
    const relation =  this.relations[relationName];

    if (!relation) {
      throw new Error(`Relation ${relationName} does not exist.`);
    }

    return relation;
  }

  loadRelation<N extends keyof R>(results: M[], relationName: N): ReturnType<R[N]['populate']> {
    const relation = this.getRelation<N>(relationName);
    // @ts-expect-error
    return relation.populate(results);
  }

  loadNested<T>(results: M[], nestedRelations: string): Promise<T> {
    const relations = nestedRelations.split('.');

    if (relations.length === 0) {
      throw new Error('Cannot load empty relation name');
    }

    if (relations.length === 1) {
      return this.loadRelation(results, relations[0]) as Promise<T>;
    }

    // TODO: Load nested relations

    return this.loadRelation(results, relations[0]) as Promise<T>;
  }
}