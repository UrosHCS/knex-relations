import knex, { Knex } from "knex";
import { config } from "./config";

let db: Knex | null = null;

export function connect() {
  if (db) {
    return db;
  }

  db = knex(config.db.knexConfig);

  return db;
}

export function disconnect() {
  if (!db) {
    return;
  }

  db.destroy();
  db = null;
}

export { db };