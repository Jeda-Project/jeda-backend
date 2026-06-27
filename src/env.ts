import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Scope: env.ts
 * Purpose: Validated environment configuration — parses and type-checks all required env vars at startup.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(4060),

    // Neon Postgres serverless — sslmode=require is mandatory.
    DATABASE_URL: z.url(),

    // Static Bearer token gatekeeper (single-user, PRD 8.2).
    API_BEARER_TOKEN: z.string().min(24),

    // Allowed CORS origins (comma-separated). Empty = allow all (dev).
    CORS_ORIGINS: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export const isProduction = env.NODE_ENV === "production";

export const corsOrigins = env.CORS_ORIGINS
  ? env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];
