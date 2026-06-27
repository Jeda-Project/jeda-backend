/**
 * Scope: openapi.ts
 * Purpose: OpenAPI spec definition and Scalar UI registration — also serves as source for Swift client generation.
 */
import { Scalar } from "@scalar/hono-api-reference";
import type { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import type { OpenAPIV3_1 } from "openapi-types";
import { z } from "zod";
import { entrySchema } from "../modules/entries/entries.schema.ts";
import {
  crisisResourceSchema,
  scanMatchSchema,
  scanResultSchema,
} from "../modules/safety/safety.schema.ts";
import { summarySchema } from "../modules/summaries/summaries.schema.ts";
import type { AppEnv } from "../middleware/types.ts";
import { errorSchema } from "./schemas.ts";
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
    schemas: {
      Entry: z.toJSONSchema(entrySchema, {
        unrepresentable: "any",
      }) as OpenAPIV3_1.SchemaObject,
      WeeklySummary: z.toJSONSchema(summarySchema, {
        unrepresentable: "any",
      }) as OpenAPIV3_1.SchemaObject,
      SafetyScanResult: z.toJSONSchema(scanResultSchema, {
        unrepresentable: "any",
      }) as OpenAPIV3_1.SchemaObject,
      SafetyScanMatch: z.toJSONSchema(scanMatchSchema, {
        unrepresentable: "any",
      }) as OpenAPIV3_1.SchemaObject,
      CrisisResource: z.toJSONSchema(crisisResourceSchema, {
        unrepresentable: "any",
      }) as OpenAPIV3_1.SchemaObject,
      Error: z.toJSONSchema(errorSchema, {
        unrepresentable: "any",
      }) as OpenAPIV3_1.SchemaObject,
    },
  },
  security: [{ bearerAuth: [] }],
};

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
