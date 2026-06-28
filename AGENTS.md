# AGENTS.md — Jeda Backend

> Enforced guardrails. Read Rule 0 and 0b before touching any code.

---

## ⚡ CRITICAL: Read Before Touching Any Code

### Rule 0 — Mandatory Reasoning Protocol

```
Phase 1 READ:    Identify all affected files. Use Serena MCP for .ts — never Read/Grep/Glob for TypeScript.
                 Use Context7 MCP for library documentation lookups (Hono, Drizzle, Zod).
Phase 2 PLAN:    State what will change and why. If uncertain, ask first.
Phase 3 EXECUTE: Surgical changes only. Run quality gates before marking done.
```

Skipping Phase 1 or 2 is a disqualifying failure. No exceptions.

For Serena MCP availability rules and session-start requirements → see CLAUDE.md §Tool Priority.

### Rule 0b — Pre-Task Checklist

```
[ ] Have I called mcp__serena__initial_instructions? (required before .ts work)
[ ] Have I read the relevant SSOT.md sections for this task?
[ ] Are Serena MCP tools available?
[ ] Have I found an existing module/layer pattern in the codebase to follow?
[ ] Do I know exactly which files I will touch?
[ ] Is every external input validated at the boundary with Zod?
[ ] If using a library API: have I checked Context7 for up-to-date docs?
```

---

## A. Behavioral Protocol

**Rule 1** — Think before coding. Read first, always. Do not write a single line before Phase 1 is complete.

**Rule 2** — Simplicity first. Minimal change that achieves the goal. Do not add abstractions that were not requested.

**Rule 3** — Surgical changes. Do not touch files or logic outside the scope of the task.

**Rule 4** — Goal-driven. If the approach is not working, stop and re-read. Do not push through with workarounds.

---

## B. Layer Ownership (Separation of Concerns)

The real SoC of this project is the vertical slice `routes → service → repository → db`.

| Layer      | Location                        | Responsibility                                                                                                     |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Routes     | `src/modules/*/*.routes.ts`     | HTTP wiring, `describeRoute` (OpenAPI), `validator()`, call service, shape response. **No business logic, no DB.** |
| Service    | `src/modules/*/*.service.ts`    | Business logic, orchestration, domain-error throwing. **No HTTP, no raw SQL.**                                     |
| Repository | `src/modules/*/*.repository.ts` | Drizzle queries only. **No HTTP, no business rules.**                                                              |
| Schema     | `src/modules/*/*.schema.ts`     | Zod request/response schemas (`.meta({ id })` for OpenAPI).                                                        |
| DB         | `src/db/`                       | Drizzle client (`neon-http`), table schemas, migrate.                                                              |
| Lib        | `src/lib/`                      | factory, errors, error-handler, shared schemas, OpenAPI registration.                                              |
| Middleware | `src/middleware/`               | auth (Bearer/timing-safe), `AppEnv` types.                                                                         |

**Rule 5 — Layer boundaries are one-directional.** Routes call services; services call repositories; repositories touch the DB. Never skip a layer (no DB calls from a route, no `Context`/HTTP in a service).

**Rule 6 — Routes are thin.** A route handler validates input, calls one service method, and returns. If a handler grows logic, move it to the service.

---

## C. API & Validation Rules

**Rule 7** — Every request body, query, and param is validated with Zod via Hono's `validator()` at the route. Read validated data with `c.req.valid(...)` — never read raw `c.req` for validated fields.

**Rule 8** — Throw domain errors (`DomainError` subclasses in `src/lib/errors.ts` or `*.errors.ts`) inside services. The global `handleAppError` maps them to HTTP. Do not build ad-hoc error responses in services.

**Rule 9** — Keep the response shape consistent: success payloads are explicit objects; errors are always `{ error, code }`.

**Rule 10** — Status codes: `201` create, `204` delete (empty body), `200` read/list, `401` auth, `404` not found, `422` validation. Declare every response in `describeRoute` so OpenAPI stays accurate.

---

## D. Database Rules

**Rule 11** — Drizzle only. No raw string-concatenated SQL. Use the query builder / relational queries.

**Rule 12** — `neon-http` does **not** support multi-statement transactions. Design operations to be single-statement and idempotent. See `.claude/anti-patterns/neon-http-no-transactions.md`.

**Rule 13** — Never hand-edit files under `drizzle/`. Change the schema, then run `rtk bun run db:generate` and `rtk bun run db:migrate`.

**Rule 14** — Derive types from the schema (`$inferSelect` / `$inferInsert`). Keep `casing: "snake_case"` consistent across the Drizzle client and drizzle-kit.

---

## E. Security Rules

**Rule 15** — Bearer auth uses constant-time comparison (`timingSafeEqual`), never `===`.

**Rule 16** — Secrets only via `env.ts` (`@t3-oss/env-core`). Never hardcode secrets, never log them, never echo them into responses.

**Rule 17** — CORS is locked in production via `CORS_ORIGINS`. An empty value (dev) reflects any origin; never ship empty to prod.

**Rule 18** — In production, mask internal error details (`handleAppError` already does this — do not bypass it).

---

## F. Safety-Module Governance (ELEVATED — read before touching `src/modules/safety/**`)

The crisis-detection module is a safety-critical, auditable component (PRD 5.4).

**Rule 19** — It must stay **deterministic and pure**: no generative AI, no network calls, no randomness, no time-dependent matching. The same input must always produce the same output.

**Rule 20** — Any change to `safety.keywords.ts` (rules or patterns) **must bump `KEYWORDS_VERSION`** and update the safety tests in the same change.

**Rule 21** — A flagged scan must always attach `CRISIS_RESOURCES`. Patterns must remain human-auditable (clear, anchored regex).

**Rule 22** — Treat every keyword/rule change as a reviewable event. Explain the why; never weaken detection silently.

---

## G. Code Quality Rules

**Rule 23 — Functions < 50 lines; files ≤ 150 lines.** Extract a helper or split a module when approaching the limit.

**Rule 24 — No `oxlint-disable` comments.** Fix the underlying issue.

**Rule 25 — RTK Enforcement — ALL terminal commands must use the `rtk` prefix. No exceptions.**

**Rule 26 — Imports include the `.ts` extension** and use the `node:` protocol for Node builtins.

---

## H. Self-Review Gate

Required checklist before marking any task done:

```
[ ] MCP: mcp__serena__initial_instructions called at session start
[ ] MCP: Serena used for .ts access (no built-in Read/Grep/Glob for TypeScript)
[ ] MCP: Context7 consulted for library API references
[ ] Layers: boundaries respected — no DB in routes, no HTTP in services
[ ] Validation: every external input validated with Zod at the boundary
[ ] Errors: domain errors thrown in services, mapped by handleAppError
[ ] DB: no raw SQL, no hand-edited migrations, neon-http tx constraint respected
[ ] Safety: if safety/** touched — determinism intact, KEYWORDS_VERSION bumped, tests updated
[ ] Quality gates passed: rtk bun run check && lint && format && test
[ ] Line count: no function > 50 lines, no file > 150 lines
[ ] Anti-patterns: checked .claude/anti-patterns/INDEX.md for relevant traps
```
