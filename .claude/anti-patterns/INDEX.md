# Anti-Patterns Index

> These are jeda-backend-specific gotchas that are not obvious from reading the code.
> Each file explains the trap, why it happens, the wrong pattern, and the right fix.

---

| File                           | Trap                                                                                                    | Impact                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `neon-http-no-transactions.md` | `db.transaction()` throws at runtime with `neon-http`                                                   | Runtime crash on any transactional operation  |
| `bun-test-vs-vitest.md`        | vitest/jest imports fail — this project uses `bun:test`                                                 | Test file crashes immediately                 |
| `ts-extension-imports.md`      | Missing `.ts` extension on imports breaks module resolution                                             | Build failure (`tsc`) and runtime error       |
| `drizzle-zod-meta-openapi.md`  | Missing `.meta({ id })` on Zod schemas → anonymous OpenAPI components                                   | Broken Scalar UI, broken Swift client codegen |
| `neon-snake-case-casing.md`    | Missing `casing: "snake_case"` in Drizzle client or Kit config → silent `undefined` on camelCase fields | Data silently missing from responses          |

---

## Quick Reference

**When adding a new endpoint:** see `drizzle-zod-meta-openapi.md` (schema ids) + `ts-extension-imports.md` (import paths)

**When adding a new DB table:** see `neon-snake-case-casing.md` (casing) + `neon-http-no-transactions.md` (atomic ops design)

**When writing tests:** see `bun-test-vs-vitest.md` (runner + integration gating)
