import { app } from "./app.ts";
import { env } from "./env.ts";

console.log(`[jeda-backend] listening on http://localhost:${env.PORT}`);

// Bun.serve entry point.
export default {
  port: env.PORT,
  fetch: app.fetch,
};
