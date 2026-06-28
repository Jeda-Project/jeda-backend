# /review

Run a full code review on staged or recent changes.

## Steps

1. `git diff --staged` — staged changes (pre-commit review)
   or `git diff HEAD~1` — last commit review
2. Invoke `code-reviewer` agent for general quality/security/layer review
3. If changes touch `src/modules/safety/**` → invoke `jb-safety-guard` (may block)
4. If changes touch routes → invoke `jb-api-reviewer`
5. If changes touch `src/db/schema/**` or repositories → invoke `jb-db-guard`
6. If changes touch auth, env, middleware → invoke `jb-security-guard`
7. Summarize: CRITICAL / HIGH / MEDIUM count and overall verdict

## Verdict

- **Approve** — no CRITICAL or HIGH findings
- **Warning** — HIGH findings only (should fix before merging)
- **Block** — any CRITICAL finding (must fix before merging)

## Notes

- A clean review with zero findings is valid — never manufacture findings
- CRITICAL security issues: stop immediately, fix before continuing
- If `KEYWORDS_VERSION` was not bumped on a safety change → BLOCK
