# Security Guidelines

## Mandatory Security Checks

Before ANY commit:

- [ ] No hardcoded secrets (DB URL, Bearer token, API keys)
- [ ] All user inputs validated with Zod at the boundary
- [ ] DB access via Drizzle query builder (no raw string SQL)
- [ ] Auth enforced on every `/api/*` route
- [ ] Token comparison is constant-time (`timingSafeEqual`)
- [ ] Error messages don't leak sensitive data in production
- [ ] CORS locked down for production (`CORS_ORIGINS` set)

## Secret Management

- NEVER hardcode secrets in source code
- ALWAYS load via `src/env.ts` (`@t3-oss/env-core`), which validates at startup
- `.env*` files are protected — never write them via tools
- Rotate any secret that may have been exposed

## Security Response Protocol

If a security issue is found:

1. STOP immediately
2. Fix CRITICAL issues before continuing
3. Rotate any exposed secrets (regenerate `API_BEARER_TOKEN`, Neon credentials)
4. Review the codebase for similar issues

See [backend/security.md](../backend/security.md) for backend-specific detail (auth, CORS, Neon TLS, prod error masking).
