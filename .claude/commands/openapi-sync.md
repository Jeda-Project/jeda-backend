# /openapi-sync

Regenerate and verify the OpenAPI spec after route or schema changes.

## When to Run

- After adding or removing an endpoint
- After changing a request/response Zod schema
- After changing `describeRoute` metadata (summary, description, responses)
- Before opening a PR that touches routes or schemas
- Before regenerating the Swift client for iOS

## Steps

### 1. Regenerate

```bash
rtk bun run openapi:generate
```

This runs the app's OpenAPI export script and writes `openapi.json`.

### 2. Verify the diff

```bash
git diff openapi.json
```

Check:

- [ ] New endpoints are present with correct paths and methods
- [ ] Request bodies have the correct schema (no `{}` or `any`)
- [ ] All response codes are documented (200/201/204/401/404/422)
- [ ] `security: [{ Bearer: [] }]` is present on all `/api/**` operations
- [ ] No operations were accidentally removed

### 3. Fix schema issues (if any)

If an operation schema is incomplete:

- Ensure the Zod schema has `.meta({ id: "SchemaName" })` for named components
- Ensure `describeRoute` has `responses` for every status code the handler can return
- Re-run `rtk bun run openapi:generate` after fixes

### 4. Commit the updated spec

```bash
git add openapi.json
git commit -m "chore(api): regenerate OpenAPI spec after <change>"
```

### 5. Swift client regen (if needed)

If the iOS client is auto-generated from the spec, notify the mobile team or
run the client generation script as documented in the iOS project.

## Notes

- `openapi.json` is **generated** — never hand-edit it
- The file is served at `GET /openapi.json` and powers the Scalar UI at `GET /docs`
- The `generated-guard.sh` hook will block any direct write to `openapi.json`
