import { createMiddleware } from "hono/factory";
import { env } from "../env.ts";
import type { AppEnv } from "./types.ts";

// Constant-time comparison to prevent timing attacks on the token.
/**
 * Scope: auth.ts
 * Purpose: Bearer token authentication middleware — enforces static token gatekeeper on all /api/* routes.
 */

function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  if (aBytes.length !== bBytes.length) return false;

  let mismatch = 0;
  for (let i = 0; i < aBytes.length; i++) {
    mismatch |= aBytes[i]! ^ bBytes[i]!;
  }
  return mismatch === 0;
}

// Static Bearer token gatekeeper (PRD 8.2). Mounted on /api/* so all data endpoints
// require a valid Authorization header.
export const requireToken = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token || !timingSafeEqual(token, env.API_BEARER_TOKEN)) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
  }

  await next();
});
