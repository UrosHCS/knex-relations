import knex, { Knex } from "knex";
import { config } from "./config";

let db: Knex;

export function connect() {
  if (db) {
    return db;
  }

  db = knex(config.db.sqlite);

  return db;
}

export function disconnect() {
  if (!db) {
    return;
  }

  db.destroy();
}

export { db };