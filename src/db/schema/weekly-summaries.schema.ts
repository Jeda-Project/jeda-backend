import {
  pgTable,
  uuid,
  text,
  date,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export type MoodTrendPoint = { day: string; score: number };
export type TopTopic = { topic: string; count: number };

// Rekap mingguan terstruktur (PRD 5.3 & 8.1). Dihasilkan on-device via
// Foundation Models (@Generable), backend hanya menyimpan hasilnya.
export const weeklySummaries = pgTable("weekly_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  weekStart: date("week_start").notNull(),
  topTopics: jsonb("top_topics").$type<TopTopic[]>().notNull().default([]),
  moodTrend: jsonb("mood_trend")
    .$type<MoodTrendPoint[]>()
    .notNull()
    .default([]),
  reliefNote: text("relief_note"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type WeeklySummary = typeof weeklySummaries.$inferSelect;
export type NewWeeklySummary = typeof weeklySummaries.$inferInsert;
