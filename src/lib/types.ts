export type ID = string | number;

export type Row<T extends string | number | symbol> = Record<T, any>;
