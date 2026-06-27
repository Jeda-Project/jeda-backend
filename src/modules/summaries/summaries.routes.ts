/**
 * Scope: summaries.routes.ts
 * Purpose: HTTP route definitions for weekly summaries — create and list.
 */
import { describeRoute, validator } from "hono-openapi";
import { factory } from "../../lib/factory.ts";
import { errorResponse, jsonContent } from "../../lib/schemas.ts";
import { summariesService } from "./summaries.service.ts";
import {
  createSummaryBodySchema,
  createSummaryResponseSchema,
  listSummariesQuerySchema,
  listSummariesResponseSchema,
} from "./summaries.schema.ts";

export const summariesRouter = factory.createApp();

summariesRouter.post(
  "/",
  describeRoute({
    operationId: "createSummary",
    tags: ["Summaries"],
    summary: "Save weekly summary",
    description:
      "Persists an AI-generated weekly summary. The summary content is computed on-device and sent to the backend for storage only.",
    responses: {
      201: jsonContent(createSummaryResponseSchema, "Summary created"),
      422: errorResponse("Invalid request body"),
    },
  }),
  validator("json", createSummaryBodySchema),
  async (c) => {
    const body = c.req.valid("json");
    const summary = await summariesService.create(body);
    return c.json({ summary }, 201);
  },
);

summariesRouter.get(
  "/",
  describeRoute({
    operationId: "listSummaries",
    tags: ["Summaries"],
    summary: "List weekly summaries",
    description:
      "Returns weekly summaries ordered by creation date (newest first). Supports optional date range filtering via `from` and `to` ISO datetime params.",
    responses: {
      200: jsonContent(listSummariesResponseSchema, "List of summaries"),
    },
  }),
  validator("query", listSummariesQuerySchema),
  async (c) => {
    const { limit } = c.req.valid("query");
    const summaries = await summariesService.list(limit);
    return c.json({ summaries }, 200);
  },
);
