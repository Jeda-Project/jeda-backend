---
paths:
  - "src/**/__tests__/**/*.ts"
  - "src/**/*.test.ts"
  - "src/test/**/*.ts"
---

# Backend Testing

> Extends [common/testing.md](../common/testing.md).

## Two Tiers

| Tier        | Needs DB   | Default                                  | Example                                   |
| ----------- | ---------- | ---------------------------------------- | ----------------------------------------- |
| Unit        | no         | always runs                              | `safety.service.test.ts` (pure `runScan`) |
| Integration | yes (Neon) | skipped unless `RUN_INTEGRATION_TESTS=1` | `entries.routes.test.ts` (real insert)    |

`rtk bun test` must stay green with no database. Gate DB tests:

```typescript
import { shouldRunIntegrationTests } from "../../../test/config.ts";
const describeIntegration = shouldRunIntegrationTests()
  ? describe
  : describe.skip;
```

## What to Test per Layer

| Layer              | Priority        | Approach                                                          |
| ------------------ | --------------- | ----------------------------------------------------------------- |
| Pure libs (safety) | ≥90%            | exhaustive cases + determinism assertions                         |
| Service            | ≥85%            | golden paths + domain-error paths (mock/seed repo or integration) |
| Routes             | golden + auth   | `app.request()` incl. `401` without token, `422` invalid body     |
| Repository         | via integration | covered by route/integration tests                                |

## Route Tests

Use `app.request()` against the wired app — no live server needed:

```typescript
const { app } = await import("../../../app.ts");
const res = await app.request("/api/entries", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ content: "..." }),
});
expect(res.status).toBe(201);
```

Always include an auth-negative case (`POST` without token ⇒ `401`).

## Safety Tests (mandatory on any keyword change)

- Assert severity per category (critical / high / medium / none)
- Assert highest-severity wins on multiple matches
- Assert determinism (`runScan(x)` equals `runScan(x)`) and `rulesVersion === KEYWORDS_VERSION`
- Cover both Indonesian and English patterns
