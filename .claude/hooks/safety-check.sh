#!/usr/bin/env bash
# Blocks dangerous commands before execution.

COMMAND="${CLAUDE_TOOL_INPUT_COMMAND:-}"

# Block rm -rf on protected paths
if echo "$COMMAND" | grep -qE 'rm\s+-rf'; then
  if echo "$COMMAND" | grep -qE '(src/|\.claude/|AGENTS\.md|SSOT\.md|PRODUCT\.md|drizzle/|/\s*$|\.\s*$|\.\.\s*$|\*)'; then
    echo "[safety] BLOCKED: rm -rf on protected path: $COMMAND" >&2
    exit 1
  fi
fi

# Block git push to main/master
if echo "$COMMAND" | grep -qE 'git\s+push\s+origin\s+(main|master)'; then
  echo "[safety] BLOCKED: git push to main/master is not allowed. Use a feature branch." >&2
  exit 1
fi

# Block shell redirection writes to .env files
if echo "$COMMAND" | grep -qE '>\s*\.env'; then
  echo "[safety] BLOCKED: writing to .env files via shell redirection." >&2
  exit 1
fi

# Remind RTK enforcement for bun/git/drizzle commands not prefixed with rtk
if echo "$COMMAND" | grep -qE '(^|\s|;|&&|\|)\s*(bun|drizzle-kit|oxlint|oxfmt|tsc)\b' \
  && ! echo "$COMMAND" | grep -qE '(^|\s|;|&&|\|)\s*rtk\b'; then
  echo "[safety] REMINDER: prefix terminal commands with 'rtk' (see CLAUDE.md §RTK Enforcement)." >&2
fi

exit 0
