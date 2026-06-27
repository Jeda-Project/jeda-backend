/**
 * Scope: entries.routes.ts
 * Purpose: HTTP route definitions for journal entries — create, list, get by ID, and delete.
 */
import { describeRoute, validator } from "hono-openapi";
import { factory } from "../../lib/factory.ts";
import { errorResponse, jsonContent } from "../../lib/schemas.ts";
import { entriesService } from "./entries.service.ts";
import {
  createEntryBodySchema,
  createEntryResponseSchema,
  entryIdParamSchema,
  entrySchema,
  listEntriesQuerySchema,
  listEntriesResponseSchema,
} from "./entries.schema.ts";
import { z } from "zod";

export const entriesRouter = factory.createApp();

entriesRouter.post(
  "/",
  describeRoute({
    operationId: "createEntry",
    tags: ["Entries"],
    summary: "Save entry and run safety scan",
    description:
      "Persists a journal entry and runs a deterministic safety scan. Returns the saved entry and scan result. AI fields (sentiment, reflection, open question) are optional and computed on-device.",
    responses: {
      201: jsonContent(createEntryResponseSchema, "Entry created"),
      422: errorResponse("Invalid request body"),
    },
  }),
  validator("json", createEntryBodySchema),
  async (c) => {
    const body = c.req.valid("json");
    const result = await entriesService.create(body);
    return c.json(result, 201);
  },
);

entriesRouter.get(
  "/",
  describeRoute({
    operationId: "listEntries",
    tags: ["Entries"],
    summary: "List entries",
    description:
      "Returns a paginated list of entries ordered by creation date (newest first). Supports optional date range filtering via `from` and `to` ISO datetime params. Default limit: 50, max: 200.",
    responses: {
      200: jsonContent(listEntriesResponseSchema, "List of entries"),
    },
  }),
  validator("query", listEntriesQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const entries = await entriesService.list({
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      limit: query.limit,
    });
    return c.json({ entries }, 200);
  },
);

entriesRouter.get(
  "/:id",
  describeRoute({
    operationId: "getEntry",
    tags: ["Entries"],
    summary: "Get entry by ID",
    description:
      "Returns a single entry by its UUID. Returns 404 if the entry does not exist.",
    responses: {
      200: jsonContent(z.object({ entry: entrySchema }), "Entry"),
      404: errorResponse("Entry not found"),
    },
  }),
  validator("param", entryIdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const entry = await entriesService.getById(id);
    return c.json({ entry }, 200);
  },
);

entriesRouter.delete(
  "/:id",
  describeRoute({
    operationId: "deleteEntry",
    tags: ["Entries"],
    summary: "Delete entry",
    description:
      "Permanently deletes an entry by its UUID. Returns 204 on success, 404 if not found.",
    responses: {
      204: { description: "Entry deleted successfully" },
      404: errorResponse("Entry not found"),
    },
  }),
  validator("param", entryIdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    await entriesService.remove(id);
    return c.body(null, 204);
  },
);
