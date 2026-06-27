# Session Log — 2026-06-27 — claude-config-review

## Branch

`main` (all files staged, pre-first-commit)

## Tasks Completed

1. **Reviewed `.claude/` folder** — full audit of agents, commands, hooks, rules, anti-patterns, settings
2. **Fixed path injection in `auto-lint.sh`** — replaced `python3 -c "...open('$FILE')"` with `python3 -m json.tool "$FILE"` to prevent shell injection via filenames with special characters
3. **Narrowed `Write` permissions in `settings.json`** — added deny rules for `src/app.ts`, `src/env.ts`, `src/db/index.ts` (composition root files that warrant a confirm prompt)
4. **Added `.claude/session-logs/` to `.gitignore`** — session logs are ephemeral and should not accumulate in source control
5. **Consolidated `rules/typescript/` into `rules/backend/`** — merged TS-specific content into `backend/security.md`, `backend/testing.md`; created new `backend/coding-style.md` absorbing `typescript/coding-style.md` + `typescript/patterns.md`; deleted the now-redundant `rules/typescript/` folder (5 files)
6. **Removed emoji from `stop-check.sh`** — `📝`, `🔍`, `✅` removed for consistency with "no emoji" coding style rule
7. **Fixed agent count in `agents/INDEX.md`** — corrected "Generic (9)" → "Generic (8)"
8. **Strengthened `/aside` command** — Step 1 now explicitly instructs running `/checkpoint` before handling an aside, protecting against context compression during the detour
9. **Updated `CLAUDE.md` context loading table** — added rows for TypeScript style/patterns, and explicit anti-pattern triggers per task type (new DB table, new endpoint, writing tests)
10. **Q&A: CORS_ORIGINS for iOS native app** — confirmed safe to leave empty; CORS is browser-only, Bearer token is the real gatekeeper

## Key Decisions

| Decision                                                         | Rationale                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Merge `typescript/` into `backend/` rather than `common/`        | This is a backend-only project; no frontend layer exists                   |
| Deny `src/app.ts` + `src/env.ts` + `src/db/index.ts` in settings | These are composition roots — unintended edits have wide blast radius      |
| Add anti-pattern triggers to CLAUDE.md table (not just INDEX.md) | CLAUDE.md is loaded every session; INDEX.md requires a deliberate read     |
| `CORS_ORIGINS` empty is safe                                     | iOS native apps don't enforce CORS; Bearer token is the real auth boundary |

## Files Changed

- `.claude/hooks/auto-lint.sh` — security fix (path injection)
- `.claude/hooks/stop-check.sh` — remove emoji
- `.claude/settings.json` — narrow deny rules
- `.claude/agents/INDEX.md` — fix count
- `.claude/commands/aside.md` — explicit /checkpoint instruction
- `.claude/rules/backend/security.md` — absorb typescript/security.md content
- `.claude/rules/backend/testing.md` — remove typescript/ extend reference
- `.claude/rules/backend/coding-style.md` — NEW: merged from typescript/ layer
- `.claude/rules/typescript/` — DELETED (5 files)
- `CLAUDE.md` — expanded context loading table
- `.gitignore` — add .claude/session-logs/

## What's Next

1. First commit — stage explicit files, conventional commit message
2. Push to GitHub remote + set secrets (`GHCR_TOKEN`, `DEPLOY_WEBHOOK_URL`)
3. Verify CI pipeline green on first push
