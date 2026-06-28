# /merge-pr

Merge an approved pull request.

## Pre-Merge Checklist

- [ ] PR has at least one approval (or self-review completed with no CRITICAL/HIGH)
- [ ] All quality gates green in CI (or locally verified)
- [ ] Branch is up to date with `main`
- [ ] No unresolved review comments

## Steps

1. Use GitHub MCP `get_pull_request` to confirm PR status and reviews
2. Use GitHub MCP `get_pull_request_status` to confirm checks are green
3. If branch is behind `main`: use GitHub MCP `update_pull_request_branch` to rebase
4. Use GitHub MCP `merge_pull_request` with `merge_method: "squash"` (preferred for
   feature branches) or `"merge"` for release branches
5. Confirm merge succeeded
6. Delete the feature branch locally: `git branch -d <branch>`

## After Merge

- If the change touched the DB schema: confirm migration ran in production (Neon dashboard)
- If the change added/removed API endpoints: ensure `openapi.json` was regenerated and
  committed before the merge
- If the change touched `src/modules/safety/**`: confirm `KEYWORDS_VERSION` was bumped
  in the merged commit

## Notes

- **Never force-push to `main`** — the safety hook blocks it
- Squash merge is preferred to keep `main` history linear and commit messages clean
- After merging, pull `main` locally: `git checkout main && git pull origin main`
