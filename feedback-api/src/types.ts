/** Bindings and secrets the Worker reads. */
export interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  IP_SALT: string;
}
