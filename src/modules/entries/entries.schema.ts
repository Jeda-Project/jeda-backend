import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { entries } from "../../db/schema/entries.schema.ts";
import { scanResultSchema } from "../safety/safety.schema.ts";

// Read schema derived directly from the Drizzle table.
/**
 * Scope: entries.schema.ts
 * Purpose: Zod schemas for entry request/response validation and OpenAPI documentation.
 */
export const entrySchema = createSelectSchema(entries).meta({ id: "Entry" });

// Create body — AI fields are optional as they are computed on-device.
// `id` & `createdAt` may be sent by the client for idempotent sync.
export const createEntryBodySchema = z
  .object({
    id: z.uuid().optional(),
    content: z.string().min(1).max(10_000),
    sentimentScore: z.number().min(-1).max(1).optional(),
    reflectedPhrase: z.string().max(2_000).optional(),
    openQuestion: z.string().max(2_000).optional(),
    createdAt: z.iso.datetime({ offset: true }).optional(),
  })
  .meta({ id: "CreateEntryBody" });

// Create response includes the safety scan result (PRD 5.4).
export const createEntryResponseSchema = z
  .object({
    entry: entrySchema,
    safety: scanResultSchema,
  })
  .meta({ id: "CreateEntryResponse" });

export const listEntriesQuerySchema = z
  .object({
    from: z.iso.datetime({ offset: true }).optional(),
    to: z.iso.datetime({ offset: true }).optional(),
    limit: z.coerce.number().int().min(1).max(200).default(50),
  })
  .meta({ id: "ListEntriesQuery" });

export const listEntriesResponseSchema = z
  .object({
    entries: z.array(entrySchema),
  })
  .meta({ id: "ListEntriesResponse" });

export const entryIdParamSchema = z.object({
  id: z.uuid(),
});

export type CreateEntryBody = z.infer<typeof createEntryBodySchema>;
export type ListEntriesQuery = z.infer<typeof listEntriesQuerySchema>;
