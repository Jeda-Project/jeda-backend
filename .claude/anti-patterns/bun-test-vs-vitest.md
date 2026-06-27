# Anti-Pattern: Using vitest or jest Instead of bun:test

## Trap

Copy-pasting test boilerplate from external sources often brings vitest or jest
imports. These will fail at runtime — this project uses `bun:test`.

## Wrong

```typescript
// vitest — NOT installed in this project
import { describe, expect, test } from "vitest";

// jest — NOT installed in this project
import { describe, expect, test } from "@jest/globals";
```

## Right

```typescript
import { describe, expect, test, beforeEach, afterEach } from "bun:test";
```

`bun:test` is built into the Bun runtime — no package install needed.
The API is intentionally jest-compatible, so most patterns transfer directly.

## Integration Test Gating

DB-dependent tests must be skipped by default so `rtk bun test` stays green
without a database connection:

```typescript
import { shouldRunIntegrationTests } from "../../../test/config.ts";

const describeIntegration = shouldRunIntegrationTests() ? describe : describe.skip;

describeIntegration("entries routes (integration)", () => {
  test("returns 200 for authenticated list request", async () => { … });
});
```

Run integration tests explicitly:

```bash
RUN_INTEGRATION_TESTS=1 rtk bun test
```

## References

- `src/test/config.ts` — `shouldRunIntegrationTests()`
- `src/modules/safety/__tests__/safety.service.test.ts` — unit test example
- `src/modules/entries/__tests__/entries.routes.test.ts` — integration gating example
- rules/backend/testing.md — full testing guide
