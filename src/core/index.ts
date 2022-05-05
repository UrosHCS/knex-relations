import { setDatabase } from "../lib/table";
import { connect } from "./db";

export async function boot() {
  // Connect knex to the database and
  // set the database instance to the global variable
  setDatabase(connect());

  // Import the app asynchronously because table creation needs to wait for the database to be connected
  const app = await import('../app');

  return app;
}