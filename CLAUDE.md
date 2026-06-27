# Jeda Backend — Claude Code Config

> Load the relevant SSOT.md sections for your task. Then execute.
> Behavioral protocol → AGENTS.md §A. Self-review gate → AGENTS.md §H.

---

## Project Snapshot

Bun + Hono + Drizzle ORM (Neon Postgres, `neon-http`) + Zod. API docs via
hono-openapi + Scalar (`/docs`). Auth: static Bearer token (single-user
gatekeeper). All generative AI runs **on-device in native iOS** — the backend is
storage + a **deterministic safety guardrail** only.

Dev: `rtk bun run dev` · Default port: 4060

---

## RTK Enforcement — STRICT

**ALL terminal commands MUST use the `rtk` prefix.**

```
rtk bun run dev
rtk bun run fl          # oxfmt --write && oxlint (format + lint in one shot)
rtk bun run check       # tsc --noEmit
rtk bun run lint        # oxlint
rtk bun run format      # oxfmt --write
rtk bun test
rtk bun run db:push
rtk bun run db:generate
rtk bun run db:migrate
rtk bun run db:studio
rtk bun run openapi:generate
```

---

## Context Loading Strategy

Read the relevant SSOT.md section before starting a task:

| Task                          | Read                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| New endpoint / route change   | SSOT.md §4–5 + rules/backend/api-design.md                                  |
| Service / business logic      | SSOT.md §4 + rules/backend/architecture.md                                  |
| DB schema / query / migration | SSOT.md §4 + rules/backend/database.md                                      |
| Safety / crisis detection     | SSOT.md §8 + rules/backend/safety-module.md                                 |
| OpenAPI / Swift client        | rules/backend/openapi.md                                                    |
| Auth / secrets / CORS         | SSOT.md §6 + rules/backend/security.md                                      |
| TypeScript style / patterns   | rules/backend/coding-style.md                                               |
| New DB table                  | anti-patterns: `neon-snake-case-casing.md` + `neon-http-no-transactions.md` |
| New endpoint (imports/schema) | anti-patterns: `ts-extension-imports.md` + `drizzle-zod-meta-openapi.md`    |
| Writing tests                 | anti-patterns: `bun-test-vs-vitest.md`                                      |
| Writing / editing comments    | rules/common/comments.md                                                    |

---

## Tool Priority — Serena MCP (STRICT ENFORCEMENT)

Serena MCP is active in this project for all TypeScript.

| Instance | Tool Prefix      | Project Root    | Use For         |
| -------- | ---------------- | --------------- | --------------- |
| `serena` | `mcp__serena__*` | `jeda-backend/` | All `.ts` files |

### Session Start — REQUIRED

Before any task involving `.ts`:

1. Call `mcp__serena__initial_instructions` — read the Serena Instructions Manual
2. Verify tools are available before proceeding

### MANDATORY Rules

1. **ALWAYS** use Serena for `.ts` file operations in this project.
2. **NEVER** use built-in `Read`, `Grep`, or `Glob` for `.ts` files.
3. **EXCEPTION:** Non-code files (`.json`, `.md`, `.env`) may use `Read` / `Glob` / `Grep`.

### Tool Reference

| Task                         | Tool                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| Session Start (Required)     | `mcp__serena__initial_instructions`                                      |
| File Exploration             | `mcp__serena__get_symbols_overview`                                      |
| Locate Symbol/Logic          | `mcp__serena__find_symbol`                                               |
| Find Declaration             | `mcp__serena__find_declaration`                                          |
| Find Implementations         | `mcp__serena__find_implementations`                                      |
| Trace Usages/Dependencies    | `mcp__serena__find_referencing_symbols`                                  |
| File Diagnostics             | `mcp__serena__get_diagnostics_for_file`                                  |
| Replace Full Function/Body   | `mcp__serena__replace_symbol_body`                                       |
| Replace Content (partial)    | `mcp__serena__replace_content`                                           |
| Add code before/after symbol | `mcp__serena__insert_before_symbol` / `mcp__serena__insert_after_symbol` |
| Safe Delete Symbol           | `mcp__serena__safe_delete_symbol`                                        |
| Rename Symbol                | `mcp__serena__rename_symbol`                                             |

### Known Parameter Rules

- `find_symbol`: use `name_path_pattern` — NOT `name_path`
- `list_dir`: both `relative_path` and `recursive` are mandatory

---

## Context7 MCP — Documentation Lookup

Always use Context7 when you need current documentation for any library
(Hono, Drizzle, Zod, hono-openapi, drizzle-zod, @t3-oss/env-core).
Do not rely on training data alone for library-specific APIs.

---

## GitHub MCP — Repository Operations

Use the `github` MCP for PR/issue/branch operations. Requires
`GITHUB_PERSONAL_ACCESS_TOKEN` in the environment.

---

## Code Comments

See [rules/common/comments.md](.claude/rules/common/comments.md) for the full rules. Key points:

- Every `.ts` file must have a `/** Scope / Purpose */` docblock at the top
- No `//` inline comments — let names and types do the talking
- Route files (`*.routes.ts`, `*.index.ts`) must contain zero comments
- English only

---

## Quality Gates

Must pass before marking any task done:

```bash
rtk bun run fl      # oxfmt --write && oxlint (format + lint in one shot)
rtk bun run check   # TypeScript strict — tsc --noEmit
rtk bun test        # bun:test (safety unit tests always run)
```

---

## Naming Conventions

| Type           | Convention                                    | Example                                       |
| -------------- | --------------------------------------------- | --------------------------------------------- |
| Module file    | `<module>.<layer>.ts`                         | `entries.service.ts`, `entries.repository.ts` |
| DB schema      | `<entity>.schema.ts` (snake_case columns)     | `entries.schema.ts` → `export const entries`  |
| Service / Repo | camelCase object export                       | `entriesService`, `entriesRepository`         |
| Router         | `<module>Router`                              | `entriesRouter`                               |
| Domain error   | PascalCase extends `DomainError`              | `EntryNotFoundError`                          |
| TS imports     | **include `.ts` extension**; `node:` builtins | `import { db } from "../../db/index.ts"`      |
| Directories    | kebab-case                                    | `src/modules/`, `src/middleware/`             |

---

## Language Convention

All code artifacts must be written in **English**:

- Variable and function names
- Comments
- Commit messages and PR descriptions


---

## Commit Format

```
type(scope): subject — max 50 characters
```

Types: `feat` · `fix` · `refactor` · `chore` · `docs` · `style` · `perf` · `test`
Scopes: `entries` · `summaries` · `safety` · `db` · `lib` · `middleware` · `api` · `deploy`

---

## Protected Files

Never edit directly:

```
.env / .env.* (secrets)
openapi.json           (generated — run rtk bun run openapi:generate)
drizzle/**             (generated migrations — run rtk bun run db:generate)
.claude/settings.json
SSOT.md
AGENTS.md
```
