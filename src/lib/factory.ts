import { createFactory } from "hono/factory";
import type { AppEnv } from "../middleware/types.ts";

// AppEnv-typed factory so all routers and handlers share the same context type.
/**
 * Scope: factory.ts
 * Purpose: AppEnv-typed Hono factory — ensures all routers and handlers share the same context type.
 */
export const factory = createFactory<AppEnv>();
