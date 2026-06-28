---
paths:
  - "src/modules/**/*.schema.ts"
  - "src/modules/**/*.routes.ts"
  - "src/lib/openapi.ts"
  - "src/lib/schemas.ts"
  - "src/scripts/generate-openapi.ts"
---

# OpenAPI Contract Discipline

The OpenAPI spec is the contract that generates the **Swift iOS client**. Keep it
accurate and stable.

## Schema Metadata

Tag reusable Zod schemas with a stable component id so the spec has clean names:

```typescript
export const entrySchema = createSelectSchema(entries).meta({ id: "Entry" });

export const createEntryBodySchema = z
  .object({
    /* ... */
  })
  .meta({ id: "CreateEntryBody" });
```

- Read schemas derive from Drizzle via `createSelectSchema(...)` (drizzle-zod)
- Every shared request/response schema gets `.meta({ id })` (see
  `.claude/anti-patterns/drizzle-zod-meta-openapi.md`)
- Reuse `jsonContent(schema, description)` and `errorResponse(description)` from `src/lib/schemas.ts`

## Route Documentation

Each route must declare, in `describeRoute`:

- `operationId` (camelCase, unique) — becomes the Swift method name
- `tags` (group, e.g. `["Entries"]`)
- `summary`
- **every** response status it can return, wrapped with `jsonContent` / `errorResponse`

A response status that exists in code but not in `describeRoute` is a contract bug.

## Generation (generated artifact — never hand-edit)

```bash
rtk bun run openapi:generate   # dumps openapi.json
```

`openapi.json` is generated and protected (`generated-guard.sh`). Regenerate it after
any change to routes or response schemas; never edit it by hand.

## Swift Client

```bash
rtk bun run openapi:generate
openapi-generator-cli generate -i openapi.json -g swift6 -o ./ios-client
```

When a contract change lands, note in the PR that the iOS client must be regenerated.

## Stability

- Don't rename `operationId`s casually — it breaks the generated client API
- Additive changes (new optional fields, new endpoints) are safe; removals/renames are breaking
