import { BelongsTo } from "../relations/belongs-to";
import { BelongsToMany } from "../relations/belongs-to-many";
import { HasMany } from "../relations/has-many";
import { HasOne } from "../relations/has-one";
import { Table } from "../table/table";
import { Row } from "../types";

export function hasMany<Parent extends Row, Child extends Row, R extends string>(parentTable: Table<Parent>, childTable: Table<Child>, relationName: R) {
  return new HasMany(parentTable, childTable, relationName);
}

export function hasOne<Parent extends Row, Child extends Row, R extends string>(parentTable: Table<Parent>, childTable: Table<Child>, relationName: R) {
  return new HasOne(parentTable, childTable, relationName);
}

export function belongsTo<Parent extends Row, Child extends Row, R extends string>(parentTable: Table<Parent>, childTable: Table<Child>, relationName: R) {
  return new BelongsTo(parentTable, childTable, relationName);
}

export function belongsToMany<Parent extends Row, Child extends Row, R extends string>(parentTable: Table<Parent>, childTable: Table<Child>, relationName: R) {
  return new BelongsToMany(parentTable, childTable, relationName);
}