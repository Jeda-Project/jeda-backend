# Coding Style

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate existing ones:

```
WRONG:  modify(original, field, value) → changes original in-place
CORRECT: update(original, field, value) → returns new copy with change
```

Rationale: Immutable data prevents hidden side effects, makes debugging easier, and keeps request handling free of cross-request state leaks.

## Core Principles

### KISS (Keep It Simple)

- Prefer the simplest solution that actually works
- Avoid premature optimization
- Optimize for clarity over cleverness

### DRY (Don't Repeat Yourself)

- Extract repeated logic into shared functions or `src/lib/` utilities
- Avoid copy-paste implementation drift across modules
- Introduce abstractions when repetition is real, not speculative

### YAGNI (You Aren't Gonna Need It)

- Do not build features or abstractions before they are needed
- Avoid speculative generality
- Start simple, refactor when the pressure is real

## File Organization

MANY SMALL FILES > FEW LARGE FILES:

- High cohesion, low coupling
- ~100 lines typical, 150 max
- Organize by feature/module (vertical slice), not by type
- Keep each layer in its own file: `*.routes.ts`, `*.service.ts`, `*.repository.ts`, `*.schema.ts`

## Error Handling

ALWAYS handle errors comprehensively:

- Throw typed domain errors (`DomainError` subclasses) in services; let `handleAppError` map them
- Provide a stable `{ error, code }` response shape
- Log detailed error context server-side; mask internals in production responses
- Never silently swallow errors (no empty `catch`)

## Input Validation

ALWAYS validate at system boundaries:

- Validate every request body/query/param with Zod at the route
- Fail fast with a clear `422` and validation detail
- Never trust external data (client payloads, env at the edges, third-party responses)

## Code Smells to Avoid

### Deep Nesting

Prefer early returns over nested conditionals once the logic starts stacking.

### Magic Numbers

Use named constants for meaningful thresholds, limits, and defaults (e.g. list `limit` caps).

### Long Functions

Split large functions into focused pieces with clear responsibilities (services in particular).
