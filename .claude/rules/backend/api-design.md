---
paths:
  - "src/modules/**/*.routes.ts"
  - "src/app.ts"
  - "src/lib/**/*.ts"
---

# API Design (Hono)

## Route Definition Shape

Every route declares its OpenAPI contract, validates input, then delegates:

```typescript
entriesRouter.post(
  "/",
  describeRoute({
    operationId: "createEntry",
    tags: ["Entries"],
    summary: "Store entry & run safety scan",
    responses: {
      201: jsonContent(createEntryResponseSchema, "Entry created"),
      422: errorResponse("Invalid body"),
    },
  }),
  validator("json", createEntryBodySchema),
  async (c) => {
    const body = c.req.valid("json");
    const result = await entriesService.create(body);
    return c.json(result, 201);
  },
);
```

## Validation Rules

- Validate **every** input with `validator("json" | "query" | "param", schema)`
- Read validated data via `c.req.valid(...)` — never re-read raw `c.req` for validated fields
- Coerce query primitives in the schema (`z.coerce.number()`, `.default(...)`)
- Cap list sizes: `limit: z.coerce.number().int().min(1).max(200).default(50)`

## Status Codes

| Action               | Status                      |
| -------------------- | --------------------------- |
| Create               | `201`                       |
| Read / list          | `200`                       |
| Delete (no body)     | `204` (`c.body(null, 204)`) |
| Validation failure   | `422`                       |
| Missing/invalid auth | `401`                       |
| Resource not found   | `404`                       |

Declare **every** response status in `describeRoute` so the OpenAPI spec stays truthful.

## Error Contract

- Services throw `DomainError` subclasses; routes do not catch them
- `handleAppError` (via `app.onError`) maps them to `{ error, code }` + status
- Never construct ad-hoc error JSON in a route handler

## Response Shape

- Success: explicit object (`{ entry }`, `{ entries }`, `{ entry, safety }`)
- Error: always `{ error: string, code: string }` (`errorSchema`)
- Wrap response schemas with `jsonContent(schema, description)` and reuse `errorResponse(...)`

## Routing & Middleware

- Health (`GET /`) is public; everything under `/api/*` is gated by `requireToken`
- Mount modules with `app.route("/api/<module>", <module>Router)`
- CORS: locked to `CORS_ORIGINS` in production; reflect-any only in dev
