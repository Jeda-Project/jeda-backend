# /create-pr

Create a pull request for the current feature branch.

## Pre-PR Checklist

- [ ] All quality gates green: `check` + `lint` + `format` + `test`
- [ ] Branch is up to date with `main` (`git fetch origin && git rebase origin/main`)
- [ ] Merge conflicts resolved
- [ ] No protected/generated files staged

## Steps

1. `git log main..HEAD --oneline` — list all commits in the branch
2. `git diff main...HEAD` — full diff for the PR body
3. `git push -u origin <branch-name>`
4. Draft PR title (≤70 chars, conventional format: `feat(scope): subject`)
5. Draft PR body (see template below)
6. Use GitHub MCP `create_pull_request` to open the PR

## PR Body Template

```markdown
## Summary

- <bullet: what changed and why>
- <bullet>
- <bullet>

## Changes

- `src/modules/<m>/<m>.routes.ts` — <one line>
- `src/modules/<m>/<m>.service.ts` — <one line>
- ...

## Test Plan

- [ ] `rtk bun run check` passes
- [ ] `rtk bun run lint` passes
- [ ] `rtk bun run format` passes
- [ ] `rtk bun test` passes
- [ ] Integration tests: `RUN_INTEGRATION_TESTS=1 rtk bun test` (if DB-dependent)
- [ ] Manually verified: <what you tested>

## Notes

<any reviewer callouts, breaking changes, migration steps>
```

## Notes

- Always open PRs against `main` (never force-push to main directly)
- Safety changes: note the `KEYWORDS_VERSION` bump in the Summary
- DB schema changes: note the generated migration file in Changes
