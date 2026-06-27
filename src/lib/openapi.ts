import { Scalar } from "@scalar/hono-api-reference";
import type { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import type { AppEnv } from "../middleware/types.ts";

/**
 * Scope: openapi.ts
 * Purpose: OpenAPI spec definition and Scalar UI registration — also serves as source for Swift client generation.
 */
export const openApiDocumentation = {
  openapi: "3.1.0",
  info: {
    title: "Jeda API",
    version: "0.1.0",
    description:
      "MVP backend for the Jeda iOS app — entry & weekly summary persistence, " +
      "plus a deterministic safety guardrail. AI runs on-device.",
  },
  servers: [{ url: "/", description: "current host" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http" as const, scheme: "bearer" },
    },
  },
  security: [{ bearerAuth: [] }],
};

// Registers the OpenAPI spec (/openapi.json) and Scalar UI (/docs).
// The spec is also the source for Swift client generation on iOS.
export function registerOpenApi(app: Hono<AppEnv>) {
  app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
      documentation: openApiDocumentation,
      excludeMethods: ["OPTIONS", "HEAD"],
    }),
  );

  app.get(
    "/docs",
    Scalar({ url: "/openapi.json", pageTitle: "Jeda API — Docs" }),
  );
}
