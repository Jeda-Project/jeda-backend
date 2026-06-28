---
paths:
  - "src/middleware/**/*.ts"
  - "src/app.ts"
  - "src/env.ts"
  - "src/lib/error-handler.ts"
---

# Backend Security

> Extends [common/security.md](../common/security.md).

## Authentication (static Bearer gatekeeper)

- All `/api/*` routes are gated by `requireToken` middleware
- The token is compared with **constant-time** `timingSafeEqual` — never `===` (avoids timing attacks)
- Extract via `Authorization: Bearer <token>`; reject empty or malformed with `401`
- The token source is `env.API_BEARER_TOKEN` (min 24 chars, validated at startup)

```typescript
const header = c.req.header("Authorization") ?? "";
const token = header.startsWith("Bearer ") ? header.slice(7) : "";
if (!token || !timingSafeEqual(token, env.API_BEARER_TOKEN)) {
  return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
}
```

## Secrets

- Only via `env.ts` (`@t3-oss/env-core`) — fails fast at startup if missing/invalid
- Never hardcode; never log; never echo into responses
- `.env*` files are tool-protected (`env-guard.sh`)

## CORS

- Production: restrict to `CORS_ORIGINS` (comma-separated allow-list)
- Dev (empty): reflect any origin — never ship empty config to production
- Allow only the methods/headers actually used (`GET, POST, DELETE, OPTIONS`; `Content-Type, Authorization`)

## Error Masking

`handleAppError` returns generic `"Internal Server Error"` in production and the real
message only in dev. Do not bypass the global handler or leak stack traces / internals.

## Transport

- Neon connection string must use `sslmode=require`
- In production, Nginx terminates TLS (Let's Encrypt) and proxies to `127.0.0.1:4060`
- Client↔backend and backend↔Neon are HTTPS/TLS end to end

## Input Trust Boundary

- Validate every request payload with Zod before use
- Never spread untrusted objects into DB writes — pass explicit validated fields only
- Cap sizes (`content` max length, list `limit` max) to bound abuse

## Secret Management (TypeScript)

```typescript
// NEVER: hardcoded secret
const token = "9f8c2a...";

// ALWAYS: validated env access
import { env } from "../env.ts";
const token = env.API_BEARER_TOKEN; // validated at startup by @t3-oss/env-core
```

`env.ts` enforces presence and shape. Never read `process.env.*` directly in application
code — go through `env.ts`.

> Exception: `drizzle.config.ts` reads `process.env.DATABASE_URL` directly. This is the
> only sanctioned direct access.

## Untrusted Input (TypeScript)

- Narrow `unknown` from `JSON.parse`/external responses before accessing fields
- Never spread untrusted objects into DB writes — pass explicit, validated fields
