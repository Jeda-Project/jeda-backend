# /commit

Create a conventional commit after quality gates pass.

## Pre-Commit Gate (REQUIRED)

```bash
rtk bun run fl       # format + lint — must exit 0
rtk bun run check    # tsc --noEmit — must exit 0
rtk bun test         # must exit 0
```

Do not commit if any gate fails. Run `/check-fix` first.

## Steps

1. `git status` — confirm intended files are modified
2. `git diff` — inspect the exact changes to draft an accurate message
3. `git log --oneline -5` — check recent message style for consistency
4. Stage files explicitly by name — **never `git add -A` or `git add .`**
5. Never stage protected/generated files: `.env*`, `openapi.json`, `drizzle/**`
6. Draft the commit message (see format below)
7. Commit

## Message Format

```
<type>(<scope>): <subject>   # max 50 chars total

<optional body — explain the WHY, wrapped at 72 chars>
```

**Types:** `feat` · `fix` · `refactor` · `chore` · `docs` · `style` · `perf` · `test`

**Scopes:** `entries` · `summaries` · `safety` · `db` · `lib` · `middleware` · `api` · `deploy`

## Examples

```
feat(entries): add mood score to entry creation

fix(safety): bump KEYWORDS_VERSION after adding self-harm synonyms

refactor(summaries): extract date-range validation to lib

chore(db): generate migration for mood_score column

docs(api): add missing 422 responses to OpenAPI spec
```

## Notes

- Subject is imperative present tense ("add", not "added" or "adds")
- No period at the end of the subject line
- Body explains _why_, not _what_ — the diff already shows what changed
- Safety changes: body must note the KEYWORDS_VERSION bump and what changed
