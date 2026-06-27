---
paths:
  - "src/db/**/*.ts"
  - "src/modules/**/*.repository.ts"
  - "drizzle.config.ts"
---

# Database (Drizzle + Neon)

## Driver Constraints (neon-http)

The project uses the Neon HTTP driver (`drizzle-orm/neon-http`):

- **No multi-statement transactions.** `db.transaction(...)` is not supported over HTTP.
  Design single-statement, idempotent operations. See
  `.claude/anti-patterns/neon-http-no-transactions.md`.
- Each query is a network round-trip — minimize them (avoid N+1, batch where possible).

## Schema Definition

```typescript
export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  sentimentScore: real("sentiment_score"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
```

- One table file per entity: `src/db/schema/<entity>.schema.ts`, re-exported from `schema/index.ts`
- Columns are `snake_case`; the client and drizzle-kit both set `casing: "snake_case"`
- Always derive types via `$inferSelect` / `$inferInsert` — never restate row shapes
- Client may supply `id`/`createdAt` for idempotent device→cloud sync

## Query Rules

- Drizzle query builder / relational queries only — **no raw string SQL**
- Compose conditions safely:

```typescript
const conditions = [
  filter.from ? gte(entries.createdAt, filter.from) : undefined,
  filter.to ? lte(entries.createdAt, filter.to) : undefined,
].filter((c) => c !== undefined);

return db
  .select()
  .from(entries)
  .where(conditions.length > 0 ? and(...conditions) : undefined)
  .orderBy(desc(entries.createdAt))
  .limit(filter.limit);
```

- Always apply a `limit` on list queries
- `insert().returning()` yields rows — `const [row] = ...; return row!` is safe (always one row)
- `delete().returning({ id })` then check `length > 0` to detect not-found

## Migrations (generated — never hand-edit)

```bash
rtk bun run db:generate   # diff schema → SQL migration under drizzle/
rtk bun run db:migrate    # apply migrations (production path)
rtk bun run db:push       # push schema directly (DEV ONLY — no migration file)
rtk bun run db:studio     # inspect data
```

`drizzle/` is generated and protected. Change the schema, regenerate — don't edit SQL by hand.

## Casing Pitfall

If the Drizzle client `casing` and drizzle-kit `casing` disagree, column mapping breaks
silently. Keep both `"snake_case"`. See `.claude/anti-patterns/neon-snake-case-casing.md`.
