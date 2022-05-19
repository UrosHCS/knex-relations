import { Row, HasOneOrMany } from '..';

/**
 * one-to-one relation where the child table has a foreign key to the parent table.
 */
export class HasOne<Parent extends Row, Child extends Row, N extends string> extends HasOneOrMany<
  Parent,
  Child,
  N,
  true
> {
  protected override isToOne: true = true;
}
