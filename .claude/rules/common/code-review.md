# Code Review Standards

## Purpose

Code review ensures quality, security, and maintainability before code is merged.

## When to Review

**MANDATORY review triggers:**

- After writing or modifying code
- Before any commit to shared branches
- When security-sensitive code is changed (auth, secrets, DB queries)
- When the safety module (`src/modules/safety/**`) is changed
- When architectural / layer-boundary changes are made
- Before merging pull requests

**Pre-Review Requirements:**

- All quality gates passing (`check` + `lint` + `format` + `test`)
- Merge conflicts resolved
- Branch up to date with target branch

## Review Checklist

- [ ] Code is readable and well-named
- [ ] Functions are focused (<50 lines)
- [ ] Files are cohesive (≤150 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Layer boundaries respected (no DB in routes, no HTTP in services)
- [ ] Every external input validated with Zod at the boundary
- [ ] Errors handled explicitly (no empty catch, no swallowed promise)
- [ ] No hardcoded secrets or credentials
- [ ] Tests exist for new functionality
- [ ] Test coverage meets 80% minimum (unit-testable logic)

## Security Review Triggers

**STOP and review carefully when:**

- Authentication / authorization code (Bearer middleware)
- User input handling
- Database queries (injection, missing `limit`)
- Secret management / env access
- Safety / crisis-detection logic

## Review Severity Levels

| Level    | Meaning                                  | Action                             |
| -------- | ---------------------------------------- | ---------------------------------- |
| CRITICAL | Security vulnerability or data loss risk | **BLOCK** — must fix before merge  |
| HIGH     | Bug or significant quality issue         | **WARN** — should fix before merge |
| MEDIUM   | Maintainability concern                  | **INFO** — consider fixing         |
| LOW      | Style or minor suggestion                | **NOTE** — optional                |

## Review Workflow

```
1. Run git diff to understand changes
2. Check security checklist first
3. Review layer boundaries + validation
4. Review code quality checklist
5. Run relevant tests
6. Use the appropriate agent for detailed review (see .claude/agents/INDEX.md)
```

## Common Issues to Catch

### Security

- Hardcoded credentials (DB URL, Bearer token)
- SQL injection via raw string concatenation (use Drizzle query builder)
- Auth bypasses on `/api/*`
- Secrets leaked in logs or error responses
- Timing-unsafe token comparison (`===` instead of `timingSafeEqual`)

### Code Quality

- Large functions (>50 lines) — split
- Large files (>150 lines) — extract
- Deep nesting (>4 levels) — early returns
- Missing error handling — throw domain errors
- Layer leaks — logic in routes, DB in services

### Performance

- N+1 queries; missing `limit` on list endpoints
- Unnecessary Neon round-trips
- Large response payloads without pagination

## Approval Criteria

- **Approve**: No CRITICAL or HIGH issues
- **Warning**: Only HIGH issues
- **Block**: CRITICAL issues found

## Integration with Other Rules

- [testing.md](testing.md) — coverage requirements
- [security.md](security.md) — security checklist
- [git-workflow.md](git-workflow.md) — commit standards
