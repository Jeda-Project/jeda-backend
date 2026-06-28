#!/usr/bin/env bash
# Runs oxlint on modified TypeScript files after every write.

FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if [[ -z "$FILE" ]] || [[ ! -f "$FILE" ]]; then
  exit 0
fi

EXT="${FILE##*.}"

case "$EXT" in
  ts)
    if command -v oxlint &>/dev/null; then
      timeout 10 oxlint "$FILE" 2>&1 || true
    fi
    ;;
  json)
    if command -v python3 &>/dev/null; then
      python3 -m json.tool "$FILE" > /dev/null 2>&1 \
        && echo "[auto-lint] $FILE JSON valid" \
        || echo "[auto-lint] WARNING: $FILE has JSON syntax errors" >&2
    fi
    ;;
esac

exit 0
