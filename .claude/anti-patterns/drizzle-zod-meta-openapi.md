# Anti-Pattern: Missing .meta({ id }) on Zod Schemas → Broken OpenAPI Component Names

## Trap

When a Zod schema is used in `describeRoute` without `.meta({ id: "..." })`,
hono-openapi cannot generate a named `$ref` for it. Instead, it inlines the
schema anonymously or produces an ugly auto-generated name. The Scalar UI
and Swift client codegen both break or produce unreadable output.

## Wrong

```typescript
// No .meta({ id }) — will be inlined as anonymous object in OpenAPI spec
export const CreateEntrySchema = z.object({
  content: z.string(),
  mood: z.number().int().min(1).max(5),
});
```

## Right

```typescript
export const CreateEntrySchema = z
  .object({
    content: z.string(),
    mood: z.number().int().min(1).max(5),
  })
  .meta({ id: "CreateEntryRequest" });

export const EntrySchema = z
  .object({
    id: z.string().uuid(),
    content: z.string(),
    mood: z.number().int(),
    createdAt: z.string().datetime(),
  })
  .meta({ id: "EntryResponse" });
```

The `id` value becomes the `$ref` name in the OpenAPI components section:
`#/components/schemas/CreateEntryRequest`.

## drizzle-zod

When using `createSelectSchema` / `createInsertSchema` from `drizzle-zod`,
chain `.meta({ id })` on the derived schema:

```typescript
import { createSelectSchema } from "drizzle-zod";
import { entries } from "../../db/schema/index.ts";

export const EntrySchema = createSelectSchema(entries).meta({ id: "Entry" });
```

## Verify

After any schema change, regenerate and inspect the spec:

```bash
rtk bun run openapi:generate
git diff openapi.json   # check that $ref names are correct, not inline blobs
```

## References

- `src/modules/entries/entries.schema.ts` — correct `.meta({ id })` usage
- rules/backend/openapi.md — full OpenAPI contract discipline
- `.claude/commands/openapi-sync.md` — sync workflow
