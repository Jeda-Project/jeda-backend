# /check-fix

Run all quality gates and fix any failures iteratively.

## Steps

```bash
# 1. Format + lint in one shot
rtk bun run fl

# 2. TypeScript strict check
rtk bun run check

# 3. Tests
rtk bun test
```

## On Failure

### `bun run fl` (oxfmt + oxlint) fails

- oxfmt is opinionated — if it reformats a file, that's the correct output; accept it
- oxlint failures name the rule and line; fix the root cause, never add `// oxlint-disable`
- If a file is excluded from formatting, check `.oxfmtrc.json`

### `bun run check` (tsc) fails

- Invoke `build-error-resolver` agent with the exact error output
- Fix one error at a time; re-run after each fix
- Never use `@ts-ignore`, `@ts-expect-error`, or `as any` to suppress errors

### `bun test` fails

- Read the failure message precisely — assertion failure vs runtime error vs missing module
- If integration test fails locally: check `RUN_INTEGRATION_TESTS=1` is set and DB is reachable
- Unit test failures are always regressions — fix the implementation, not the test

## Done

All three commands exit 0 → gates are green → safe to commit.
