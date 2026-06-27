import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { env } from "../env.ts";

// Runs at production startup (`bun run start`) to apply migrations
// from ./drizzle to the Neon database.
/**
 * Scope: migrate.ts
 * Purpose: Production migration runner — applies pending Drizzle migrations to the Neon database at startup.
 */

async function main() {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("[migrate] applying migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] done.");
}

main().catch((error) => {
  console.error("[migrate] failed:", error);
  process.exit(1);
});
