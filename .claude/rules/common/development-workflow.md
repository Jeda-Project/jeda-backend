# Development Workflow

> Extends [common/git-workflow.md](./git-workflow.md) with the full feature development process that happens before git operations.

## Feature Implementation Workflow

0. **Research & Reuse** _(mandatory before any new implementation)_
   - **Existing patterns first:** find the closest existing module (`entries`, `summaries`, `safety`) and follow its layer structure.
   - **Library docs second:** use Context7 to confirm API behavior for Hono, Drizzle, Zod, hono-openapi.
   - **GitHub search when useful:** `gh search code` for proven patterns.
   - Prefer adopting a proven approach over net-new code when it meets the requirement.

1. **Plan First**
   - Identify the vertical slice you will touch (routes → service → repository → schema → tests)
   - Identify dependencies, risks, and the DB/migration impact
   - Break work into phases

2. **TDD Approach**
   - Write tests first (RED) — `bun:test`
   - Implement to pass (GREEN)
   - Refactor (IMPROVE)
   - Verify 80%+ coverage on unit-testable logic

3. **Code Review**
   - Address CRITICAL and HIGH issues
   - Fix MEDIUM issues when possible

4. **Commit & Push**
   - Conventional commit messages
   - See [git-workflow.md](./git-workflow.md)

5. **Pre-Review Checks**
   - All quality gates green (`check` + `lint` + `format` + `test`)
   - Merge conflicts resolved, branch up to date
   - Only request review after these pass

## Database Change Sub-Workflow

When a change touches `src/db/schema/`:

1. Edit the schema file
2. `rtk bun run db:generate` (creates migration under `drizzle/`)
3. Inspect the generated SQL — never hand-edit it
4. `rtk bun run db:migrate` (apply) or `rtk bun run db:push` (dev only)
5. Regenerate OpenAPI if response shapes changed: `rtk bun run openapi:generate`
