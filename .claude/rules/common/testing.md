# Testing Requirements

## Minimum Test Coverage: 80% (unit-testable logic)

Test scope for this project:

1. **Unit Tests** — pure functions, services, the safety module. Always run, no external deps.
2. **Integration Tests** — route-level tests that hit a real Neon DB. Gated by `RUN_INTEGRATION_TESTS=1`.

Runner: **`bun:test`** (`import { describe, expect, test } from "bun:test"`). Not vitest, not jest.

## Test-Driven Development

MANDATORY workflow:

1. Write test first (RED)
2. Run test — it should FAIL
3. Write minimal implementation (GREEN)
4. Run test — it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Integration Gating

Database-dependent tests must be skipped by default so `rtk bun test` stays green
without a DB:

```typescript
import { shouldRunIntegrationTests } from "../../../test/config.ts";

const describeIntegration = shouldRunIntegrationTests()
  ? describe
  : describe.skip;
```

Run integration tests explicitly: `RUN_INTEGRATION_TESTS=1 rtk bun test`.

## Test Structure (AAA Pattern)

```typescript
test("flags suicidal ideation as critical", () => {
  // Arrange
  const text = "aku ingin mengakhiri hidup ini";

  // Act
  const result = runScan(text);

  // Assert
  expect(result.severity).toBe("critical");
});
```

### Test Naming

Describe the behavior under test:

```typescript
test("returns 404 when entry id is unknown", () => {});
test("throws when API_BEARER_TOKEN is missing", () => {});
test("is deterministic and includes the rules version", () => {});
```

## Troubleshooting

1. Check test isolation (no shared mutable state)
2. Verify integration gating, not a missing DB
3. Fix implementation, not tests (unless the test is wrong)
