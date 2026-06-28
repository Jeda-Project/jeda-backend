# Anti-Pattern: Missing .ts Extension on Imports

## Trap

TypeScript imports in this project **must** include the `.ts` extension. Omitting
it causes a module resolution failure at runtime.

## Why

The `tsconfig.json` has:

- `"allowImportingTsExtensions": true`
- `"verbatimModuleSyntax": true`

These settings tell Bun/TypeScript to resolve modules exactly as written.
With `verbatimModuleSyntax`, the import is preserved verbatim in the output —
so the extension must be present in the source.

## Wrong

```typescript
import { db } from "../../db/index";
import { entriesService } from "./entries.service";
import type { AppEnv } from "../middleware/types";
```

## Right

```typescript
import { db } from "../../db/index.ts";
import { entriesService } from "./entries.service.ts";
import type { AppEnv } from "../middleware/types/index.ts";
```

## Node Builtins

Use the `node:` protocol for Node/Bun built-in modules:

```typescript
import { timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
```

## tsc Will Catch This

`rtk bun run check` (`tsc --noEmit`) will flag missing extensions as
"cannot find module" errors. Run it after adding any new import.

## References

- `tsconfig.json` — `allowImportingTsExtensions`, `verbatimModuleSyntax`
- `src/middleware/auth.ts` — correct import examples
- AGENTS.md §G Rule 26 — RTK on all commands
