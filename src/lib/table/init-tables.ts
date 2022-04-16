import { Table } from "./table";

export function initTables(tables: Table<any>[]): void {
  tables.forEach(table => table.init());
}
