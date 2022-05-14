// import { BelongsTo } from '../relations/belongs-to';
// import { BelongsToMany } from '../relations/belongs-to-many';
// import { HasMany } from '../relations/has-many';
// import { HasOne } from '../relations/has-one';
// import { Table } from '../table/table';
// import { Row } from '../types';

// export function hasMany<Parent extends Row, Child extends Row, N extends string>(
//   parentTable: Table<Parent>,
//   childTable: Table<Child>,
//   relationName: N,
// ) {
//   return new HasMany(parentTable, childTable, relationName);
// }

// export function hasOne<Parent extends Row, Child extends Row, N extends string>(
//   parentTable: Table<Parent>,
//   childTable: Table<Child>,
//   relationName: N,
// ) {
//   return new HasOne(parentTable, childTable, relationName);
// }

// export function belongsTo<Parent extends Row, Child extends Row, N extends string>(
//   parentTable: Table<Parent>,
//   childTable: Table<Child>,
//   relationName: N,
// ) {
//   return new BelongsTo(parentTable, childTable, relationName);
// }

// export function belongsToMany<Parent extends Row, Child extends Row, N extends string>(
//   parentTable: Table<Parent>,
//   childTable: Table<Child>,
//   relationName: N,
// ) {
//   return new BelongsToMany(parentTable, childTable, relationName);
// }

export * from './belongs-to-many';
export * from './belongs-to';
export * from './has-many';
export * from './has-one';
export * from './relation';
export * from './relation';
export * from './types';
