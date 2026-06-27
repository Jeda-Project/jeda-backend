import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db/index.ts";
import {
  entries,
  type Entry,
  type NewEntry,
} from "../../db/schema/entries.schema.ts";

export interface ListEntriesFilter {
  from?: Date;
  to?: Date;
  limit: number;
}

export const entriesRepository = {
  async insert(values: NewEntry): Promise<Entry> {
    const [row] = await db.insert(entries).values(values).returning();
    return row!;
  },

  async list(filter: ListEntriesFilter): Promise<Entry[]> {
    const conditions = [
      filter.from ? gte(entries.createdAt, filter.from) : undefined,
      filter.to ? lte(entries.createdAt, filter.to) : undefined,
    ].filter((c) => c !== undefined);

    return db
      .select()
      .from(entries)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(entries.createdAt))
      .limit(filter.limit);
  },

  async findById(id: string): Promise<Entry | undefined> {
    return db.query.entries.findFirst({
      where: (e, { eq: equals }) => equals(e.id, id),
    });
  },

  async delete(id: string): Promise<boolean> {
    const deleted = await db
      .delete(entries)
      .where(eq(entries.id, id))
      .returning({ id: entries.id });
    return deleted.length > 0;
  },
};
