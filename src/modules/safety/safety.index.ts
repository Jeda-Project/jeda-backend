/**
 * Scope: safety.index.ts
 * Purpose: HTTP route definitions for the deterministic safety module — text scanning and crisis resource listing.
 */
import { describeRoute, validator } from "hono-openapi";
import { factory } from "../../lib/factory.ts";
import { errorResponse, jsonContent } from "../../lib/schemas.ts";
import { CRISIS_RESOURCES } from "./safety.resources.ts";
import {
  resourcesResponseSchema,
  scanBodySchema,
  scanResultSchema,
} from "./safety.schema.ts";
import { runScan } from "./safety.service.ts";

export const safetyRouter = factory.createApp();

safetyRouter.post(
  "/scan",
  describeRoute({
    operationId: "scanText",
    tags: ["Safety"],
    summary: "Scan text for crisis patterns",
    description:
      "Runs deterministic keyword/pattern matching against the provided text. No generative AI — fully auditable. Returns severity level and matched categories.",
    responses: {
      200: jsonContent(scanResultSchema, "Scan result"),
      422: errorResponse("Invalid request body"),
    },
  }),
  validator("json", scanBodySchema),
  (c) => {
    const { text } = c.req.valid("json");
    return c.json(runScan(text), 200);
  },
);

safetyRouter.get(
  "/resources",
  describeRoute({
    operationId: "getCrisisResources",
    tags: ["Safety"],
    summary: "List professional support resources",
    description:
      "Returns the static list of professional crisis support resources shown to the user when a critical or high-severity pattern is detected.",
    responses: {
      200: jsonContent(
        resourcesResponseSchema,
        "List of crisis support resources",
      ),
      401: errorResponse("Unauthorized"),
    },
  }),
  (c) => c.json({ resources: [...CRISIS_RESOURCES] }, 200),
);
