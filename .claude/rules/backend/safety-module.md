---
paths:
  - "src/modules/safety/**/*.ts"
---

# Safety Module Governance (CRITICAL)

> The crisis-detection module is a safety-critical, auditable component (PRD 5.4).
> Read this before touching anything under `src/modules/safety/**`.
> Mirrors AGENTS.md §F.

## Why This Is Special

Jeda's generative AI runs on-device and may be unavailable or wrong. This server-side
guardrail is the **deterministic, always-on safety net** that surfaces professional
help resources when an entry shows crisis signals. Correctness here is non-negotiable.

## Hard Rules

1. **Deterministic & pure.** Same input ⇒ same output, always.
   - No generative AI / LLM calls
   - No network calls
   - No randomness (`Math.random`, UUIDs in matching)
   - No time-dependent behavior (`Date.now()`, locale-dependent casing surprises)

2. **Version every change.** Any edit to `safety.keywords.ts` (rules, patterns,
   categories, severities) **must bump `KEYWORDS_VERSION`** (format `YYYY-MM-DD.N`).
   The `safety-keywords-guard.sh` hook warns if you forget.

3. **Resources always attach on flag.** A flagged scan must include `CRISIS_RESOURCES`.
   Never return `flagged: true` with empty `resources`.

4. **Patterns stay auditable.** Regex must be human-readable and anchored
   (`\b...\b`). No clever, opaque catch-alls. Matching runs on normalized
   (lowercased, whitespace-collapsed) text.

5. **Never weaken silently.** Removing or loosening a pattern is a reviewable event —
   explain the rationale in the commit/PR. Detection should err toward catching.

6. **Update tests in the same change.** Add/adjust cases in
   `__tests__/safety.service.test.ts` for every rule change; keep determinism +
   `rulesVersion` assertions green.

## Severity Model

`critical` > `high` > `medium` > `none`. On multiple matches, the **highest** severity
wins (see `SEVERITY_RANK` reduction in `safety.service.ts`). Keep this ordering intact.

## File Map

| File                  | Role                                                                         |
| --------------------- | ---------------------------------------------------------------------------- |
| `safety.keywords.ts`  | `CRISIS_RULES`, `KEYWORDS_VERSION`, `Severity` — the audited source of truth |
| `safety.resources.ts` | `CRISIS_RESOURCES` returned on flag                                          |
| `safety.service.ts`   | `runScan` — pure matching + severity reduction                               |
| `safety.schema.ts`    | Zod `scanResultSchema` / `ScanResult` / `ScanMatch`                          |
| `safety.index.ts`     | router (`/scan`, `/resources`)                                               |

## Pre-Merge Checklist (safety changes)

```
[ ] KEYWORDS_VERSION bumped
[ ] No generative/network/random/time dependency introduced
[ ] Flagged path still attaches CRISIS_RESOURCES
[ ] Patterns anchored + readable
[ ] Tests added/updated; rtk bun test src/modules/safety green
[ ] Rationale documented in commit/PR
```
