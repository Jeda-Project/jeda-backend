#!/usr/bin/env bash
# Blocks writes to .env files and warns on hardcoded secrets in source.

FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"
CONTENT="${CLAUDE_TOOL_INPUT_CONTENT:-}"

if [[ -z "$FILE" ]]; then
  exit 0
fi

# Hard block: never write .env files (use .env.example for templates)
if echo "$FILE" | grep -qE '(^|/)\.env(\.[A-Za-z0-9]+)?$'; then
  echo "[env-guard] BLOCKED: $FILE is a secret file and must not be written by tools." >&2
  echo "[env-guard] Edit it manually, or update .env.example instead." >&2
  exit 1
fi

# Only scan source files for hardcoded secrets
if ! echo "$FILE" | grep -qE '\.(ts|js|json|cjs|mjs)$'; then
  exit 0
fi

if [[ -z "$CONTENT" ]]; then
  exit 0
fi

WARNINGS=()

# Postgres / Neon connection strings
if echo "$CONTENT" | grep -qE 'postgres(ql)?://[^"'"'"' ]*:[^"'"'"' ]*@'; then
  WARNINGS+=("hardcoded Postgres connection string — load from env.ts (DATABASE_URL)")
fi

# Long hex tokens (>= 24 chars) that look like Bearer tokens
if echo "$CONTENT" | grep -qE '["'"'"'][0-9a-fA-F]{32,}["'"'"']'; then
  WARNINGS+=("long hex literal — possible hardcoded token; load from env.ts (API_BEARER_TOKEN)")
fi

# JWT-like strings
if echo "$CONTENT" | grep -qE 'eyJ[A-Za-z0-9_-]{10,}\.'; then
  WARNINGS+=("JWT-like literal detected — never hardcode credentials")
fi

if [[ ${#WARNINGS[@]} -gt 0 ]]; then
  echo "[env-guard] WARNING: possible secret hardcoded in $FILE." >&2
  for w in "${WARNINGS[@]}"; do
    echo "  ⚠ $w" >&2
  done
  echo "[env-guard] Secrets must come from env.ts (@t3-oss/env-core). See AGENTS.md §E." >&2
fi

exit 0
