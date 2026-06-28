# Performance Optimization

## Model Selection Strategy

**Haiku 4.5** (fast, cost-efficient):

- Lightweight agents with frequent invocation
- Mechanical code generation
- Worker agents in multi-agent systems

**Sonnet 4.6** (best coding model):

- Main development work
- Orchestrating multi-agent workflows
- Complex coding tasks

**Opus 4.8** (deepest reasoning):

- Complex architectural decisions
- Maximum reasoning requirements
- Research and analysis tasks

## Context Window Management

Avoid the last 20% of the context window for:

- Large-scale refactoring
- Feature work spanning multiple modules
- Debugging complex interactions

Lower-sensitivity tasks: single-file edits, utility creation, docs, simple fixes.

## Runtime Performance (backend)

See [backend/database.md](../backend/database.md) for query-level guidance. Key points:

- Avoid N+1 queries; batch where possible
- Always cap list queries with a `limit`
- Minimize Neon HTTP round-trips (each query is a network call)
- Keep response payloads lean; paginate large lists

## Build / Run Troubleshooting

If `rtk bun run check` (tsc) fails:

1. Use the **build-error-resolver** agent
2. Read the error precisely (strict mode, `noUncheckedIndexedAccess`)
3. Fix incrementally and re-run
