---
paths:
  - "src/**/*.ts"
---

# Backend Coding Style

> Extends [common/coding-style.md](../common/coding-style.md) with TypeScript and backend-specific content.

## Types and Interfaces

- Add parameter and return types to exported functions, services, and repositories
- Let TypeScript infer obvious local variable types
- Extract repeated inline object shapes into named types or interfaces

```typescript
// WRONG: exported function without explicit types
export function buildFilter(query) {
  return { limit: query.limit };
}

// CORRECT: explicit types on public APIs
export function buildFilter(query: ListEntriesQuery): ListEntriesFilter {
  return { limit: query.limit };
}
```

### Interfaces vs. Type Aliases

- `interface` for object shapes that may be extended or implemented
- `type` for unions, intersections, tuples, mapped/utility types
- Prefer string-literal unions over `enum` (e.g. `type Severity = "critical" | "high" | "medium"`)

### Avoid `any`

- Avoid `any` in application code — treat it as a smell
- Use `unknown` for external/untrusted input, then narrow
- Use generics when a value's type depends on the caller

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}
```

## Strictness (tsconfig)

- `noUncheckedIndexedAccess` — index access yields `T | undefined`; narrow or assert with intent (`row!` only after a guaranteed insert/returning)
- `noUnusedLocals` / `noUnusedParameters` — remove dead bindings
- `verbatimModuleSyntax` — use `import type { ... }` for type-only imports
- `allowImportingTsExtensions` — imports **must** include the `.ts` extension

## Immutability

```typescript
// WRONG: mutation
function update(entry: Entry, content: string): Entry {
  entry.content = content;
  return entry;
}

// CORRECT: spread copy
function update(entry: Readonly<Entry>, content: string): Entry {
  return { ...entry, content };
}
```

## Input Validation (Zod)

Use Zod schemas at boundaries and infer types from the schema:

```typescript
const createEntryBodySchema = z
  .object({
    content: z.string().min(1).max(10_000),
  })
  .meta({ id: "CreateEntryBody" });

type CreateEntryBody = z.infer<typeof createEntryBodySchema>;
```

## Node Builtins

Use the `node:` protocol (`unicorn/prefer-node-protocol` is an error):

```typescript
import { randomUUID } from "node:crypto";
```

## Service Object Pattern

Services and repositories are plain objects with async methods — no classes, no DI container. Keep them stateless.

```typescript
export const entriesService = {
  async create(
    body: CreateEntryBody,
  ): Promise<{ entry: Entry; safety: ScanResult }> {
    const safety = runScan(body.content);
    const entry = await entriesRepository.insert({
      /* ... */
    });
    return { entry, safety };
  },

  async getById(id: string): Promise<Entry> {
    const entry = await entriesRepository.findById(id);
    if (!entry) throw new EntryNotFoundError(id);
    return entry;
  },
};
```

## Schema-Derived Types

Derive types from the source of truth — don't restate them:

- DB types from Drizzle: `type Entry = typeof entries.$inferSelect`
- Request/response types from Zod: `type CreateEntryBody = z.infer<typeof createEntryBodySchema>`

## Discriminated Domain Errors

Model domain failures as typed errors extending `DomainError`, each with a `status` and `code`.
The global handler maps them — services never build HTTP responses.

## Console

`no-console` is off in this project (server logging is acceptable). Prefer intentional,
structured logging over stray `console.log` debugging left behind.
