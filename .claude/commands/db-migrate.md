# /db-migrate

Safely apply a Drizzle ORM schema change from edit through migration.

## Steps

### 1. Edit the schema

Modify the relevant file in `src/db/schema/`:

- `entries.schema.ts` — entries table
- `weekly-summaries.schema.ts` — weekly summaries table
- New entity: create `<entity>.schema.ts` + add to `src/db/schema/index.ts`

Rules:

- Column names must be snake_case (Drizzle casing: `snake_case`)
- Use `$inferSelect` and `$inferInsert` for TypeScript types — never duplicate them
- Never hand-edit `drizzle/**` migration files

### 2. Generate the migration

```bash
rtk bun run db:generate
```

Drizzle Kit reads the schema diff and writes a new SQL file under `drizzle/`.

### 3. Inspect the generated SQL

Read the new migration file in `drizzle/`. Verify:

- [ ] Only the intended columns/tables are affected
- [ ] No unexpected `DROP` or `ALTER` statements
- [ ] Column types match the intent (timestamps, text, integer, etc.)

If the SQL looks wrong: delete the migration file, fix the schema, regenerate.

### 4. Apply the migration

```bash
# Production / staging — run the migration:
rtk bun run db:migrate

# Dev only — push schema directly (skips migration history):
rtk bun run db:push
```

### 5. Verify

```bash
rtk bun run db:studio   # open Drizzle Studio to inspect the live table
```

### 6. Regenerate OpenAPI if response shapes changed

```bash
rtk bun run openapi:generate
```

### 7. Update affected Zod schemas and TypeScript types

If a column was added or removed, update:

- `src/modules/<m>/<m>.schema.ts` — Zod input/output schemas
- `src/modules/<m>/<m>.service.ts` — if shape is used in logic

## Notes

- neon-http does **not** support multi-statement transactions — each `db.execute()` is atomic
- The `drizzle/` directory is generated — never commit hand-edited migration files
- Migrations are append-only; never edit an already-applied migration
