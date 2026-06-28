# PRODUCT.md — Jeda

## What Jeda Is

Jeda is an iOS app for **journaling & mood check-in**, built for
builders/developers who want a lightweight, private reflection habit. Users write
short entries; the app helps them notice patterns in mood and energy over time.

## Who It's For

Developers and makers who experience burnout cycles and want a low-friction,
privacy-first way to check in with themselves — not a clinical tool.

## AI Lives On-Device

Every generative/ML feature runs **natively on iOS**, never on the server:

- **Sentiment** — Apple NLTagger.
- **Reflection & open questions** — Apple Foundation Models.
- **Weekly recap & deep-chat** — on-device.

This keeps personal journal content on the user's device by default.

## What the Backend Does

The backend is deliberately minimal — two jobs only:

1. **Storage & sync** — durable cloud copy of entries and weekly summaries so
   data survives device loss and can sync across a user's devices. Clients may
   supply their own `id`/`createdAt` so device→cloud sync is idempotent.
2. **Deterministic safety guardrail** — when an entry is created, the server runs
   an auditable, non-generative crisis-detection scan (keyword/regex). If risk
   signals appear, the response surfaces professional help resources. This is a
   safety net that does not depend on the on-device AI being present or correct.

## MVP Boundaries

- Single user, gated by one static Bearer token (no accounts/roles).
- No server-side generative AI — ever.
- CRUD for entries + weekly summaries, plus the safety scan endpoint.
- OpenAPI spec generated to produce a typed Swift client for the iOS app.

## Why This Split Matters

Keeping AI on-device protects privacy; keeping the safety guardrail on the server
makes it **deterministic, auditable, and always-on** — independent of model
behavior. The safety module is the one place where correctness is non-negotiable;
see SSOT.md §8 and AGENTS.md §F.
