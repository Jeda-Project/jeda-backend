#!/usr/bin/env bash
# Warns when safety crisis rules change without bumping KEYWORDS_VERSION.
# Governance: every keyword/rule change must bump the version + update tests
# (AGENTS.md §F, rules/backend/safety-module.md). Never blocks — warns to Claude.

FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if [[ -z "$FILE" ]]; then
  exit 0
fi

# Only react to the keywords source
if ! echo "$FILE" | grep -qE 'safety\.keywords\.ts$'; then
  exit 0
fi

# Need git to diff; if not a repo, just remind.
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "[safety-keywords] ⚠ $FILE changed. Confirm KEYWORDS_VERSION is bumped and safety tests updated." >&2
  exit 0
fi

DIFF="$(git diff -- "$FILE" 2>/dev/null)"

# Nothing staged/unstaged to compare (e.g. brand new file) — remind anyway.
if [[ -z "$DIFF" ]]; then
  echo "[safety-keywords] ⚠ $FILE touched. Confirm KEYWORDS_VERSION is set and safety tests cover the change." >&2
  exit 0
fi

# Did the rules/patterns change?
RULES_CHANGED=0
if echo "$DIFF" | grep -qE '^[+-].*(CRISIS_RULES|patterns:|severity:|category:|/.*\\b)'; then
  RULES_CHANGED=1
fi

# Did the version line change?
VERSION_CHANGED=0
if echo "$DIFF" | grep -qE '^[+-].*KEYWORDS_VERSION'; then
  VERSION_CHANGED=1
fi

if [[ "$RULES_CHANGED" -eq 1 ]] && [[ "$VERSION_CHANGED" -eq 0 ]]; then
  echo "[safety-keywords] ⚠ WARNING: crisis rules changed but KEYWORDS_VERSION was NOT bumped." >&2
  echo "[safety-keywords]   AGENTS.md §F Rule 20: bump KEYWORDS_VERSION and update safety tests." >&2
  echo "[safety-keywords]   Run: rtk bun test src/modules/safety" >&2
fi

exit 0
