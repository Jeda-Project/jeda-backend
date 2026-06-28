# Commands Index

> Invoke with `/command-name` in the Claude Code CLI.

---

## Planning

| Command     | When to Use                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| `/plan`     | Before any new feature — vertical slice breakdown, DB/risk/phase list           |
| `/plan-api` | New endpoint scaffold — HTTP contract → schema → route → service → repo → tests |

---

## Code Review

| Command          | When to Use                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `/review`        | Full review of staged or recent changes (dispatches the right specialist agents) |
| `/review-layers` | Audit layer-boundary violations (DB in routes, HTTP in services, etc.)           |

---

## Quality Gates

| Command      | When to Use                                                  |
| ------------ | ------------------------------------------------------------ |
| `/check-fix` | Run `check + lint + format + test`; fix failures iteratively |

---

## Git & Release

| Command              | When to Use                                               |
| -------------------- | --------------------------------------------------------- |
| `/commit`            | Gate → inspect diff → draft conventional commit message   |
| `/create-pr`         | Open a PR for the current branch with a standardized body |
| `/merge-pr`          | Merge an approved PR via GitHub MCP                       |
| `/resolve-pr-review` | Address and respond to review comments                    |

---

## DB & API Contract

| Command         | When to Use                                                               |
| --------------- | ------------------------------------------------------------------------- |
| `/db-migrate`   | Full Drizzle migration flow: edit schema → generate → inspect SQL → apply |
| `/openapi-sync` | Regenerate `openapi.json` after route/schema changes and verify the diff  |

---

## Session Management

| Command               | When to Use                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `/checkpoint`         | Save mid-session state: completed, in-progress, next steps, blockers |
| `/checkpoint-summary` | One-line WIP summary for a save-state commit                         |
| `/aside`              | Pause the current task, handle a quick side fix, then return         |
