import { z } from "zod";

const topTopicSchema = z.object({
  topic: z.string().min(1),
  count: z.number().int().min(0),
});

const moodTrendPointSchema = z.object({
  day: z.string().min(1),
  score: z.number().min(-1).max(1),
});

export const summarySchema = z
  .object({
    id: z.uuid(),
    weekStart: z.string(),
    topTopics: z.array(topTopicSchema),
    moodTrend: z.array(moodTrendPointSchema),
    reliefNote: z.string().nullable(),
    createdAt: z.iso.datetime({ offset: true }),
  })
  .meta({ id: "WeeklySummary" });

export const createSummaryBodySchema = z
  .object({
    id: z.uuid().optional(),
    weekStart: z.iso.date(),
    topTopics: z.array(topTopicSchema).default([]),
    moodTrend: z.array(moodTrendPointSchema).default([]),
    reliefNote: z.string().max(2_000).optional(),
  })
  .meta({ id: "CreateWeeklySummaryBody" });

export const createSummaryResponseSchema = z
  .object({ summary: summarySchema })
  .meta({ id: "CreateWeeklySummaryResponse" });

export const listSummariesQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(104).default(12),
  })
  .meta({ id: "ListWeeklySummariesQuery" });

export const listSummariesResponseSchema = z
  .object({ summaries: z.array(summarySchema) })
  .meta({ id: "ListWeeklySummariesResponse" });

export type CreateSummaryBody = z.infer<typeof createSummaryBodySchema>;
