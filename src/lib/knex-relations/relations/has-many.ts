import { Row } from '..';

import { HasOneOrMany } from './has-one-or-many';
/**
 * one-to-many relation where the child table has a foreign key to the parent table.
 */
export class HasMany<Parent extends Row, Child extends Row, N extends string> extends HasOneOrMany<
  Parent,
  Child,
  N,
  false
> {
  protected override isToOne: false = false;
}
