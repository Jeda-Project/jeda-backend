import { desc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import {
  weeklySummaries,
  type NewWeeklySummary,
  type WeeklySummary,
} from "../../db/schema/weekly-summaries.schema.ts";

export const summariesRepository = {
  async insert(values: NewWeeklySummary): Promise<WeeklySummary> {
    const [row] = await db.insert(weeklySummaries).values(values).returning();
    return row!;
  },

  async list(limit: number): Promise<WeeklySummary[]> {
    return db
      .select()
      .from(weeklySummaries)
      .orderBy(desc(weeklySummaries.weekStart))
      .limit(limit);
  },
};
