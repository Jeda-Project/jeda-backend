# Anti-Pattern: Missing snake_case Casing Config → Silent Column Mapping Failures

## Trap

Drizzle ORM defaults to using column names exactly as written in the schema.
If you write `createdAt` in the schema definition, Drizzle queries for `createdAt`
in Postgres — but the actual column is `created_at`. The query silently returns
`undefined` for that field with no error.

## Why It Happens

This project uses `casing: "snake_case"` in both the Drizzle client and `drizzle.config.ts`.
This tells Drizzle to automatically map camelCase TypeScript property names to
snake_case Postgres column names. If this config is missing or inconsistent, the
mapping breaks silently.

## Symptom

A field like `createdAt` returns `undefined` in query results even though
the data is in the database. TypeScript does not catch this at compile time
because `$inferSelect` types the field as non-optional.

## The Config That Must Be Present

**`src/db/index.ts`** (Drizzle client):

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema/index.ts";
import { env } from "../env.ts";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema, casing: "snake_case" });
```

**`drizzle.config.ts`** (Drizzle Kit for migrations):

```typescript
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./drizzle",
  casing: "snake_case", // must match the client
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

## Adding a New Schema File

When adding a new table schema:

1. Define columns in camelCase TypeScript — Drizzle maps them to snake_case automatically
2. Export from `src/db/schema/index.ts`
3. Run `rtk bun run db:generate` and inspect the SQL — column names should be snake_case
4. Never manually specify a `snake_case` column name as a second argument if `casing` is set

## References

- `src/db/index.ts` — casing config in client
- `drizzle.config.ts` — casing config in Drizzle Kit
- rules/backend/database.md — Drizzle column naming conventions
