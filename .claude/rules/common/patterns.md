# Common Patterns

## Repository Pattern (ACTIVE — the backbone of this project)

Unlike a static frontend, this backend uses a real layered pattern. Data access is
isolated in repositories; business logic in services; HTTP in routes.

```
routes  → validate + call service + shape response
service → business rules + orchestration + throw domain errors
repo    → Drizzle queries only
db      → neon-http client + schema
```

See [backend/architecture.md](../backend/architecture.md) for the full ruleset and
[backend/api-design.md](../backend/api-design.md) for the HTTP/response contract.

## Module Pattern (vertical slice)

A new feature is a folder under `src/modules/<module>/` with one file per layer:

```
<module>.routes.ts · <module>.service.ts · <module>.repository.ts
<module>.schema.ts · <module>.errors.ts (optional) · <module>.index.ts
```

Wire the exported router into `src/app.ts` via `app.route("/api/<module>", <module>Router)`.

## Factory Pattern

Routers and middleware share the `AppEnv`-typed factory in `src/lib/factory.ts`
(`factory.createApp()`), so context typing is consistent everywhere.

## Skeleton / Reuse

When implementing new functionality, copy the closest existing module as a skeleton
(`entries` for CRUD + side-effect, `summaries` for plain CRUD, `safety` for pure logic)
and adapt within the proven structure rather than inventing a new shape.
