# Jeda Backend

Backend for the **Jeda** iOS app — a journaling and mood check-in tool built for developers and builders. The backend handles **data persistence and a deterministic safety guardrail**. All generative AI (sentiment analysis, reflections, weekly recaps, deep-chat) runs **on-device in native iOS** via Foundation Models and NLTagger.

---

## Tech Stack

| Layer         | Choice                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Runtime       | [Bun](https://bun.sh)                                                                                     |
| Framework     | [Hono](https://hono.dev)                                                                                  |
| Database      | [Neon](https://neon.tech) (serverless Postgres, `neon-http`) via [Drizzle ORM](https://orm.drizzle.team) |
| Validation    | [Zod v4](https://zod.dev)                                                                                 |
| API Docs      | [hono-openapi](https://github.com/rhinobase/hono-openapi) + [Scalar](https://scalar.com) (`/docs`)       |
| Auth          | Static Bearer token (single-user gatekeeper)                                                              |
| Lint / Format | [oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://github.com/nicolo-ribaudo/oxfmt)      |
| Deploy        | [Dokploy](https://dokploy.com) (self-hosted PaaS on VPS)                                                  |

---

## Architecture

Layered modular monolith. Data flows strictly one way:

```
HTTP request
    │
    ▼
routes       validate input + declare OpenAPI + call service
    │
    ▼
service      business logic + orchestration + throw domain errors
    │
    ▼
repository   Drizzle queries only
    │
    ▼
db           neon-http client + schema
```

### Project Structure

```
src/
├── db/
│   ├── schema/              # Drizzle table definitions (snake_case columns)
│   ├── index.ts             # neon-http client
│   └── migrate.ts           # migration runner (used in prod start)
├── lib/
│   ├── factory.ts           # typed createApp() factory (AppEnv)
│   ├── errors.ts            # DomainError base class
│   ├── error-handler.ts     # handleAppError — maps domain errors to HTTP
│   ├── schemas.ts           # jsonContent(), errorResponse() helpers
│   └── openapi.ts           # OpenAPI doc + Scalar UI registration
├── middleware/
│   ├── auth.ts              # requireToken — Bearer token enforcement
│   └── types.ts             # AppEnv (Hono context typing)
├── modules/
│   ├── entries/             # Journal entry CRUD + safety scan trigger
│   ├── summaries/           # Weekly summary CRUD
│   └── safety/              # Deterministic crisis detection (keyword/regex)
├── scripts/
│   └── generate-openapi.ts  # Dumps openapi.json for Swift client generation
├── test/
│   └── config.ts            # Integration test gating (RUN_INTEGRATION_TESTS)
├── app.ts                   # Hono app wiring (CORS, auth, routes, error handler)
├── env.ts                   # Type-safe env validation (@t3-oss/env-core)
└── index.ts                 # Bun.serve entry point
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- A [Neon](https://neon.tech) Postgres database (free tier works)

### Local Setup

```bash
# Install dependencies
bun install

# Copy env template and fill in values
cp .env.example .env

# Push schema to Neon (dev only — skips migration history)
bun run db:push

# Start dev server with hot reload
bun run dev
# → http://localhost:4060
# → http://localhost:4060/docs  (Scalar API docs)
```

### Environment Variables

| Variable           | Required | Description                                                                  |
| ------------------ | -------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL`     | Yes      | Neon connection string — must include `?sslmode=require`                     |
| `API_BEARER_TOKEN` | Yes      | Static Bearer token for all `/api/*` routes. Generate: `openssl rand -hex 32` |
| `PORT`             | No       | Server port (default: `4060`)                                                |
| `NODE_ENV`         | No       | `development` or `production`                                                |
| `CORS_ORIGINS`     | No       | Comma-separated allowed origins in production. Empty = allow all (dev only)  |

---

## Scripts

| Command                            | Description                                              |
| ---------------------------------- | -------------------------------------------------------- |
| `bun run dev`                      | Dev server with hot reload                               |
| `bun run start`                    | Run migrations then serve (production)                   |
| `bun test`                         | Unit tests (safety module always runs)                   |
| `RUN_INTEGRATION_TESTS=1 bun test` | Include integration tests (requires a live Neon DB)      |
| `bun run test:coverage`            | Test with coverage report                                |
| `bun run fl`                       | Format + lint in one shot (`oxfmt --write && oxlint`)    |
| `bun run check`                    | TypeScript strict check (`tsc --noEmit`)                 |
| `bun run db:push`                  | Push schema changes directly to DB without migration (dev) |
| `bun run db:generate`              | Generate a new Drizzle migration file                    |
| `bun run db:migrate`               | Apply pending migrations                                 |
| `bun run db:studio`                | Open Drizzle Studio (visual DB browser)                  |
| `bun run openapi:generate`         | Dump `openapi.json` for Swift client generation          |

---

## API Reference

Full interactive docs are available at `/docs` (Scalar UI).

### Authentication

All `/api/*` endpoints require a `Bearer` token:

```
Authorization: Bearer <API_BEARER_TOKEN>
```

### Endpoints

| Method   | Path                    | Auth   | Description                          |
| -------- | ----------------------- | ------ | ------------------------------------ |
| `GET`    | `/`                     | Public | Health check                         |
| `GET`    | `/docs`                 | Public | Scalar interactive API documentation |
| `GET`    | `/openapi.json`         | Public | Raw OpenAPI 3.1 spec                 |
| `POST`   | `/api/entries`          | Bearer | Save entry and run safety scan       |
| `GET`    | `/api/entries`          | Bearer | List entries                         |
| `GET`    | `/api/entries/:id`      | Bearer | Get entry by ID                      |
| `DELETE` | `/api/entries/:id`      | Bearer | Delete entry                         |
| `POST`   | `/api/summaries`        | Bearer | Save weekly summary                  |
| `GET`    | `/api/summaries`        | Bearer | List weekly summaries                |
| `POST`   | `/api/safety/scan`      | Bearer | Scan text for crisis patterns        |
| `GET`    | `/api/safety/resources` | Bearer | List professional support resources  |

### Entry Creation Response

`POST /api/entries` returns both the saved entry and a safety scan result:

```json
{
  "entry": {
    "id": "019748c2-f0a1-7000-8000-000000000000",
    "content": "Today was a good day.",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "safety": {
    "flagged": false,
    "severity": "none",
    "matches": [],
    "rulesVersion": "2025-01-01.1",
    "resources": []
  }
}
```

When `flagged: true`, `resources` is populated with professional crisis support contacts.

---

## Safety Guardrail

The `modules/safety` module implements a **deterministic, auditable crisis detection layer** (PRD §5.4). It runs server-side on every entry submission.

Key properties:

- **No generative AI** — pure keyword and regex matching only
- **Deterministic** — same input always produces the same output
- **Versioned** — every change to `safety.keywords.ts` bumps `KEYWORDS_VERSION` (`YYYY-MM-DD.N`)
- **Transparent** — all patterns are human-readable and word-boundary anchored (`\b...\b`)

Severity levels: `critical` > `high` > `medium` > `none`. On multiple matches, the highest severity wins. When `flagged: true`, the response always includes `resources` (professional help contacts).

Any change to crisis detection rules requires a version bump and a corresponding test update in `src/modules/safety/__tests__/`.

---

## Swift Client Generation

The OpenAPI spec drives automatic Swift 6 client generation for the iOS app:

```bash
# 1. Regenerate the spec after any contract change
bun run openapi:generate

# 2. Generate the Swift client
openapi-generator-cli generate -i openapi.json -g swift6 -o ./ios-client
```

> Avoid renaming `operationId` values — they become Swift method names and are a breaking change for the iOS client.

---

## Docker

A minimal Alpine image is provided for containerized deployments:

```bash
docker build -t jeda-backend .

docker run -p 4060:4060 \
  -e DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" \
  -e API_BEARER_TOKEN="your-secret-token" \
  jeda-backend
```

The image uses a multi-stage build: production dependencies only, no dev tooling. Bun runs TypeScript directly — no compile step needed.

---

## Production Deployment

This project is deployed via **[Dokploy](https://dokploy.com)** — a self-hosted PaaS that manages containers, environment variables, and TLS automatically.

### Deploy Steps

1. Push to `prod` branch (via PR from `dev`)
2. Dokploy detects the push, builds the Docker image, and redeploys the container
3. Environment variables are managed through the Dokploy dashboard (not `.env` files)

### Security Checklist Before Deploy

- [ ] `API_BEARER_TOKEN` is a random string of at least 32 characters (`openssl rand -hex 32`)
- [ ] `DATABASE_URL` includes `?sslmode=require`
- [ ] `CORS_ORIGINS` is set to the iOS app's allowed origin (not left empty)
- [ ] `NODE_ENV=production`
- [ ] No `.env` file committed to the repository

---

## Quality Gates

All three must pass before merging:

```bash
bun run fl      # oxfmt --write && oxlint
bun run check   # tsc --noEmit
bun test        # bun:test (safety unit tests always run)
```
