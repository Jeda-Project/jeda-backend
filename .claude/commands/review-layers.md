# /review-layers

Audit layer-boundary violations across the codebase (or a specified module).

## What to Check

### Routes (`*.routes.ts`) — must NOT contain:

- Business logic (conditionals, calculations, domain decisions)
- Direct Drizzle/DB access (`db.select`, `db.insert`, etc.)
- Raw error construction (use `handleAppError` + `DomainError`)

### Services (`*.service.ts`) — must NOT contain:

- HTTP context (`Context`, `c.req`, `c.json`, status codes)
- Direct Drizzle imports or raw SQL
- `import { … } from "hono"`

### Repositories (`*.repository.ts`) — must NOT contain:

- Business rules or domain decisions
- HTTP types
- Throwing `DomainError` subclasses (repositories throw raw DB errors; services catch and reclassify)

### DB / Schema (`src/db/`) — must NOT contain:

- Business logic
- HTTP types
- Zod request/response schemas (those belong in `*.schema.ts`)

## Steps

1. Identify scope (whole codebase or specific module path)
2. Read each layer file in the module
3. Check for cross-layer imports and misplaced logic
4. Report violations with file:line references

## Output Format

```
[CRITICAL] DB access in route handler
File: src/modules/<m>/<m>.routes.ts:42
Issue: Direct `db.select()` call in route — bypasses service layer.
Fix: Move query to <m>.repository.ts; call via <m>Service.<method>().
```

End with a layer-health summary per module reviewed.
