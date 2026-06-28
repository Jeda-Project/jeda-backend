# /aside

Pause the current task, handle a quick side question or unrelated fix, then return.

## Steps

1. **Run `/checkpoint` first** — saves a safety commit + session log so no work is lost
   if the conversation context gets compressed during the aside
2. Handle the aside (keep it small — if it's a new feature, open a separate branch)
3. Run gates if any code was changed: `rtk bun run check && rtk bun run lint`
4. **Return** — restate the paused task from the checkpoint template below and continue

## Notes

- An aside should be ≤15 min of work. If it's larger, create a new task/branch instead.
- Do not mix aside changes with the in-progress feature in the same commit
- If the aside touches `src/modules/safety/**`, follow the full safety governance flow
  even for small changes — `KEYWORDS_VERSION` bump + tests

## Template

```
## Aside: <what>

### Current task (pausing)
- File: <path:line>
- Status: <where I was>

### Aside task
<description>

### Return to
<resume point>
```
