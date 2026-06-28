#!/usr/bin/env bash
# Runs oxfmt on modified files after every write.

FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if [[ -z "$FILE" ]] || [[ ! -f "$FILE" ]]; then
  exit 0
fi

EXT="${FILE##*.}"

case "$EXT" in
  ts|js|json|md)
    if command -v oxfmt &>/dev/null; then
      timeout 5 oxfmt --write "$FILE" 2>/dev/null || true
    fi
    ;;
esac

exit 0
