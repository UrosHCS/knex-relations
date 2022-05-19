import { Row } from '../types';
import { HasOneOrMany } from './has-one-or-many';
import { ID } from '.';

export class HasMany<Parent extends Row, Child extends Row, N extends string> extends HasOneOrMany<
  Parent,
  Child,
  N,
  false
> {
  protected override isToOne: false = false;
}
