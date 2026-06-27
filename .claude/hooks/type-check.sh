#!/usr/bin/env bash
# Optional: incremental TypeScript check after .ts edits.
# NOT wired in settings.json by default (avoids churn on rapid edits).
# To enable: add to PostToolUse Write|Edit hooks.
#   { "type": "command", "command": "bash .claude/hooks/type-check.sh" }

FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if [[ -z "$FILE" ]] || [[ ! -f "$FILE" ]]; then
  exit 0
fi

if ! echo "$FILE" | grep -qE '\.ts$'; then
  exit 0
fi

if command -v tsc &>/dev/null; then
  timeout 60 tsc --noEmit --pretty false --incremental \
    --tsBuildInfoFile node_modules/.cache/tsc-hook.tsbuildinfo 2>&1 | tail -20 || true
fi

exit 0
