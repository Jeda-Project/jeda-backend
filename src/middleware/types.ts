import type { Env } from "hono";

// Context variables available across all handlers. Kept minimal for single-user MVP;
// can be extended (e.g. requestId) in a later phase.
/**
 * Scope: types.ts
 * Purpose: Defines the typed Hono application environment shared across all middleware and route handlers.
 */

export interface AppEnv extends Env {
  Variables: {
    requestId: string;
  };
}
