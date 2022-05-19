import { Row } from '../types';
import { HasOneOrMany } from './has-one-or-many';
import { ID } from '.';

export class HasOne<Parent extends Row, Child extends Row, N extends string> extends HasOneOrMany<
  Parent,
  Child,
  N,
  true
> {
  protected override isToOne: true = true;
}
