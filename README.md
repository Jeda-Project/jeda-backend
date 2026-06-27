# Jeda Backend

Backend MVP untuk aplikasi iOS **Jeda** — journaling & mood check-in untuk
builder/developer. Backend berperan sebagai **penyimpanan data + safety
guardrail deterministik**. Semua AI (sentiment, reflection, weekly recap,
deep-chat) berjalan **on-device di native iOS** (Foundation Models + NLTagger).

## Tech Stack

| Layer       | Pilihan                                                  |
| ----------- | -------------------------------------------------------- |
| Runtime     | Bun                                                      |
| Framework   | Hono                                                     |
| Database    | Neon (Postgres serverless) via Drizzle ORM (`neon-http`) |
| Validation  | Zod                                                      |
| API Docs    | hono-openapi + Scalar (`/docs`)                          |
| Auth        | Bearer token statis (single-user gatekeeper)             |
| Lint/Format | oxlint + oxfmt                                           |
| Deploy      | VPS Ubuntu — PM2 + Nginx + Let's Encrypt                 |

## Arsitektur

Modular monolith berlapis: `routes → service → repository → db`.

```
src/
├── db/             # schema Drizzle, client neon-http, migrate
├── lib/            # factory, errors, error-handler, schemas, openapi
├── middleware/     # auth (Bearer), types (AppEnv)
├── modules/
│   ├── entries/    # CRUD entry jurnal + trigger safety scan
│   ├── summaries/  # CRUD rekap mingguan
│   └── safety/     # crisis detection deterministik (keyword/regex)
├── scripts/        # generate-openapi.ts
├── app.ts          # wiring Hono
├── env.ts          # env type-safe (@t3-oss/env-core)
└── index.ts        # entry Bun.serve
```

## Setup

```bash
bun install
cp .env.example .env          # isi DATABASE_URL (Neon) & API_BEARER_TOKEN
bun run db:push               # buat tabel di Neon
bun run dev                   # http://localhost:4060
```

Generate token: `openssl rand -hex 32`.

## Scripts

| Command                                                        | Fungsi                          |
| -------------------------------------------------------------- | ------------------------------- |
| `bun run dev`                                                  | Dev server (hot reload)         |
| `bun run start`                                                | Migrasi + serve (produksi)      |
| `bun test`                                                     | Unit test (safety selalu jalan) |
| `RUN_INTEGRATION_TESTS=1 bun test`                             | + integration test (butuh Neon) |
| `bun run lint` / `format` / `check`                            | Quality gate                    |
| `bun run db:push` / `db:generate` / `db:migrate` / `db:studio` | Drizzle                         |
| `bun run openapi:generate`                                     | Dump `openapi.json`             |

## Endpoints

| Method   | Path                     | Auth            |
| -------- | ------------------------ | --------------- |
| `GET`    | `/`                      | publik (health) |
| `POST`   | `/api/entries`           | Bearer          |
| `GET`    | `/api/entries`           | Bearer          |
| `GET`    | `/api/entries/:id`       | Bearer          |
| `DELETE` | `/api/entries/:id`       | Bearer          |
| `POST`   | `/api/summaries`         | Bearer          |
| `GET`    | `/api/summaries`         | Bearer          |
| `POST`   | `/api/safety/scan`       | Bearer          |
| `GET`    | `/api/safety/resources`  | Bearer          |
| `GET`    | `/openapi.json`, `/docs` | publik          |

Sertakan header `Authorization: Bearer <API_BEARER_TOKEN>` untuk semua `/api/*`.

## Generate Swift client (iOS)

```bash
bun run openapi:generate
openapi-generator-cli generate -i openapi.json -g swift6 -o ./ios-client
```

## Safety guardrail (PRD 5.4)

`modules/safety` melakukan deteksi krisis **deterministik** (keyword + regex,
non-generatif, dapat diaudit — lihat `safety.keywords.ts`, versinya di
`KEYWORDS_VERSION`). Dijalankan server-side saat entry dibuat; bila ter-flag,
response menyertakan blok `safety` berisi resource bantuan profesional.
Setiap perubahan daftar keyword wajib melalui review & menaikkan versi.

## Deploy (VPS)

```bash
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
```

Nginx mem-proxy `:443 → http://127.0.0.1:4060` dengan TLS Let's Encrypt
(`certbot --nginx`). Koneksi klien↔backend & backend↔Neon wajib HTTPS/TLS.
