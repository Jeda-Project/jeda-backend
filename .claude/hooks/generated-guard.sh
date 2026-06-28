#!/usr/bin/env bash
# Blocks writes to generated artifacts (OpenAPI spec, Drizzle migrations).

FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if [[ -z "$FILE" ]]; then
  exit 0
fi

# Block writes to the generated OpenAPI spec
if echo "$FILE" | grep -qE '(^|/)openapi\.json$'; then
  echo "[generated-guard] BLOCKED: openapi.json is generated. Run 'rtk bun run openapi:generate'." >&2
  exit 1
fi

# Block writes to generated Drizzle migrations
if echo "$FILE" | grep -qE '(^|/)drizzle/'; then
  echo "[generated-guard] BLOCKED: $FILE is a generated migration. Change the schema, then run 'rtk bun run db:generate'." >&2
  exit 1
fi

exit 0
