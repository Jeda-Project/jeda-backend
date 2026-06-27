import { pgTable, uuid, text, real, timestamp } from "drizzle-orm/pg-core";

// Entry jurnal harian (PRD 8.1). Field sentiment/reflection/openQuestion
// dikomputasi on-device (NLTagger + Foundation Models) lalu disinkron ke sini.
export const entries = pgTable("entries", {
  // Client boleh mengirim id sendiri agar sinkronisasi device->cloud idempoten.
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  sentimentScore: real("sentiment_score"),
  reflectedPhrase: text("reflected_phrase"),
  openQuestion: text("open_question"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
