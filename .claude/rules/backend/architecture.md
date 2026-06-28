---
paths:
  - "src/**/*.ts"
---

# Backend Architecture

> The authoritative layer responsibilities live in AGENTS.md §B. This file is the
> detailed working guide. Replaces the frontend's `react/` + `web/` rule tracks.

## Layered Modular Monolith

```
HTTP request
   │
   ▼
routes      src/modules/<m>/<m>.routes.ts   validate + describeRoute + call service
   │
   ▼
service     src/modules/<m>/<m>.service.ts  business logic, orchestration, throw domain errors
   │
   ▼
repository  src/modules/<m>/<m>.repository.ts  Drizzle queries only
   │
   ▼
db          src/db/                          neon-http client + schema
```

**One-directional flow. Never skip a layer.** No DB calls in a route; no `Context`/HTTP
in a service; no business rules in a repository.

## What each layer may and may NOT do

| Layer      | MAY                                                                                           | MUST NOT                                                           |
| ---------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Routes     | read `c.req.valid()`, call one service method, set status + body, declare OpenAPI             | contain business logic, query the DB, build error objects manually |
| Service    | orchestrate, apply rules, call repositories + pure libs (e.g. `runScan`), throw `DomainError` | touch `Context`/HTTP, write raw SQL, format responses              |
| Repository | build Drizzle queries, return typed rows                                                      | apply business rules, throw HTTP-shaped errors                     |
| Schema     | define Zod request/response shapes with `.meta({ id })`                                       | contain logic                                                      |

## Module Anatomy (vertical slice)

```
src/modules/entries/
├── entries.routes.ts       # POST/GET/DELETE wiring + OpenAPI + validator()
├── entries.service.ts      # entriesService: create/list/getById/remove
├── entries.repository.ts   # entriesRepository: insert/list/findById/delete
├── entries.schema.ts       # Zod: body/query/param/response + inferred types
├── entries.errors.ts       # EntryNotFoundError extends DomainError
└── entries.index.ts        # export entriesRouter (wired in app.ts)
```

## Wiring

`src/app.ts` is the composition root: CORS → health route → `requireToken` on `/api/*`
→ `app.route("/api/<m>", <m>Router)` → `registerOpenApi(app)`. The global error handler
is attached with `app.onError(handleAppError)`.

## Shared Lib

`src/lib/` holds cross-module building blocks: `factory` (typed `createApp`), `errors`
(`DomainError` hierarchy), `error-handler` (`handleAppError`), `schemas` (`jsonContent`,
`errorResponse`, `errorSchema`), `openapi` (`registerOpenApi`). Reuse these — don't
re-implement per module.

## Adding a New Module — checklist

```
[ ] Create the 6-file slice under src/modules/<m>/ (copy the closest existing module)
[ ] Define Zod schemas with .meta({ id }) in <m>.schema.ts
[ ] Repository: Drizzle queries only, typed returns
[ ] Service: rules + domain errors, no HTTP
[ ] Routes: validator() on every input, describeRoute for every response/status
[ ] Export <m>Router from <m>.index.ts and app.route() it in app.ts
[ ] Add tests under __tests__/ (unit always; integration gated)
[ ] Regenerate OpenAPI if the public contract changed
```
