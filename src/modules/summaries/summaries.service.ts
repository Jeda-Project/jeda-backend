import type { WeeklySummary } from "../../db/schema/weekly-summaries.schema.ts";
import { summariesRepository } from "./summaries.repository.ts";
import type { CreateSummaryBody } from "./summaries.schema.ts";

export const summariesService = {
  async create(body: CreateSummaryBody): Promise<WeeklySummary> {
    return summariesRepository.insert({
      id: body.id,
      weekStart: body.weekStart,
      topTopics: body.topTopics,
      moodTrend: body.moodTrend,
      reliefNote: body.reliefNote,
    });
  },

  async list(limit: number): Promise<WeeklySummary[]> {
    return summariesRepository.list(limit);
  },
};
