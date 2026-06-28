# /resolve-pr-review

Address and respond to pull request review comments.

## Steps

1. Use GitHub MCP `get_pull_request_comments` to fetch all review comments
2. Group comments by severity (CRITICAL → HIGH → MEDIUM → LOW)
3. Address CRITICAL and HIGH first — these block merge
4. For each comment:
   a. Understand the root cause (not just the symptom)
   b. Apply the minimal fix
   c. Run the relevant gate (`rtk bun run check` for TS, `rtk bun test` for logic)
   d. Stage and commit the fix with a descriptive message
5. After all fixes: run full gates (`check + lint + format + test`)
6. Push the updated branch
7. Use GitHub MCP `add_issue_comment` or resolve the comment thread to signal addressed

## Response Convention

When commenting back on a review thread:

- Acknowledge the finding briefly
- State what you changed and why
- If you disagree: explain the rationale, don't just skip it

## Notes

- Fix the root cause — don't patch over it to silence the reviewer
- One commit per logical fix; don't squash everything into one "address review comments" commit
- If a MEDIUM/LOW comment requires significant refactoring: create a follow-up issue
  rather than scope-creeping the PR
