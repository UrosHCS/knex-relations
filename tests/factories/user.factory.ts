import { Post, postsTable } from '../../src/app/post/posts-table';
import { User, usersTable } from '../../src/app/user/users-table';
import { Table } from '../../src/lib/knex-relations';

export abstract class Factory<T> {
  protected abstract table: Table<T>;
  protected attributes: Partial<T> = {};

  abstract definition(attributes: Partial<T>): Promise<Partial<T>> | Partial<T>;

  state(attributes: Partial<T>) {
    Object.assign(this.attributes, attributes);

    return this;
  }

  async create(attributes: Partial<T> = {}): Promise<T> {
    attributes = await this.make(attributes);

    const model = await this.table.create(attributes);

    return model;
  }

  async make(attributes: Partial<T> = {}): Promise<Partial<T>> {
    // First get the attributes from the defined factory.
    const factoryAttributes = await this.definition(attributes);

    // Then override them with the state attributes.
    // Then override them with the attributes passed to this method.
    return { ...factoryAttributes, ...this.attributes, ...attributes };
  }

  async createMany(amount: number, attributes: Partial<T> = {}): Promise<T[]> {
    const creators: Promise<T>[] = [];

    while (amount--) {
      creators.push(this.create(attributes));
    }

    return Promise.all(creators);
  }

  async makeMany(amount: number, attributes: Partial<T> = {}): Promise<Partial<T>[]> {
    const makers: Promise<Partial<T>>[] = [];

    while (amount--) {
      makers.push(this.make(attributes));
    }

    return Promise.all(makers);
  }
}

export class UserFactory extends Factory<User> {
  table = usersTable;

  override definition(): Partial<User> {
    return {
      name: 'John',
      email: 'john@example.com',
    };
  }
}

export class PostFactory extends Factory<Post> {
  table = postsTable;

  override definition(attributes: Partial<Post>): Partial<Post> {
    return {
      body: 'This is my body',
      ...attributes,
    };
  }
}
