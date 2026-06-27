# Anti-Pattern: neon-http Rejects Multi-Statement Transactions

## Trap

The `neon-http` driver (used by this project) does **not** support multi-statement
transactions. Calling `db.transaction(async (tx) => { … })` or wrapping multiple
statements in a transaction will throw a runtime error.

## Why It Happens

Drizzle ORM's transaction API is designed for standard Postgres drivers (TCP-based).
`neon-http` uses HTTP requests — each query is an independent round-trip. There is
no persistent connection to hold open a transaction.

## Wrong

```typescript
// Throws at runtime with neon-http
await db.transaction(async (tx) => {
  await tx.update(entries).set({ … }).where(eq(entries.id, id));
  await tx.insert(auditLog).values({ … });
});
```

## Right

Design for atomic, single-statement operations. If you need "do A then B", accept
that they are two independent operations — and design for idempotency so retries
are safe:

```typescript
// Two independent statements — each is a single HTTP call
await db.update(entries).set({ … }).where(eq(entries.id, id));
await db.insert(auditLog).values({ … });
```

For operations that must be atomic, consider:

1. Postgres `returning()` to combine write + read in one statement
2. A single `INSERT … ON CONFLICT DO UPDATE` (upsert) instead of check-then-insert
3. Application-level idempotency (client-supplied `id` + unique constraint)

## References

- `src/db/index.ts` — project's neon-http client setup
- SSOT.md §3 — tech stack decisions (neon-http noted)
- AGENTS.md §D Rule 13 — "neon-http = no multi-statement transactions"
