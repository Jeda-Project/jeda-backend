# Agents Index

> Invoke via the Agent tool or by referencing the agent name in a task.
> All agents share the Prompt Defense Baseline and `[SEVERITY] / File / Issue / Fix` output format.

---

## Backend-Specific (5)

| Agent                   | Model  | When to Use                                                                                                                                                 |
| ----------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jb-safety-guard`       | opus   | Any change to `src/modules/safety/**` — verifies determinism, `KEYWORDS_VERSION` bump, test coverage, resource attachment. **Block if version not bumped.** |
| `jb-api-reviewer`       | sonnet | Reviewing Hono route files — `validator()` presence, `describeRoute` completeness, status codes, layer purity (no logic/DB in routes).                      |
| `jb-db-guard`           | sonnet | Reviewing Drizzle schema, repositories, or migrations — no raw SQL, neon-http transaction constraint, casing, generated-migration hygiene.                  |
| `jb-security-guard`     | sonnet | Auth, secrets, CORS, timing-safe comparison, prod error masking, secret-in-log detection. Run on any auth/env/middleware change.                            |
| `performance-optimizer` | sonnet | N+1 queries, missing `limit`, Neon round-trip count, payload size. Run before marking an endpoint done.                                                     |

---

## Generic (8)

| Agent                   | Model  | When to Use                                                                                                                                      |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `planner`               | opus   | Before implementing a new feature — breaks work into a vertical slice (routes→service→repository→schema→tests) with DB/migration and risk notes. |
| `architect`             | opus   | Architectural decisions — layer shape, data modeling, coupling trade-offs. Produces a 2–3 option analysis with recommendation.                   |
| `code-reviewer`         | sonnet | General quality/security/layer/TypeScript review. Run after writing or before committing.                                                        |
| `code-simplifier`       | sonnet | Identifies overly complex code — functions >50 lines, deep nesting, dead code, unnecessary abstractions.                                         |
| `refactor-cleaner`      | sonnet | Safe, incremental refactoring — extract → move → rename, one step at a time, tests green throughout.                                             |
| `build-error-resolver`  | sonnet | Resolves `tsc --noEmit` and Bun build errors. Reads the error precisely; applies the minimal fix.                                                |
| `silent-failure-hunter` | sonnet | Hunts empty `catch` blocks, swallowed promises, unhandled rejections, `async` in `forEach`. High value in services.                              |
| `tdd-guide`             | sonnet | Enforces RED→GREEN→REFACTOR with `bun:test`. Integration gating, AAA structure, coverage targets.                                                |

---

## Usage Notes

- **Safety changes:** always run `jb-safety-guard` first — it may **block** the work.
- **New endpoint:** run `planner` → implement → `jb-api-reviewer` → `jb-security-guard` → `code-reviewer`.
- **DB schema change:** run `jb-db-guard` after `rtk bun run db:generate`.
- **Build failure:** run `build-error-resolver` with the exact `tsc` output.
- **Suspicious service code:** run `silent-failure-hunter` — it catches bugs that tests miss.
