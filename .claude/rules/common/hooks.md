# Hooks System

> This file documents the **Claude Code hooks runtime** (shell hooks in `.claude/hooks/`),
> not application code. For project-specific wiring see `.claude/settings.json`.

## Hook Types

- **PreToolUse**: before tool execution (validation, blocking)
- **PostToolUse**: after tool execution (auto-format, lint, governance checks)
- **Notification**: desktop notifications
- **Stop**: when the session ends (final verification / summary)

## Configured Hooks (this project)

| Event                     | Hook                       | Purpose                                                                         |
| ------------------------- | -------------------------- | ------------------------------------------------------------------------------- |
| PreToolUse `Bash`         | `safety-check.sh`          | block `rm -rf` on protected paths, push to main, `.env` redirects; RTK reminder |
| PreToolUse `Write\|Edit`  | `generated-guard.sh`       | block writes to `openapi.json` and `drizzle/**`                                 |
| PreToolUse `Write\|Edit`  | `env-guard.sh`             | block `.env*` writes; warn on hardcoded secrets                                 |
| PostToolUse `Write\|Edit` | `auto-format.sh`           | `oxfmt --write` on edited files                                                 |
| PostToolUse `Write\|Edit` | `auto-lint.sh`             | `oxlint` on edited `.ts`                                                        |
| PostToolUse `Write\|Edit` | `safety-keywords-guard.sh` | warn if crisis rules change without a `KEYWORDS_VERSION` bump                   |
| Notification              | `notify.sh`                | macOS desktop notification                                                      |
| Stop                      | `stop-check.sh`            | session summary + pre-push checklist                                            |

`type-check.sh` exists but is **not** wired by default (avoids churn on rapid edits); enable it in `settings.json` if desired.

## Auto-Accept Permissions

- Enable for trusted, well-defined plans
- Disable for exploratory work
- Never use a skip-permissions flag — configure `permissions.allow` in `.claude/settings.json`

## TodoWrite Best Practices

Use the TodoWrite tool to track progress on multi-step tasks, verify understanding, and enable real-time steering. A good todo list reveals out-of-order steps, missing items, and wrong granularity.
