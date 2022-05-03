import { connect } from "./db";

export function boot() {
  connect();
}