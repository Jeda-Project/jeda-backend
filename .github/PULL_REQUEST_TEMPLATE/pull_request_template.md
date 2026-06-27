## What

Short explanation of what changed.

## Why

Why this change is needed.

## Changes

- Itemized list of what was added, changed, or removed

## Testing

- [ ] Unit tests pass (`bun test src`)
- [ ] Lint & typecheck pass (`bun run fl && bun run check`)
- [ ] Manual tested against local dev server
- [ ] Integration tested (if applicable — `RUN_INTEGRATION_TESTS=1 bun test src`)

## Safety Module

<!-- Delete if safety/** was not touched -->

- [ ] `KEYWORDS_VERSION` bumped in `safety.keywords.ts`
- [ ] Safety unit tests updated and passing
- [ ] Crisis resources still attached to flagged results

## DB / Migrations

<!-- Delete if no schema changes -->

- [ ] Migration generated (`bun run db:generate`) and SQL inspected
- [ ] Migration applied (`bun run db:migrate`)
- [ ] OpenAPI regenerated if response shapes changed (`bun run openapi:generate`)

## Breaking Changes

Any migration, env vars, or config changes? Yes / No

## Related

Issue: #
