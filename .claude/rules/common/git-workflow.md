# Git Workflow

## Commit Message Format

```
<type>(<scope>): <subject>   # max 50 chars

<optional body explaining the why, wrapped at 72 chars>
```

Types: `feat` · `fix` · `refactor` · `chore` · `docs` · `style` · `perf` · `test`
Scopes: `entries` · `summaries` · `safety` · `db` · `lib` · `middleware` · `api` · `deploy`

## Branching

- Never commit directly to `main` for non-trivial work — use a feature branch.
- `git push origin main` is blocked by a safety hook. Push feature branches and open a PR.

## Staging

- Stage files explicitly by name — never `git add -A` or `git add .`.
- Never stage protected/generated files: `.env*`, `openapi.json`, `drizzle/**`.

## Pull Request Workflow

1. Analyze the full commit history (not just the latest commit)
2. Use `git diff main...HEAD` to see all changes
3. Draft a comprehensive PR summary
4. Include a test plan
5. Push with `-u` for a new branch

> GitHub operations use the `github` MCP (needs `GITHUB_PERSONAL_ACCESS_TOKEN`).
> For the full development process before git, see [development-workflow.md](./development-workflow.md).
