import type { Entry } from "../../db/schema/entries.schema.ts";
import { runScan } from "../safety/safety.service.ts";
import type { ScanResult } from "../safety/safety.schema.ts";
import { EntryNotFoundError } from "./entries.errors.ts";
import {
  entriesRepository,
  type ListEntriesFilter,
} from "./entries.repository.ts";
import type { CreateEntryBody } from "./entries.schema.ts";

export const entriesService = {
  // Simpan entry + jalankan safety guardrail deterministik server-side.
  async create(
    body: CreateEntryBody,
  ): Promise<{ entry: Entry; safety: ScanResult }> {
    const safety = runScan(body.content);

    const entry = await entriesRepository.insert({
      id: body.id,
      content: body.content,
      sentimentScore: body.sentimentScore,
      reflectedPhrase: body.reflectedPhrase,
      openQuestion: body.openQuestion,
      reflectionText: body.reflectionText,
      createdAt: body.createdAt ? new Date(body.createdAt) : undefined,
    });

    return { entry, safety };
  },

  async list(filter: ListEntriesFilter): Promise<Entry[]> {
    return entriesRepository.list(filter);
  },

  async getById(id: string): Promise<Entry> {
    const entry = await entriesRepository.findById(id);
    if (!entry) throw new EntryNotFoundError(id);
    return entry;
  },

  async remove(id: string): Promise<void> {
    const deleted = await entriesRepository.delete(id);
    if (!deleted) throw new EntryNotFoundError(id);
  },
};
