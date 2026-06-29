import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "../env.ts";
import * as schema from "./schema/index.ts";

// Neon HTTP driver (PRD 8): suitable for serverless/scale-to-zero, single-statement
// queries over HTTP. Multi-statement transactions are not supported — sufficient for MVP CRUD.
/**
 * Scope: index.ts
 * Purpose: Neon HTTP database client and Drizzle ORM instance — single entry point for all DB access.
 */
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema, casing: "snake_case" });
