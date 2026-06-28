#!/usr/bin/env bash
# Session summary on Claude stop: modified files, lint status, open checklist.

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Claude Code — jeda-backend Session Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if git rev-parse --is-inside-work-tree &>/dev/null; then
  MODIFIED=$(git diff --name-only HEAD 2>/dev/null)
  STAGED=$(git diff --cached --name-only 2>/dev/null)
  if [[ -n "$MODIFIED" ]] || [[ -n "$STAGED" ]]; then
    echo ""
    echo "Modified files:"
    { echo "$STAGED"; echo "$MODIFIED"; } | sort -u | grep -v '^$' | sed 's/^/  /'
  else
    echo ""
    echo "No uncommitted changes."
  fi

  TS_FILES=$(git diff --name-only HEAD 2>/dev/null | grep -E '\.ts$' | head -5)
  if [[ -n "$TS_FILES" ]] && command -v oxlint &>/dev/null; then
    echo ""
    echo "Lint check:"
    echo "$TS_FILES" | xargs timeout 15 oxlint 2>&1 | tail -5 || true
  fi
else
  echo ""
  echo "📝 Not a git repository yet — run 'git init' to enable change tracking."
fi

echo ""
echo "Before pushing, verify:"
echo "  □ rtk bun run check   (TypeScript)"
echo "  □ rtk bun run lint    (oxlint)"
echo "  □ rtk bun run format  (oxfmt)"
echo "  □ rtk bun test        (bun:test)"
echo ""

exit 0
