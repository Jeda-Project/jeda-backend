# SSOT.md — Jeda Backend

> Single source of truth for architecture, stack, and conventions.
> Load the section relevant to your task (see CLAUDE.md §Context Loading Strategy).

---

## 1. Product Context

Jeda is an iOS app for journaling & mood check-in aimed at builders/developers.
**All generative AI runs on-device** (Apple Foundation Models + NLTagger):
sentiment, reflection, weekly recap, deep-chat. This backend is intentionally
narrow: **data storage + a deterministic safety guardrail**. See PRODUCT.md.

---

## 2. Scope

**In scope (MVP):**

- CRUD for journal entries and weekly summaries.
- Server-side deterministic crisis detection on entry create (PRD 5.4).
- Single-user gatekeeper auth (static Bearer token).
- OpenAPI spec generation to drive a Swift iOS client.

**Out of scope:**

- Any server-side generative AI / LLM calls.
- Multi-user accounts, roles, or sessions.
- Multi-statement DB transactions (`neon-http` limitation).
- E2E test suites (unit + opt-in integration only).

---

## 3. Tech Stack Decisions

| Layer       | Choice                                                   |
| ----------- | -------------------------------------------------------- |
| Runtime     | Bun                                                      |
| Framework   | Hono                                                     |
| Database    | Neon (Postgres serverless) via Drizzle ORM (`neon-http`) |
| Validation  | Zod (v4)                                                 |
| API Docs    | hono-openapi + Scalar (`/docs`)                          |
| Env         | `@t3-oss/env-core` (type-safe)                           |
| Auth        | Static Bearer token (timing-safe compare)                |
| Lint/Format | oxlint + oxfmt                                           |
| Test        | `bun:test`                                               |
| Deploy      | VPS Ubuntu — PM2 + Nginx + Let's Encrypt                 |

---

## 4. Architecture

Modular monolith, layered: `routes → service → repository → db`.

### 4.1 Layer Map

See AGENTS.md §B for the authoritative responsibility table.

### 4.2 Module File Naming

Each module is a vertical slice under `src/modules/<module>/`:

```
<module>.routes.ts       # HTTP + OpenAPI + validation
<module>.service.ts      # business logic
<module>.repository.ts   # Drizzle queries
<module>.schema.ts       # Zod request/response schemas
<module>.errors.ts       # domain errors (optional, when module-specific)
<module>.index.ts        # router export wired in app.ts
```

### 4.3 Directory Structure

```
src/
├── db/             # Drizzle schema, neon-http client, migrate
│   └── schema/     # <entity>.schema.ts + index.ts
├── lib/            # factory, errors, error-handler, schemas, openapi
├── middleware/     # auth (Bearer), types (AppEnv)
├── modules/
│   ├── entries/    # CRUD entry + safety scan trigger
│   ├── summaries/  # CRUD weekly recap
│   └── safety/     # deterministic crisis detection (keyword/regex)
├── scripts/        # generate-openapi.ts
├── test/           # test config (integration gating)
├── app.ts          # Hono wiring (CORS, auth, routes, error handler, openapi)
├── env.ts          # type-safe env (@t3-oss/env-core)
└── index.ts        # Bun.serve entry
```

---

## 5. API Surface

| Method   | Path                     | Auth            |
| -------- | ------------------------ | --------------- |
| `GET`    | `/`                      | public (health) |
| `POST`   | `/api/entries`           | Bearer          |
| `GET`    | `/api/entries`           | Bearer          |
| `GET`    | `/api/entries/:id`       | Bearer          |
| `DELETE` | `/api/entries/:id`       | Bearer          |
| `POST`   | `/api/summaries`         | Bearer          |
| `GET`    | `/api/summaries`         | Bearer          |
| `POST`   | `/api/safety/scan`       | Bearer          |
| `GET`    | `/api/safety/resources`  | Bearer          |
| `GET`    | `/openapi.json`, `/docs` | public          |

Send `Authorization: Bearer <API_BEARER_TOKEN>` for all `/api/*`.

---

## 6. Environment Variables

Defined and validated in `src/env.ts`:

| Var                | Type / Rule                             | Notes                           |
| ------------------ | --------------------------------------- | ------------------------------- |
| `NODE_ENV`         | `development` \| `production` \| `test` | default `development`           |
| `PORT`             | positive int                            | default `4060`                  |
| `DATABASE_URL`     | URL (`sslmode=require`)                 | Neon Postgres connection string |
| `API_BEARER_TOKEN` | string, min 24 chars                    | `openssl rand -hex 32`          |
| `CORS_ORIGINS`     | comma-separated, optional               | empty = allow all (dev only)    |

Never commit real values. `.env*` is protected (see CLAUDE.md §Protected Files).

---

## 7. Infrastructure

- **Host:** VPS Ubuntu.
- **Process manager:** PM2 via `ecosystem.config.cjs` (`pm2 start ecosystem.config.cjs && pm2 save && pm2 startup`).
- **Reverse proxy:** Nginx proxies `:443 → http://127.0.0.1:4060` with TLS (Let's Encrypt / `certbot --nginx`).
- **TLS everywhere:** client↔backend and backend↔Neon must use HTTPS/TLS.

---

## 8. Safety Guardrail Spec (PRD 5.4)

`src/modules/safety/` performs **deterministic** crisis detection (keyword +
regex, non-generative, auditable). See `safety.keywords.ts` — its version lives
in `KEYWORDS_VERSION`. Runs server-side when an entry is created; if flagged, the
response includes a `safety` block with professional help resources.

Governance rules (enforced): determinism & purity, `KEYWORDS_VERSION` bump on any
keyword change, resources always attached on flag, human-auditable patterns,
review on every change. See AGENTS.md §F and `rules/backend/safety-module.md`.
